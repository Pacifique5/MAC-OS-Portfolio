// Command engine for the portfolio Terminal.
//
// "Real" commands run genuinely in the browser (WebCrypto hashing, Base64, password
// generation, JWT decoding, same-origin ping and security-header checks).
// Network-recon tools (nmap, whois, traceroute, dig, netstat…) are *simulations*:
// they never send packets anywhere, and say so in their output.

import { PROJECTS as REPOS } from '../projects-data';
import { TRASH_ITEMS, TRASH_CATEGORIES } from '../trash-data';

export type LineKind = 'in' | 'out' | 'ok' | 'warn' | 'err' | 'info' | 'dim' | 'accent' | 'banner';

export const CANCELLED = Symbol('cancelled');

export interface TerminalContext {
  print: (text: string, kind?: LineKind) => number;
  update: (id: number, text: string, kind?: LineKind) => void;
  sleep: (ms: number) => Promise<void>;
  clear: () => void;
  open: (appId: string) => void;
  close: () => void;
  setTheme: (theme: ThemeName) => void;
  startMatrix: () => void;
  cwd: string;
  setCwd: (cwd: string) => void;
  history: string[];
  startedAt: number;
}

export type ThemeName = 'green' | 'amber' | 'cyan' | 'purple';

export const THEMES: Record<ThemeName, string> = {
  green: '#39ff7a',
  amber: '#ffb72b',
  cyan: '#2ee6ff',
  purple: '#c58bff',
};

type Group = 'portfolio' | 'system' | 'security' | 'ops' | 'fun';

interface Command {
  name: string;
  usage: string;
  desc: string;
  group: Group;
  run: (args: string[], ctx: TerminalContext) => void | Promise<void>;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const enc = new TextEncoder();

function hex(buf: ArrayBuffer | Uint8Array) {
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function digest(algo: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512', text: string) {
  return hex(await crypto.subtle.digest(algo, enc.encode(text)));
}

function toBase64(text: string) {
  let bin = '';
  enc.encode(text).forEach(b => { bin += String.fromCharCode(b); });
  return btoa(bin);
}

function fromBase64(b64: string) {
  const bin = atob(b64.replace(/-/g, '+').replace(/_/g, '/'));
  return new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0)));
}

/** Deterministic pseudo-random numbers so simulated scans look stable per host. */
function seeded(seedText: string) {
  let h = 2166136261;
  for (const c of seedText) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

function fakeIp(host: string) {
  const r = seeded(host);
  return `${Math.floor(r() * 200) + 20}.${Math.floor(r() * 255)}.${Math.floor(r() * 255)}.${Math.floor(r() * 254) + 1}`;
}

function pad(s: string, n: number) {
  return s.length >= n ? s : s + ' '.repeat(n - s.length);
}

function bar(pct: number, width = 24) {
  const filled = Math.round((pct / 100) * width);
  return `[${'█'.repeat(filled)}${'░'.repeat(width - filled)}] ${String(Math.round(pct)).padStart(3)}%`;
}

function formatUptime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m} min${m === 1 ? '' : 's'}, ${s % 60} secs` : `${s} secs`;
}

function browserName() {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return 'Microsoft Edge';
  if (/Chrome\//.test(ua)) return 'Chrome';
  if (/Firefox\//.test(ua)) return 'Firefox';
  if (/Safari\//.test(ua)) return 'Safari';
  return 'Unknown browser';
}

function levenshtein(a: string, b: string) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

const SIM_NOTE = '[sim] Simulated output — no packets left your browser.';

/* ------------------------------------------------------------------ */
/* Banner                                                              */
/* ------------------------------------------------------------------ */

const LETTERS: Record<string, string[]> = {
  P: ['██████╗ ', '██╔══██╗', '██████╔╝', '██╔═══╝ ', '██║     ', '╚═╝     '],
  A: [' █████╗ ', '██╔══██╗', '███████║', '██╔══██║', '██║  ██║', '╚═╝  ╚═╝'],
  C: [' ██████╗', '██╔════╝', '██║     ', '██║     ', '╚██████╗', ' ╚═════╝'],
  I: ['██╗', '██║', '██║', '██║', '██║', '╚═╝'],
  F: ['███████╗', '██╔════╝', '█████╗  ', '██╔══╝  ', '██║     ', '╚═╝     '],
  Q: [' ██████╗ ', '██╔═══██╗', '██║   ██║', '██║▄▄ ██║', '╚██████╔╝', ' ╚══▀▀═╝ '],
  U: ['██╗   ██╗', '██║   ██║', '██║   ██║', '██║   ██║', '╚██████╔╝', ' ╚═════╝ '],
  E: ['███████╗', '██╔════╝', '█████╗  ', '██╔══╝  ', '███████╗', '╚══════╝'],
};

export function bannerLines(word = 'PACIFIQUE') {
  return Array.from({ length: 6 }, (_, row) => [...word].map(ch => LETTERS[ch][row]).join(' '));
}

/* ------------------------------------------------------------------ */
/* Virtual filesystem                                                  */
/* ------------------------------------------------------------------ */

const FILES: Record<string, string[]> = {
  'about.txt': [
    'Mugisha Pacifique — Full-Stack Developer & Security Enthusiast',
    'Based in Rwanda. 3+ years building with Next.js, React, TypeScript and Python.',
    'Trained in cybersecurity, Linux, networking and DevOps (Cisco NetAcad, ThinkCyber, ALX).',
  ],
  'skills.txt': [
    'frontend   React · Next.js · TypeScript · Tailwind CSS · HTML5/CSS3',
    'backend    Node.js · Express · Python (Django/Flask/FastAPI) · Java · PHP/Laravel',
    'data       PostgreSQL · MongoDB · MySQL · Firebase',
    'security   Linux hardening · network security · ethical hacking fundamentals · OWASP',
    'devops     Git/GitHub Actions · Docker · AWS basics',
    'ai         OpenAI APIs · prompt engineering · TensorFlow · data analysis',
  ],
  'experience.txt': [
    '2024        ALX Africa ............ Software Engineering & AI Internship',
    '2024        Harvard (remote) ...... Global Remote Work & Professional Skills',
    '2023–2024   Code Alpha ............ Python & Web Development Internship',
    '2023        ThinkCyber ............ Cybersecurity & Systems Security',
    '2023        DTP Academy ........... DevOps & Software Engineering',
    '2022–2023   Cyberium .............. Linux, Python & Networking',
  ],
  'contact.txt': [
    'email     Pacifiquem58@gmail.com',
    'github    github.com/Pacifique5',
    'linkedin  linkedin.com/in/pacifique-mugisha-449a4a3b0',
    'x         x.com/_fiquem',
    'slack     codewithpacifique.slack.com',
  ],
  'README.md': [
    '# portfolio.local',
    'An interactive macOS-style portfolio. Try: neofetch, nmap, hashcat, headers, matrix.',
  ],
};

/** Real repositories from github.com/Pacifique5 */
const PROJECTS = REPOS.map(p => [p.repo.split('/').pop()!.toLowerCase(), `${p.name} — ${p.stack.slice(0, 3).join(', ')}`]);

/** Hash-cracking demo wordlist (top leaked passwords). */
const WORDLIST = [
  '123456', 'password', '123456789', '12345678', '12345', 'qwerty', 'abc123', 'password1', '111111', 'iloveyou',
  'admin', 'welcome', 'monkey', 'dragon', 'letmein', 'football', 'sunshine', 'master', 'shadow', 'princess',
  'superman', 'trustno1', 'hello', 'freedom', 'whatever', 'qazwsx', 'ninja', 'azerty', 'solo', 'starwars',
  'pacifique', 'portfolio', 'rwanda', 'kigali', 'hacker', 'root', 'toor', 'changeme', 'secret', 'passw0rd',
];

/* ------------------------------------------------------------------ */
/* Commands                                                            */
/* ------------------------------------------------------------------ */

const OPENABLE: Record<string, string> = {
  about: 'about', projects: 'projects', skills: 'skills', experience: 'experience', testimonials: 'testimonials',
  contact: 'contact', photos: 'photos', finder: 'finder', github: 'github', linkedin: 'linkedin', x: 'x', slack: 'slack', trash: 'trash',
};

const COMMANDS: Command[] = [
  /* ----------------------------- portfolio ----------------------------- */
  {
    name: 'about', usage: 'about', desc: 'Who I am', group: 'portfolio',
    run: (_a, c) => FILES['about.txt'].forEach(l => c.print(l)),
  },
  {
    name: 'skills', usage: 'skills', desc: 'Tech stack and security skills', group: 'portfolio',
    run: (_a, c) => FILES['skills.txt'].forEach(l => c.print(l, l.startsWith('security') ? 'accent' : 'out')),
  },
  {
    name: 'projects', usage: 'projects', desc: 'Things I have built', group: 'portfolio',
    run: (_a, c) => {
      const width = Math.max(...PROJECTS.map(([n]) => n.length)) + 2;
      PROJECTS.forEach(([n, d]) => c.print(`${pad(n, width)}${d}`));
      c.print("Run 'open projects' to see them in the Projects app.", 'dim');
    },
  },
  {
    name: 'experience', usage: 'experience', desc: 'Internships and training', group: 'portfolio',
    run: (_a, c) => FILES['experience.txt'].forEach(l => c.print(l)),
  },
  {
    name: 'contact', usage: 'contact', desc: 'How to reach me', group: 'portfolio',
    run: (_a, c) => FILES['contact.txt'].forEach(l => c.print(l, 'info')),
  },
  {
    name: 'open', usage: 'open <app>', desc: 'Open a portfolio app (about, projects, photos…)', group: 'portfolio',
    run: (a, c) => {
      const target = OPENABLE[(a[0] ?? '').toLowerCase()];
      if (!target) {
        c.print(`usage: open <${Object.keys(OPENABLE).join('|')}>`, 'warn');
        return;
      }
      c.print(`Opening ${a[0]}…`, 'ok');
      c.open(target);
    },
  },
  {
    name: 'trash', usage: 'trash', desc: 'Habits I left behind (ls ~/.Trash)', group: 'portfolio',
    run: (_a, c) => {
      TRASH_CATEGORIES.forEach(cat => {
        c.print(`# ${cat}`, 'accent');
        TRASH_ITEMS.filter(i => i.category === cat).forEach(i => c.print(`  ${i.name}  ->  ${i.replacedBy}`));
      });
      c.print("Run 'rm -rf bad-habits' to empty it, or 'open trash' for details.", 'dim');
    },
  },
  {
    name: 'rm', usage: 'rm -rf <path>', desc: 'Remove files', group: 'system',
    run: async (a, c) => {
      const target = a.filter(x => !x.startsWith('-')).join(' ');
      if (!target) { c.print('usage: rm -rf <path>', 'warn'); return; }
      if (target === '/' || target === '/*' || target === '~') {
        c.print('rm: refusing to remove that. Nice try.', 'err');
        return;
      }
      if (!/bad-habits|\.?trash/i.test(target)) {
        c.print(`rm: ${target}: Permission denied (this portfolio is read-only)`, 'err');
        return;
      }
      for (const i of TRASH_ITEMS) {
        c.print(`removed '${i.name}'`, 'dim');
        await c.sleep(60);
      }
      c.print(`${TRASH_ITEMS.length} habits removed. Lessons kept: ${TRASH_ITEMS.length}.`, 'ok');
    },
  },

  /* ------------------------------ system ------------------------------- */
  {
    name: 'help', usage: 'help', desc: 'List all commands', group: 'system',
    run: (_a, c) => {
      const groups: [Group, string][] = [
        ['portfolio', 'PORTFOLIO'], ['security', 'SECURITY TOOLS'], ['ops', 'LIVE OPS (simulated)'], ['system', 'SYSTEM'], ['fun', 'FUN'],
      ];
      groups.forEach(([g, title]) => {
        c.print('');
        c.print(`  ${title}`, 'accent');
        COMMANDS.filter(cmd => cmd.group === g).forEach(cmd => c.print(`    ${pad(cmd.usage, 26)}${cmd.desc}`));
      });
      c.print('');
      c.print('  Tips: ↑/↓ history · Tab autocomplete · Ctrl+C cancel · Ctrl+L clear', 'dim');
      c.print('  Network recon tools are simulated; crypto tools run for real in your browser.', 'dim');
    },
  },
  {
    name: 'clear', usage: 'clear', desc: 'Clear the screen', group: 'system',
    run: (_a, c) => c.clear(),
  },
  {
    name: 'whoami', usage: 'whoami', desc: 'Current user', group: 'system',
    run: (_a, c) => c.print('pacifique'),
  },
  {
    name: 'id', usage: 'id', desc: 'User and group IDs', group: 'system',
    run: (_a, c) => c.print('uid=1000(pacifique) gid=1000(pacifique) groups=1000(pacifique),4(adm),24(cdrom),27(sudo),1337(blue-team)'),
  },
  {
    name: 'pwd', usage: 'pwd', desc: 'Print working directory', group: 'system',
    run: (_a, c) => c.print(c.cwd === '~' ? '/home/pacifique' : '/home/pacifique/projects'),
  },
  {
    name: 'ls', usage: 'ls [-la]', desc: 'List files', group: 'system',
    run: (a, c) => {
      const long = a.some(x => x.startsWith('-') && x.includes('l'));
      const all = a.some(x => x.startsWith('-') && x.includes('a'));
      if (c.cwd === '~/projects') {
        PROJECTS.forEach(([n]) => c.print(long ? `drwxr-xr-x  pacifique  4096  ${n}/` : `${n}/`, 'info'));
        return;
      }
      const entries = [
        ...(all ? [['.secrets', '-rw-------', 'warn'], ['.zshrc', '-rw-r--r--', 'dim']] : []),
        ['projects', 'drwxr-xr-x', 'info'],
        ...Object.keys(FILES).map(f => [f, '-rw-r--r--', 'out']),
      ] as [string, string, LineKind][];
      if (long) entries.forEach(([n, perm, k]) => c.print(`${perm}  pacifique  ${String(n.length * 97).padStart(4)}  ${n}${perm.startsWith('d') ? '/' : ''}`, k));
      else c.print(entries.map(([n, perm]) => (perm.startsWith('d') ? `${n}/` : n)).join('   '));
    },
  },
  {
    name: 'cd', usage: 'cd <dir>', desc: 'Change directory', group: 'system',
    run: (a, c) => {
      const d = a[0] ?? '~';
      if (d === '~' || d === '..' || d === '/home/pacifique') c.setCwd('~');
      else if (d.replace(/\/$/, '') === 'projects' && c.cwd === '~') c.setCwd('~/projects');
      else c.print(`cd: no such file or directory: ${d}`, 'err');
    },
  },
  {
    name: 'cat', usage: 'cat <file>', desc: 'Print a file', group: 'system',
    run: (a, c) => {
      const f = a[0];
      if (!f) return void c.print('usage: cat <file>', 'warn');
      if (f === '.secrets') return void c.print('cat: .secrets: Permission denied', 'err');
      if (f === '.zshrc') {
        ['export EDITOR=nvim', "alias hire='open contact'", 'setopt HIST_IGNORE_DUPS'].forEach(l => c.print(l, 'dim'));
        return;
      }
      const lines = FILES[f];
      if (!lines) return void c.print(`cat: ${f}: No such file or directory`, 'err');
      lines.forEach(l => c.print(l));
    },
  },
  {
    name: 'echo', usage: 'echo <text>', desc: 'Print text', group: 'system',
    run: (a, c) => c.print(a.join(' ')),
  },
  {
    name: 'date', usage: 'date', desc: 'Current date and time', group: 'system',
    run: (_a, c) => c.print(new Date().toString()),
  },
  {
    name: 'uname', usage: 'uname [-a]', desc: 'System information', group: 'system',
    run: (a, c) => c.print(a.includes('-a') ? 'PortfolioOS 26.1 portfolio.local 6.9.0-pacifique #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux' : 'PortfolioOS'),
  },
  {
    name: 'neofetch', usage: 'neofetch', desc: 'System summary (real browser info)', group: 'system',
    run: (_a, c) => {
      const art = [
        '      .--.            ',
        "     /.-. '----------.",
        "     \\'-' .--\"--\"\"-\"-'",
        "      '--'            ",
        '                      ',
        '   secure  shell      ',
      ];
      const info: [string, string][] = [
        ['', 'pacifique@portfolio'],
        ['', '───────────────────'],
        ['OS', 'PortfolioOS 26.1 (macOS-style)'],
        ['Host', window.location.host || 'portfolio.local'],
        ['Kernel', '6.9.0-pacifique'],
        ['Uptime', formatUptime(performance.now() - c.startedAt)],
        ['Shell', 'zsh 5.9'],
        ['Resolution', `${window.screen.width}x${window.screen.height}`],
        ['Browser', browserName()],
        ['CPU', `${navigator.hardwareConcurrency ?? '?'} logical cores`],
        ['Memory', (navigator as Navigator & { deviceMemory?: number }).deviceMemory ? `≥ ${(navigator as Navigator & { deviceMemory?: number }).deviceMemory} GB` : 'unknown'],
        ['Timezone', Intl.DateTimeFormat().resolvedOptions().timeZone],
        ['Stack', 'Next.js · React · TypeScript'],
      ];
      info.forEach(([k, v], i) => {
        const left = art[i] ?? ' '.repeat(22);
        c.print(`${left}   ${k ? `${k}: ` : ''}${v}`, i === 0 ? 'accent' : k ? 'out' : 'dim');
      });
      c.print('');
      c.print(`${' '.repeat(25)}███ ███ ███ ███ ███ ███ ███ ███`, 'banner');
    },
  },
  {
    name: 'history', usage: 'history', desc: 'Command history', group: 'system',
    run: (_a, c) => c.history.forEach((h, i) => c.print(`${String(i + 1).padStart(4)}  ${h}`)),
  },
  {
    name: 'theme', usage: 'theme <green|amber|cyan|purple>', desc: 'Change terminal colour', group: 'system',
    run: (a, c) => {
      const t = a[0] as ThemeName;
      if (!THEMES[t]) return void c.print(`usage: theme <${Object.keys(THEMES).join('|')}>`, 'warn');
      c.setTheme(t);
      c.print(`Theme set to ${t}.`, 'ok');
    },
  },
  {
    name: 'sudo', usage: 'sudo <cmd>', desc: 'Run as superuser', group: 'system',
    run: async (_a, c) => {
      c.print('[sudo] password for pacifique: ', 'dim');
      await c.sleep(900);
      c.print('pacifique is not in the sudoers file. This incident will be reported.', 'err');
    },
  },
  {
    name: 'exit', usage: 'exit', desc: 'Close the terminal', group: 'system',
    run: (_a, c) => c.close(),
  },

  /* ----------------------------- security ------------------------------ */
  {
    name: 'nmap', usage: 'nmap [host]', desc: 'Port scan (simulated)', group: 'security',
    run: async (a, c) => {
      const host = a.filter(x => !x.startsWith('-'))[0] ?? 'portfolio.local';
      const own = host === 'portfolio.local' || host === window.location.hostname;
      const ip = own ? '10.0.13.37' : fakeIp(host);
      const r = seeded(host);
      c.print(`Starting Nmap 7.95 ( https://nmap.org ) at ${new Date().toISOString().replace('T', ' ').slice(0, 16)}`);
      await c.sleep(500);
      c.print(`Nmap scan report for ${host} (${ip})`);
      c.print(`Host is up (0.000${Math.floor(r() * 900) + 100}s latency).`);
      await c.sleep(400);
      const ports: [string, string, string, string][] = own
        ? [
            ['22/tcp', 'open', 'ssh', 'OpenSSH 9.6p1'],
            ['80/tcp', 'open', 'http', 'nginx 1.25 (redirects to 443)'],
            ['443/tcp', 'open', 'https', 'Next.js 16 / Vercel Edge'],
            ['3000/tcp', 'open', 'http', 'Node.js dev server'],
            ['5432/tcp', 'filtered', 'postgresql', ''],
          ]
        : [['22/tcp', 'ssh', 'OpenSSH 8.9'], ['53/tcp', 'domain', 'ISC BIND 9.18'], ['80/tcp', 'http', 'Apache 2.4'], ['443/tcp', 'https', 'nginx'], ['3306/tcp', 'mysql', 'MySQL 8.0'], ['8080/tcp', 'http-proxy', 'Squid 5.7']]
            .filter(() => r() > 0.35)
            .map(([p, s, v]) => [p, r() > 0.2 ? 'open' : 'filtered', s, v]);
      c.print(`Not shown: ${1000 - ports.length} closed tcp ports (reset)`, 'dim');
      c.print(`${pad('PORT', 10)}${pad('STATE', 10)}${pad('SERVICE', 12)}VERSION`, 'info');
      for (const [p, st, s, v] of ports) {
        await c.sleep(260);
        c.print(`${pad(p, 10)}${pad(st, 10)}${pad(s, 12)}${v}`, st === 'open' ? 'ok' : 'warn');
      }
      await c.sleep(300);
      c.print(`Nmap done: 1 IP address (1 host up) scanned in ${(1.2 + r() * 2).toFixed(2)} seconds`);
      c.print(SIM_NOTE, 'dim');
    },
  },
  {
    name: 'whois', usage: 'whois <domain>', desc: 'Domain registration lookup (simulated)', group: 'security',
    run: async (a, c) => {
      const d = a.filter(x => !x.startsWith('-') && !/^\d+$/.test(x))[0] ?? 'portfolio.local';
      const r = seeded(d);
      const year = 2005 + Math.floor(r() * 18);
      c.print(`[Querying whois.iana.org for ${d}]`, 'dim');
      await c.sleep(600);
      [
        `Domain Name: ${d.toUpperCase()}`,
        `Registry Domain ID: ${Math.floor(r() * 9e9)}_DOMAIN_COM-VRSN`,
        'Registrar: Example Registrar, LLC',
        `Creation Date: ${year}-0${1 + Math.floor(r() * 8)}-1${Math.floor(r() * 9)}T08:21:44Z`,
        `Registry Expiry Date: ${2027 + Math.floor(r() * 4)}-0${1 + Math.floor(r() * 8)}-1${Math.floor(r() * 9)}T08:21:44Z`,
        'Domain Status: clientTransferProhibited',
        `Name Server: NS1.${d.toUpperCase()}`,
        `Name Server: NS2.${d.toUpperCase()}`,
        'DNSSEC: signedDelegation',
      ].forEach(l => c.print(l));
      c.print(SIM_NOTE, 'dim');
    },
  },
  {
    name: 'dig', usage: 'dig <domain>', desc: 'DNS lookup (simulated)', group: 'security',
    run: async (a, c) => {
      const d = a.filter(x => !x.startsWith('-') && !/^\d+$/.test(x))[0] ?? window.location.hostname;
      c.print(`; <<>> DiG 9.18.24 <<>> ${d}`, 'dim');
      await c.sleep(450);
      c.print(';; ANSWER SECTION:', 'info');
      c.print(`${pad(`${d}.`, 30)}300  IN  A     ${fakeIp(d)}`);
      c.print(`${pad(`${d}.`, 30)}300  IN  AAAA  2606:4700::${fakeIp(d + '6').split('.').slice(0, 2).join(':')}`);
      c.print(`;; Query time: ${Math.floor(seeded(d)() * 40) + 8} msec`, 'dim');
      c.print(SIM_NOTE, 'dim');
    },
  },
  {
    name: 'ping', usage: 'ping [host]', desc: 'Latency test (real for this site)', group: 'security',
    run: async (a, c) => {
      const host = a.filter(x => !x.startsWith('-') && !/^\d+$/.test(x))[0] ?? window.location.host;
      const own = host === window.location.host || host === window.location.hostname || host === 'portfolio.local';
      c.print(`PING ${host}: 56 data bytes${own ? ' (real HTTP round-trip to this site)' : ''}`);
      const times: number[] = [];
      const r = seeded(host);
      for (let i = 0; i < 4; i++) {
        let t: number;
        if (own) {
          const start = performance.now();
          try { await fetch(window.location.origin, { method: 'HEAD', cache: 'no-store' }); } catch { /* offline */ }
          t = performance.now() - start;
        } else {
          t = 18 + r() * 60;
        }
        times.push(t);
        c.print(`64 bytes from ${own ? host : fakeIp(host)}: icmp_seq=${i} ttl=${own ? 64 : 54} time=${t.toFixed(3)} ms`, 'ok');
        await c.sleep(700);
      }
      const avg = times.reduce((x, y) => x + y, 0) / times.length;
      c.print(`--- ${host} ping statistics ---`, 'info');
      c.print(`4 packets transmitted, 4 packets received, 0.0% packet loss`);
      c.print(`round-trip min/avg/max = ${Math.min(...times).toFixed(3)}/${avg.toFixed(3)}/${Math.max(...times).toFixed(3)} ms`);
      if (!own) c.print(SIM_NOTE, 'dim');
    },
  },
  {
    name: 'traceroute', usage: 'traceroute <host>', desc: 'Route tracing (simulated)', group: 'security',
    run: async (a, c) => {
      const host = a.filter(x => !x.startsWith('-') && !/^\d+$/.test(x))[0] ?? 'github.com';
      const r = seeded(host);
      c.print(`traceroute to ${host} (${fakeIp(host)}), 30 hops max, 60 byte packets`);
      const hops = ['router.local (192.168.1.1)', 'isp-gw.kigali.rw', 'core1.kgl.liquidtelecom.net', 'ae-12.nbo.seacom.net', 'ix-mba.cloudflare.net', `edge.${host}`];
      for (let i = 0; i < hops.length; i++) {
        await c.sleep(380);
        const base = 2 + i * 14 + r() * 8;
        c.print(`${String(i + 1).padStart(2)}  ${pad(hops[i], 36)}${base.toFixed(3)} ms  ${(base + r() * 3).toFixed(3)} ms  ${(base + r() * 4).toFixed(3)} ms`);
      }
      c.print(SIM_NOTE, 'dim');
    },
  },
  {
    name: 'ifconfig', usage: 'ifconfig', desc: 'Network interfaces (simulated)', group: 'security',
    run: (_a, c) => {
      [
        ['lo0: flags=8049<UP,LOOPBACK,RUNNING> mtu 16384', 'info'],
        ['      inet 127.0.0.1 netmask 0xff000000', 'out'],
        ['en0: flags=8863<UP,BROADCAST,RUNNING,MULTICAST> mtu 1500', 'info'],
        ['      ether 3c:22:fb:13:37:00', 'out'],
        ['      inet 10.0.13.37 netmask 0xffffff00 broadcast 10.0.13.255', 'out'],
        ['utun3: flags=8051<UP,POINTOPOINT,RUNNING> mtu 1380   # WireGuard', 'info'],
        ['      inet 10.66.0.2 --> 10.66.0.1', 'out'],
      ].forEach(([l, k]) => c.print(l, k as LineKind));
      c.print(SIM_NOTE, 'dim');
    },
  },
  {
    name: 'netstat', usage: 'netstat', desc: 'Active connections (simulated)', group: 'security',
    run: (_a, c) => {
      c.print(`${pad('Proto', 7)}${pad('Local Address', 24)}${pad('Foreign Address', 26)}State`, 'info');
      [
        ['tcp4', '10.0.13.37.52114', 'github.com.443', 'ESTABLISHED'],
        ['tcp4', '10.0.13.37.52120', 'vercel.app.443', 'ESTABLISHED'],
        ['tcp4', '*.22', '*.*', 'LISTEN'],
        ['tcp4', '127.0.0.1.3000', '*.*', 'LISTEN'],
        ['udp4', '10.66.0.2.51820', '*.*', ''],
      ].forEach(([p, l, f, s]) => c.print(`${pad(p, 7)}${pad(l, 24)}${pad(f, 26)}${s}`, s === 'LISTEN' ? 'warn' : 'out'));
      c.print(SIM_NOTE, 'dim');
    },
  },
  {
    name: 'headers', usage: 'headers', desc: 'Audit this site’s security headers (real)', group: 'security',
    run: async (_a, c) => {
      c.print(`[*] Fetching ${window.location.origin} …`, 'info');
      let res: Response;
      try {
        res = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
      } catch {
        return void c.print('[!] Request failed — are you offline?', 'err');
      }
      await c.sleep(300);
      c.print(`[+] HTTP ${res.status} · server: ${res.headers.get('server') ?? 'hidden'}`, 'ok');
      const checks: [string, string][] = [
        ['strict-transport-security', 'Forces HTTPS (HSTS)'],
        ['content-security-policy', 'Restricts script/style sources'],
        ['x-frame-options', 'Blocks clickjacking'],
        ['x-content-type-options', 'Stops MIME sniffing'],
        ['referrer-policy', 'Limits referrer leakage'],
        ['permissions-policy', 'Restricts browser features'],
      ];
      let score = 0;
      for (const [h, why] of checks) {
        await c.sleep(180);
        const v = res.headers.get(h);
        if (v) score++;
        c.print(`  ${v ? '[PASS]' : '[MISS]'} ${pad(h, 28)}${why}`, v ? 'ok' : 'warn');
      }
      const grade = ['F', 'E', 'D', 'C', 'B', 'A', 'A+'][score];
      c.print(`[=] Security header grade: ${grade} (${score}/${checks.length})`, score >= 4 ? 'ok' : 'warn');
    },
  },
  {
    name: 'hash', usage: 'hash [sha1|sha256|sha512] <text>', desc: 'Hash text with WebCrypto (real)', group: 'security',
    run: async (a, c) => {
      const algos: Record<string, 'SHA-1' | 'SHA-256' | 'SHA-512'> = { sha1: 'SHA-1', sha256: 'SHA-256', sha512: 'SHA-512' };
      const algo = algos[a[0]?.toLowerCase()] ? algos[a.shift()!.toLowerCase()] : 'SHA-256';
      const text = a.join(' ');
      if (!text) return void c.print('usage: hash [sha1|sha256|sha512] <text>', 'warn');
      c.print(`${algo}("${text}")`, 'dim');
      c.print(await digest(algo, text), 'ok');
    },
  },
  {
    name: 'base64', usage: 'base64 [-d] <text>', desc: 'Encode / decode Base64 (real)', group: 'security',
    run: (a, c) => {
      const decode = a[0] === '-d';
      const text = (decode ? a.slice(1) : a).join(' ');
      if (!text) return void c.print('usage: base64 [-d] <text>', 'warn');
      try {
        c.print(decode ? fromBase64(text) : toBase64(text), 'ok');
      } catch {
        c.print('base64: invalid input', 'err');
      }
    },
  },
  {
    name: 'passgen', usage: 'passgen [length]', desc: 'Generate a strong password (real)', group: 'security',
    run: (a, c) => {
      const len = Math.min(128, Math.max(8, Number(a[0]) || 20));
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_=+';
      const rnd = crypto.getRandomValues(new Uint32Array(len));
      const pw = [...rnd].map(n => chars[n % chars.length]).join('');
      const bits = Math.round(len * Math.log2(chars.length));
      c.print(pw, 'ok');
      c.print(`entropy ≈ ${bits} bits · ${bits >= 100 ? 'excellent' : bits >= 70 ? 'strong' : 'fair'} · generated with crypto.getRandomValues`, 'dim');
    },
  },
  {
    name: 'openssl', usage: 'openssl rand -hex <bytes>', desc: 'Random bytes (real)', group: 'security',
    run: (a, c) => {
      if (a[0] !== 'rand') return void c.print('usage: openssl rand -hex <bytes>', 'warn');
      const n = Math.min(256, Math.max(1, Number(a[a.length - 1]) || 16));
      const bytes = crypto.getRandomValues(new Uint8Array(n));
      c.print(a.includes('-base64') ? btoa(String.fromCharCode(...bytes)) : hex(bytes), 'ok');
    },
  },
  {
    name: 'jwt', usage: 'jwt <token>', desc: 'Decode a JSON Web Token (real, local)', group: 'security',
    run: (a, c) => {
      const parts = (a[0] ?? '').split('.');
      if (parts.length < 2) return void c.print('usage: jwt <header.payload.signature>', 'warn');
      try {
        c.print('HEADER', 'accent');
        JSON.stringify(JSON.parse(fromBase64(parts[0])), null, 2).split('\n').forEach(l => c.print(l, 'info'));
        c.print('PAYLOAD', 'accent');
        const payload = JSON.parse(fromBase64(parts[1]));
        JSON.stringify(payload, null, 2).split('\n').forEach(l => c.print(l, 'info'));
        if (payload.exp) c.print(`expires: ${new Date(payload.exp * 1000).toISOString()}${payload.exp * 1000 < Date.now() ? '  (EXPIRED)' : ''}`, payload.exp * 1000 < Date.now() ? 'warn' : 'ok');
        c.print('Signature not verified — decoding only. Never trust an unverified JWT.', 'dim');
      } catch {
        c.print('jwt: malformed token', 'err');
      }
    },
  },
  {
    name: 'hashcat', usage: 'hashcat <sha1|sha256 hash>', desc: 'Dictionary attack demo on a hash (real)', group: 'security',
    run: async (a, c) => {
      const target = (a[0] ?? '').toLowerCase();
      const algo = target.length === 40 ? 'SHA-1' : target.length === 64 ? 'SHA-256' : null;
      if (!algo) {
        c.print('usage: hashcat <sha1|sha256 hash>', 'warn');
        c.print('try:   hashcat 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'dim');
        return;
      }
      c.print(`hashcat (v6.2.6) starting · mode: ${algo} · wordlist: top-${WORDLIST.length} leaked passwords`, 'info');
      const line = c.print(bar(0));
      for (let i = 0; i < WORDLIST.length; i++) {
        const word = WORDLIST[i];
        if ((await digest(algo, word)) === target) {
          c.update(line, bar(100), 'ok');
          c.print(`${target}:${word}`, 'ok');
          c.print(`Status: Cracked in ${i + 1} guesses. Lesson: never use common passwords.`, 'accent');
          return;
        }
        c.update(line, `${bar(((i + 1) / WORDLIST.length) * 100)}  trying: ${word}`);
        await c.sleep(45);
      }
      c.print('Status: Exhausted — not in the demo wordlist. A strong, unique password survives this.', 'warn');
    },
  },

  /* -------------------------------- fun -------------------------------- */
  {
    name: 'matrix', usage: 'matrix', desc: 'Enter the Matrix (any key exits)', group: 'fun',
    run: (_a, c) => c.startMatrix(),
  },
  {
    name: 'hack', usage: 'hack', desc: 'Hollywood hacking sequence (totally fake)', group: 'fun',
    run: async (_a, c) => {
      const steps = ['Bypassing mainframe firewall', 'Injecting polymorphic payload', 'Decrypting 4096-bit RSA keys', 'Rerouting through 7 proxies', 'Downloading the internet'];
      for (const s of steps) {
        const id = c.print(`[*] ${pad(s, 34)}${bar(0, 20)}`, 'info');
        for (let p = 0; p <= 100; p += 10 + Math.floor(Math.random() * 15)) {
          c.update(id, `[*] ${pad(s, 34)}${bar(Math.min(p, 100), 20)}`, 'info');
          await c.sleep(70);
        }
        c.update(id, `[+] ${pad(s, 34)}${bar(100, 20)}`, 'ok');
      }
      await c.sleep(300);
      c.print('');
      c.print('  >>> ACCESS GRANTED <<<', 'accent');
      c.print("  …just kidding. Real security is patient work. Want it on your team? Type 'open contact'.", 'dim');
    },
  },
  {
    name: 'coffee', usage: 'coffee', desc: 'Refuel the developer', group: 'fun',
    run: (_a, c) => {
      ['      ( (', '       ) )', '    ........', '    |      |]', '    \\      /', "     `----'"].forEach(l => c.print(l, 'warn'));
      c.print('Brewing… compile speed +20%.', 'ok');
    },
  },
];

/* ------------------------------------------------------------------ */
/* Live ops — simulated day-to-day dev & blue-team commands            */
/* ------------------------------------------------------------------ */

const LAB_HOSTS = [
  'portfolio.local', 'gateway.lan', 'db.internal', 'api.internal', 'cache-01.internal', 'cache-02.internal',
  'vpn.edge.lab', 'honeypot.lab', 'k8s-node-1.lab', 'k8s-node-2.lab', 'k8s-node-3.lab', 'siem.lab',
  'mail.corp.test', 'files.corp.test', 'staging.corp.test', 'ci.corp.test', 'grafana.lab', 'vault.internal',
  '10.0.13.1', '10.0.13.10', '10.0.13.21', '10.0.13.37', '10.0.13.42', '10.0.13.77', '10.0.13.99',
  '192.168.56.10', '192.168.56.20', '172.16.4.2', '172.16.4.8', '172.16.4.33',
];
const LAB_DOMAINS = [
  'example.com', 'example.net', 'example.org', 'portfolio.local', 'corp.test', 'staging.corp.test',
  'lab.internal', 'honeypot.lab', 'blue-team.test', 'kigali.lab', 'secure-campus.test', 'cyberforge.test',
];
const WORDS = [
  'hire-pacifique', 'zero-trust', 'defense-in-depth', 'blue-team', 'least-privilege', 'kigali', 'portfolio',
  'nextjs', 'incident-42', 'patch-tuesday', 'mfa-everywhere', 'secure-by-design', 'threat-model', 'rotate-keys',
  'audit-log', 'backup-3-2-1', 'cyber-forge', 'secure-campus', 'edusphere', 'symptom-ai', 'bio-access',
  'webauthn', 'jwt-rotation', 'rbac', 'owasp-top-10', 'csp-strict', 'hsts-preload', 'sbom', 'sast', 'dast',
];
const SERVICES = ['nginx', 'postgresql', 'redis', 'docker', 'sshd', 'fail2ban', 'suricata', 'node-api', 'grafana', 'prometheus'];
const REPO_SLUGS = REPOS.map(p => p.repo.split('/').pop()!);
const ATTACKER_IPS = ['185.220.101.4', '45.95.147.12', '103.145.13.90', '194.26.29.113', '89.248.165.52', '141.98.11.7', '61.177.172.140', '218.92.0.31'];

const pick = <T,>(arr: T[], r: () => number) => arr[Math.floor(r() * arr.length)];
const rnd = () => Math.random();
const stamp = () => new Date().toTimeString().slice(0, 8);

const OPS_COMMANDS: Command[] = [
  {
    name: 'git', usage: 'git <status|log|pull>', desc: 'Repository status (simulated)', group: 'ops',
    run: async (a, c) => {
      const sub = a[0] ?? 'status';
      const repo = a.find(x => REPO_SLUGS.includes(x)) ?? pick(REPO_SLUGS, rnd);
      if (sub === 'log') {
        ['feat: add role-based dashboards', 'fix: sanitize user input', 'chore: bump dependencies', 'test: cover auth flows', 'perf: cache API responses']
          .forEach(m => c.print(`${Math.random().toString(16).slice(2, 9)} ${m}`, 'out'));
        return;
      }
      if (sub === 'pull') {
        c.print(`From github.com:Pacifique5/${repo}`, 'dim');
        await c.sleep(350);
        c.print(` * branch            main       -> FETCH_HEAD`, 'dim');
        c.print(`Fast-forward  ${Math.ceil(rnd() * 9)} files changed, ${Math.ceil(rnd() * 240)} insertions(+), ${Math.ceil(rnd() * 60)} deletions(-)`, 'ok');
        return;
      }
      c.print(`On branch main — ${repo}`, 'info');
      c.print("Your branch is up to date with 'origin/main'.");
      c.print('nothing to commit, working tree clean', 'ok');
    },
  },
  {
    name: 'docker', usage: 'docker ps', desc: 'Running containers (simulated)', group: 'ops',
    run: (_a, c) => {
      c.print(`${pad('CONTAINER ID', 15)}${pad('IMAGE', 24)}${pad('STATUS', 18)}PORTS`, 'info');
      [['api', 'node:20-alpine', '3000'], ['db', 'postgres:16', '5432'], ['cache', 'redis:7', '6379'], ['proxy', 'nginx:1.25', '443']]
        .forEach(([n, img, port]) => c.print(`${pad(Math.random().toString(16).slice(2, 14), 15)}${pad(img, 24)}${pad(`Up ${Math.ceil(rnd() * 72)} hours`, 18)}0.0.0.0:${port}->${port}/tcp  ${n}`, 'out'));
    },
  },
  {
    name: 'npm', usage: 'npm <run build|audit>', desc: 'Build and audit (simulated)', group: 'ops',
    run: async (a, c) => {
      if (a[0] === 'audit') {
        c.print(`audited ${800 + Math.floor(rnd() * 600)} packages in ${(rnd() * 3 + 1).toFixed(1)}s`);
        c.print('found 0 vulnerabilities', 'ok');
        return;
      }
      c.print('> next build', 'dim');
      await c.sleep(500);
      c.print('  Creating an optimized production build ...', 'dim');
      await c.sleep(700);
      c.print(`✓ Compiled successfully in ${(rnd() * 20 + 8).toFixed(1)}s`, 'ok');
      c.print('✓ Generating static pages (4/4)', 'ok');
    },
  },
  {
    name: 'tail', usage: 'tail /var/log/auth.log', desc: 'Watch auth log (simulated)', group: 'ops',
    run: async (_a, c) => {
      for (let i = 0; i < 4; i++) {
        await c.sleep(260);
        const ip = pick(ATTACKER_IPS, rnd);
        const user = pick(['root', 'admin', 'test', 'oracle', 'ubuntu'], rnd);
        c.print(`${stamp()} sshd[${1000 + Math.floor(rnd() * 9000)}]: Failed password for invalid user ${user} from ${ip} port ${30000 + Math.floor(rnd() * 30000)} ssh2`, 'warn');
      }
      c.print(`${stamp()} fail2ban.actions: NOTICE [sshd] Ban ${pick(ATTACKER_IPS, rnd)}`, 'ok');
    },
  },
  {
    name: 'ufw', usage: 'ufw status', desc: 'Firewall rules (simulated)', group: 'ops',
    run: (_a, c) => {
      c.print('Status: active', 'ok');
      c.print(`${pad('To', 22)}${pad('Action', 12)}From`, 'info');
      [['22/tcp (OpenSSH)', 'LIMIT', 'Anywhere'], ['443/tcp', 'ALLOW', 'Anywhere'], ['80/tcp', 'ALLOW', 'Anywhere'], ['5432/tcp', 'DENY', 'Anywhere']]
        .forEach(([t, act, f]) => c.print(`${pad(t, 22)}${pad(act, 12)}${f}`, act === 'DENY' ? 'warn' : 'out'));
    },
  },
  {
    name: 'fail2ban-client', usage: 'fail2ban-client status sshd', desc: 'Intrusion prevention (simulated)', group: 'ops',
    run: (_a, c) => {
      const banned = ATTACKER_IPS.filter(() => rnd() > 0.5);
      c.print('Status for the jail: sshd', 'info');
      c.print(`|- Filter  Currently failed: ${Math.floor(rnd() * 12)}  Total failed: ${200 + Math.floor(rnd() * 900)}`);
      c.print(`\`- Actions Currently banned: ${banned.length}  Total banned: ${40 + Math.floor(rnd() * 200)}`);
      if (banned.length) c.print(`   Banned IP list: ${banned.join(' ')}`, 'warn');
    },
  },
  {
    name: 'lynis', usage: 'lynis audit system', desc: 'Hardening audit (simulated)', group: 'ops',
    run: async (_a, c) => {
      for (const t of ['Boot and services', 'Kernel hardening', 'Authentication', 'File permissions', 'SSH configuration', 'Firewalls']) {
        await c.sleep(180);
        c.print(`[+] ${pad(t, 26)}[ ${rnd() > 0.15 ? 'OK' : 'SUGGESTION'} ]`, 'ok');
      }
      c.print(`Hardening index : ${78 + Math.floor(rnd() * 15)} [##############      ]`, 'accent');
    },
  },
  {
    name: 'clamscan', usage: 'clamscan -r <dir>', desc: 'Malware scan (simulated)', group: 'ops',
    run: async (a, c) => {
      const dir = a.find(x => !x.startsWith('-')) ?? '~/Downloads';
      c.print(`Scanning ${dir} …`, 'dim');
      await c.sleep(700);
      c.print('----------- SCAN SUMMARY -----------', 'info');
      c.print(`Scanned files: ${100 + Math.floor(rnd() * 900)}`);
      c.print('Infected files: 0', 'ok');
    },
  },
  {
    name: 'ss', usage: 'ss -tulpn', desc: 'Listening sockets (simulated)', group: 'ops',
    run: (_a, c) => {
      c.print(`${pad('Netid', 7)}${pad('State', 9)}${pad('Local Address:Port', 24)}Process`, 'info');
      [['tcp', '0.0.0.0:22', 'sshd'], ['tcp', '0.0.0.0:443', 'nginx'], ['tcp', '127.0.0.1:5432', 'postgres'], ['tcp', '127.0.0.1:6379', 'redis-server'], ['udp', '0.0.0.0:51820', 'wireguard']]
        .forEach(([n, addr, p]) => c.print(`${pad(n, 7)}${pad('LISTEN', 9)}${pad(addr, 24)}users:(("${p}"))`));
    },
  },
  {
    name: 'systemctl', usage: 'systemctl status <service>', desc: 'Service health (simulated)', group: 'ops',
    run: (a, c) => {
      const svc = a.find(x => SERVICES.includes(x)) ?? pick(SERVICES, rnd);
      c.print(`● ${svc}.service`, 'info');
      c.print(`     Active: active (running) since ${new Date(Date.now() - rnd() * 6e8).toUTCString()}`, 'ok');
      c.print(`     Memory: ${(rnd() * 180 + 12).toFixed(1)}M   CPU: ${(rnd() * 40).toFixed(2)}s`);
    },
  },
  {
    name: 'curl', usage: 'curl -I <url>', desc: 'HTTP headers (simulated)', group: 'ops',
    run: (a, c) => {
      const url = a.find(x => !x.startsWith('-')) ?? 'https://portfolio.local';
      c.print('HTTP/2 200', 'ok');
      [`server: nginx`, `content-type: text/html; charset=utf-8`, `strict-transport-security: max-age=63072000; includeSubDomains; preload`, `x-frame-options: DENY`, `x-content-type-options: nosniff`, `content-security-policy: default-src 'self'`]
        .forEach(h => c.print(h, 'dim'));
      c.print(`# ${url}`, 'dim');
    },
  },
  {
    name: 'ps', usage: 'ps aux', desc: 'Top processes (simulated)', group: 'ops',
    run: (_a, c) => {
      c.print(`${pad('USER', 11)}${pad('PID', 7)}${pad('%CPU', 6)}${pad('%MEM', 6)}COMMAND`, 'info');
      ['node server.js', 'postgres: writer', 'nginx: worker', 'suricata -c /etc/suricata', 'redis-server *:6379'].forEach(cmd =>
        c.print(`${pad(cmd.startsWith('postgres') ? 'postgres' : 'pacifique', 11)}${pad(String(1000 + Math.floor(rnd() * 30000)), 7)}${pad((rnd() * 25).toFixed(1), 6)}${pad((rnd() * 9).toFixed(1), 6)}${cmd}`));
    },
  },
  {
    name: 'tcpdump', usage: 'tcpdump -c 5 -i en0', desc: 'Packet capture (simulated)', group: 'ops',
    run: async (_a, c) => {
      c.print('listening on en0, link-type EN10MB (Ethernet), snapshot length 262144 bytes', 'dim');
      for (let i = 0; i < 5; i++) {
        await c.sleep(220);
        const src = pick(LAB_HOSTS, rnd);
        c.print(`${stamp()}.${String(Math.floor(rnd() * 999999)).padStart(6, '0')} IP ${src}.${40000 + Math.floor(rnd() * 20000)} > 10.0.13.37.443: Flags [P.], length ${Math.floor(rnd() * 1400)}`);
      }
      c.print('5 packets captured', 'ok');
      c.print(SIM_NOTE, 'dim');
    },
  },
  {
    name: 'suricata', usage: 'suricata --alerts', desc: 'IDS alerts (simulated)', group: 'ops',
    run: async (_a, c) => {
      const sigs = ['ET SCAN Nmap Scripting Engine User-Agent', 'ET POLICY SSH session on non-standard port', 'ET WEB_SERVER Possible SQL Injection Attempt', 'ET SCAN Potential SSH Scan', 'GPL ICMP_INFO PING *NIX'];
      for (let i = 0; i < 3; i++) {
        await c.sleep(300);
        c.print(`[**] [1:${2000000 + Math.floor(rnd() * 99999)}:3] ${pick(sigs, rnd)} [**] {TCP} ${pick(ATTACKER_IPS, rnd)} -> 10.0.13.37:443`, 'warn');
      }
      c.print('[+] Offending sources added to blocklist', 'ok');
    },
  },
  {
    name: 'journalctl', usage: 'journalctl -p err', desc: 'System errors (simulated)', group: 'ops',
    run: (_a, c) => {
      c.print('-- No entries in the last hour --', 'ok');
      c.print(`${stamp()} kernel: audit: type=1400 apparmor="ALLOWED" profile="node-api"`, 'dim');
    },
  },
  {
    name: 'sha256sum', usage: 'sha256sum <file>', desc: 'Verify a release checksum (real hash of the name)', group: 'ops',
    run: async (a, c) => {
      const file = a[0] ?? 'release.tar.gz';
      c.print(`${await digest('SHA-256', file)}  ${file}`, 'ok');
    },
  },
  {
    name: 'kubectl', usage: 'kubectl get pods', desc: 'Cluster workloads (simulated)', group: 'ops',
    run: (_a, c) => {
      c.print(`${pad('NAME', 34)}${pad('READY', 8)}${pad('STATUS', 10)}AGE`, 'info');
      ['api-7d9f8c6b5-x2kqp', 'web-5c7b9d8f4-m8wzn', 'worker-6f8d7c9b-q4jrt', 'postgres-0'].forEach(p =>
        c.print(`${pad(p, 34)}${pad('1/1', 8)}${pad('Running', 10)}${Math.ceil(rnd() * 20)}d`, 'ok'));
    },
  },
  {
    name: 'openssl-cert', usage: 'openssl-cert <host>', desc: 'TLS certificate check (simulated)', group: 'ops',
    run: (a, c) => {
      const host = a[0] ?? 'portfolio.local';
      c.print(`subject=CN = ${host}`, 'info');
      c.print("issuer=C = US, O = Let's Encrypt, CN = R11");
      c.print(`notAfter=${new Date(Date.now() + (20 + rnd() * 60) * 864e5).toUTCString()}`, 'ok');
      c.print('Verify return code: 0 (ok)', 'ok');
    },
  },
  {
    name: 'live', usage: 'live', desc: 'Start the endless live ops feed (any key stops it)', group: 'ops',
    // Handled by the Terminal component; listed here for help/autocomplete.
    run: () => {},
  },
];

COMMANDS.push(...OPS_COMMANDS);

/* ------------------------------------------------------------------ */
/* Endless live feed generator                                         */
/* ------------------------------------------------------------------ */

type Template = { weight: number; options: string[][]; build: (parts: string[]) => string };

const SUFFIXES = ['', ...Array.from({ length: 24 }, (_, i) => `-${i + 1}`)];
const NMAP_FLAGS = ['-sV', '-sS -T4', '-Pn -p 1-1024', '-A', '-sU --top-ports 50', '-p 22,80,443', '-sC -sV', '-T3 -F'];
const RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'NS', 'CNAME'];
const CURL_PATHS = ['/', '/login', '/api/health', '/admin', '/.well-known/security.txt'];

const LIVE_TEMPLATES: Template[] = [
  { weight: 3, options: [LAB_HOSTS, NMAP_FLAGS], build: ([h, f]) => `nmap ${f} ${h}` },
  { weight: 2, options: [LAB_HOSTS.filter(h => h !== 'portfolio.local'), ['3', '4', '5', '8']], build: ([h, n]) => `ping -c ${n} ${h}` },
  { weight: 2, options: [LAB_DOMAINS, RECORD_TYPES], build: ([d, t]) => `dig ${d} ${t}` },
  { weight: 1, options: [LAB_DOMAINS], build: ([d]) => `whois ${d}` },
  { weight: 1, options: [LAB_HOSTS], build: ([h]) => `traceroute ${h}` },
  { weight: 3, options: [['sha1', 'sha256', 'sha512'], WORDS, SUFFIXES], build: ([alg, w, n]) => `hash ${alg} ${w}${n}` },
  { weight: 2, options: [WORDS, SUFFIXES], build: ([w, n]) => `base64 ${w}${n}` },
  { weight: 1, options: [Array.from({ length: 64 }, (_, i) => String(i + 1))], build: ([n]) => `openssl rand -hex ${n}` },
  { weight: 1, options: [Array.from({ length: 57 }, (_, i) => String(i + 8))], build: ([n]) => `passgen ${n}` },
  { weight: 2, options: [['status', 'log', 'pull'], REPO_SLUGS], build: ([s, r]) => `git ${s} ${r}` },
  { weight: 1, options: [['ps']], build: () => 'docker ps' },
  { weight: 1, options: [['run build', 'audit']], build: ([s]) => `npm ${s}` },
  { weight: 2, options: [['/var/log/auth.log']], build: ([f]) => `tail ${f}` },
  { weight: 1, options: [['status']], build: () => 'ufw status' },
  { weight: 2, options: [['sshd']], build: () => 'fail2ban-client status sshd' },
  { weight: 1, options: [['system']], build: () => 'lynis audit system' },
  { weight: 1, options: [['~/Downloads', '/var/www', '/tmp', '~/projects']], build: ([d]) => `clamscan -r ${d}` },
  { weight: 1, options: [['-tulpn']], build: () => 'ss -tulpn' },
  { weight: 2, options: [SERVICES], build: ([s]) => `systemctl status ${s}` },
  { weight: 1, options: [LAB_DOMAINS, CURL_PATHS], build: ([d, p]) => `curl -I https://${d}${p}` },
  { weight: 1, options: [['aux']], build: () => 'ps aux' },
  { weight: 1, options: [['en0', 'utun3']], build: ([i]) => `tcpdump -c 5 -i ${i}` },
  { weight: 2, options: [['--alerts']], build: () => 'suricata --alerts' },
  { weight: 1, options: [['err']], build: () => 'journalctl -p err' },
  { weight: 1, options: [REPO_SLUGS], build: ([r]) => `sha256sum ${r.toLowerCase()}-release.tar.gz` },
  { weight: 1, options: [['pods']], build: () => 'kubectl get pods' },
  { weight: 1, options: [LAB_DOMAINS], build: ([d]) => `openssl-cert ${d}` },
  { weight: 1, options: [['']], build: () => 'netstat' },
  { weight: 1, options: [['']], build: () => 'ifconfig' },
];

/** Number of distinct commands the live feed can generate. */
export const LIVE_COMMAND_COUNT = LIVE_TEMPLATES.reduce((sum, t) => sum + t.options.reduce((n, o) => n * o.length, 1), 0);

const TOTAL_WEIGHT = LIVE_TEMPLATES.reduce((s, t) => s + t.weight, 0);

export function randomLiveCommand() {
  let roll = Math.random() * TOTAL_WEIGHT;
  const t = LIVE_TEMPLATES.find(tpl => (roll -= tpl.weight) < 0) ?? LIVE_TEMPLATES[0];
  return t.build(t.options.map(o => pick(o, rnd)));
}

export const COMMAND_NAMES = COMMANDS.map(c => c.name);
export const FILE_NAMES = [...Object.keys(FILES), 'projects/', '.secrets', '.zshrc'];
export const OPEN_TARGETS = Object.keys(OPENABLE);

export function findCommand(name: string) {
  return COMMANDS.find(c => c.name === name);
}

export function suggest(name: string) {
  let best: string | null = null;
  let bestScore = 3;
  for (const n of COMMAND_NAMES) {
    const d = levenshtein(name, n);
    if (d < bestScore) { bestScore = d; best = n; }
  }
  return best;
}

/** Split a command line, respecting simple "double quotes". */
export function tokenize(line: string) {
  return (line.match(/"[^"]*"|\S+/g) ?? []).map(t => t.replace(/^"|"$/g, ''));
}
