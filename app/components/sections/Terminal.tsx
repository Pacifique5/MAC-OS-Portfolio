'use client';
import { useEffect, useRef, useState } from 'react';
import { IoTrashOutline, IoPlay, IoPause } from 'react-icons/io5';
import { WindowLayout, useWindowSize } from '../MacWindow';
import { ToolbarButton } from '../ui/mac';
import {
  CANCELLED, COMMAND_NAMES, FILE_NAMES, OPEN_TARGETS, THEMES, LineKind, TerminalContext, ThemeName,
  LIVE_COMMAND_COUNT, bannerLines, findCommand, randomLiveCommand, suggest, tokenize,
} from '../terminal/commands';

interface Line {
  id: number;
  kind: LineKind;
  text: string;
  /** Working directory shown in the prompt for echoed commands */
  cwd?: string;
}

const KIND_COLORS: Record<Exclude<LineKind, 'out' | 'banner'>, string> = {
  in: '#e8ecef',
  ok: '#4ade80',
  warn: '#facc15',
  err: '#f87171',
  info: '#67e8f9',
  dim: 'rgba(205,214,224,0.45)',
  accent: '#f0abfc',
};

const BOOT_STEPS = [
  'Loading kernel modules',
  'Mounting encrypted volumes',
  'Starting WireGuard tunnel',
  'Initialising IDS sensors',
  'Verifying package signatures',
  'Hardening SSH configuration',
];

const AUTOPLAY = ['whoami', 'nmap portfolio.local', 'hash sha256 hire-pacifique'];

/* ------------------------------------------------------------------ */
/* Matrix rain (binary + hex, no CJK glyphs)                           */
/* ------------------------------------------------------------------ */

function MatrixRain({ color, onExit }: { color: string; onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const exitRef = useRef(onExit);
  useEffect(() => { exitRef.current = onExit; });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const parent = canvas.parentElement!;
    const resize = () => { canvas.width = parent.clientWidth; canvas.height = parent.clientHeight; };
    resize();
    const glyphs = '01ABCDEF0123456789$#@%&*<>/\\{}[]';
    const size = 15;
    let drops = Array.from({ length: Math.ceil(canvas.width / size) }, () => Math.random() * -40);
    let frame = 0;
    let raf = 0;
    const draw = () => {
      frame++;
      if (frame % 2 === 0) {
        ctx.fillStyle = 'rgba(5, 8, 10, 0.12)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = `${size}px ui-monospace, Menlo, Consolas, monospace`;
        if (drops.length !== Math.ceil(canvas.width / size)) drops = Array.from({ length: Math.ceil(canvas.width / size) }, () => 0);
        drops.forEach((y, i) => {
          const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
          ctx.fillStyle = Math.random() > 0.975 ? '#ffffff' : color;
          ctx.fillText(ch, i * size, y * size);
          drops[i] = y * size > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
        });
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const stop = setTimeout(() => exitRef.current(), 15000);
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); clearTimeout(stop); window.removeEventListener('resize', resize); };
  }, [color]);

  return (
    <div className="absolute inset-0 z-20 bg-[#05080a] cursor-pointer" onClick={onExit}>
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] text-white/50">press any key to exit</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Terminal                                                            */
/* ------------------------------------------------------------------ */

export default function Terminal({ onOpen, onClose }: { onOpen: (id: string) => void; onClose: () => void }) {
  const { compact } = useWindowSize();
  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(true);
  const [autoplaying, setAutoplaying] = useState(false);
  const [theme, setTheme] = useState<ThemeName>('green');
  const [cwd, setCwd] = useState('~');
  const [matrix, setMatrix] = useState(false);

  const idRef = useRef(0);
  const tokenRef = useRef(0);
  const cwdRef = useRef('~');
  const historyRef = useRef<string[]>([]);
  const histIndexRef = useRef<number | null>(null);
  const startedAt = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastActivityRef = useRef(0);
  const liveStateRef = useRef({ busy: true, autoplaying: false, input: '' });
  const inputRef = useRef<HTMLInputElement>(null);

  const color = THEMES[theme];

  /* ---------------- output primitives ---------------- */
  const push = (text: string, kind: LineKind = 'out', extra?: Partial<Line>) => {
    const id = ++idRef.current;
    setLines(prev => [...prev.slice(-1200), { id, kind, text, ...extra }]);
    return id;
  };

  const makeCtx = (token: number): TerminalContext => ({
    print: (text, kind = 'out') => push(text, kind),
    update: (id, text, kind) => setLines(prev => prev.map(l => (l.id === id ? { ...l, text, kind: kind ?? l.kind } : l))),
    sleep: (ms) => new Promise<void>((resolve, reject) => {
      setTimeout(() => (tokenRef.current === token ? resolve() : reject(CANCELLED)), ms);
    }),
    clear: () => setLines([]),
    open: onOpen,
    close: onClose,
    setTheme,
    startMatrix: () => setMatrix(true),
    cwd: cwdRef.current,
    setCwd: (c) => { cwdRef.current = c; setCwd(c); },
    history: historyRef.current,
    startedAt: startedAt.current,
  });

  /* ---------------- run a command line ---------------- */
  const execute = async (raw: string, token = ++tokenRef.current, record = true) => {
    push(raw, 'in', { cwd: cwdRef.current });
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (record) {
      historyRef.current.push(trimmed);
      histIndexRef.current = null;
    }
    if (trimmed === 'live') {
      startLive();
      return;
    }

    const [name, ...args] = tokenize(trimmed);
    const cmd = findCommand(name.toLowerCase());
    if (!cmd) {
      push(`zsh: command not found: ${name}`, 'err');
      const s = suggest(name.toLowerCase());
      if (s) push(`Did you mean '${s}'?`, 'dim');
      return;
    }
    setBusy(true);
    try {
      await cmd.run(args, makeCtx(token));
    } catch (e) {
      if (e !== CANCELLED) push(`${name}: ${e instanceof Error ? e.message : String(e)}`, 'err');
    } finally {
      if (tokenRef.current === token) setBusy(false);
    }
  };

  /** Type a command character by character, then run it. */
  const typeAndRun = async (cmd: string, token: number, ctx: TerminalContext, speed: number) => {
    for (let i = 1; i <= cmd.length; i++) {
      setInput(cmd.slice(0, i));
      await ctx.sleep(speed + Math.random() * speed);
    }
    await ctx.sleep(180);
    setInput('');
    await execute(cmd, token, false);
  };

  /** Endless live feed: keeps generating and running commands until a key is pressed. */
  const runLive = async (token: number) => {
    const ctx = makeCtx(token);
    setAutoplaying(true);
    for (;;) {
      await typeAndRun(randomLiveCommand(), token, ctx, 14);
      await ctx.sleep(500 + Math.random() * 900);
    }
  };

  const startLive = () => {
    const token = ++tokenRef.current;
    setBusy(false);
    push(`[live] Streaming ${LIVE_COMMAND_COUNT.toLocaleString()}+ unique operations — press any key to take control.`, 'accent');
    runLive(token).catch(() => { /* stopped by a key press */ });
  };

  /** Invalidate every pending sleep/animation (unmount, Ctrl+C). */
  const cancelPending = () => { tokenRef.current++; };

  const interrupt = () => {
    tokenRef.current++;
    if (busy || autoplaying) push('^C', 'dim');
    setBusy(false);
    setAutoplaying(false);
    setInput('');
  };

  /* ---------------- boot sequence + autoplay demo ---------------- */
  useEffect(() => {
    const token = ++tokenRef.current;
    startedAt.current = performance.now();
    const ctx = makeCtx(token);

    const boot = async () => {
      await ctx.sleep(150);
      setLines([]);
      bannerLines().forEach(l => push(l, 'banner'));
      push('  secure shell · portfolio.local · v26.1', 'dim');
      push('');
      for (const step of BOOT_STEPS) {
        await ctx.sleep(110);
        push(`[  OK  ] ${step}`, 'ok');
      }
      await ctx.sleep(150);
      push('');
      push(`Last login: ${new Date().toDateString()} on ttys001`, 'dim');
      push("Type 'help' to list commands. Press any key to take control.", 'info');
      push('');
      setBusy(false);

      // Autoplay a few commands, typed character by character
      setAutoplaying(true);
      for (const cmd of AUTOPLAY) {
        await ctx.sleep(700);
        for (let i = 1; i <= cmd.length; i++) {
          setInput(cmd.slice(0, i));
          await ctx.sleep(45 + Math.random() * 50);
        }
        await ctx.sleep(250);
        setInput('');
        await execute(cmd, token);
      }
      await ctx.sleep(600);
      push(`[live] Streaming ${LIVE_COMMAND_COUNT.toLocaleString()}+ unique operations — press any key to take control.`, 'accent');
      await runLive(token);
    };

    boot().catch(() => { /* cancelled by user input or unmount */ });
    return cancelPending;
    // Boot exactly once per window open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- resume the live feed after 40s idle ---------------- */
  useEffect(() => {
    liveStateRef.current = { busy, autoplaying, input };
  }, [busy, autoplaying, input]);

  useEffect(() => {
    lastActivityRef.current = Date.now();
    const timer = setInterval(() => {
      const st = liveStateRef.current;
      if (!st.busy && !st.autoplaying && st.input === '' && Date.now() - lastActivityRef.current > 40000) startLive();
    }, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- keep scrolled to the bottom ---------------- */
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, input, busy]);

  /* ---------------- keyboard ---------------- */
  const complete = () => {
    const tokens = input.split(' ');
    if (tokens.length === 1) {
      const hits = COMMAND_NAMES.filter(n => n.startsWith(tokens[0]));
      if (hits.length === 1) setInput(`${hits[0]} `);
      else if (hits.length > 1) { push(input, 'in', { cwd: cwdRef.current }); push(hits.join('   '), 'info'); }
      return;
    }
    const pool = tokens[0] === 'open' ? OPEN_TARGETS : tokens[0] === 'theme' ? Object.keys(THEMES) : FILE_NAMES;
    const last = tokens[tokens.length - 1];
    const hits = pool.filter(n => n.startsWith(last));
    if (hits.length === 1) setInput([...tokens.slice(0, -1), hits[0]].join(' '));
    else if (hits.length > 1) { push(input, 'in', { cwd: cwdRef.current }); push(hits.join('   '), 'info'); }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    lastActivityRef.current = Date.now();
    if (matrix) { e.preventDefault(); setMatrix(false); return; }
    if (e.ctrlKey && e.key.toLowerCase() === 'c') { e.preventDefault(); interrupt(); return; }
    if (e.ctrlKey && e.key.toLowerCase() === 'l') { e.preventDefault(); setLines([]); return; }
    if (autoplaying) { e.preventDefault(); interrupt(); return; }
    if (busy) { e.preventDefault(); return; }

    if (e.key === 'Enter') {
      e.preventDefault();
      const line = input;
      setInput('');
      execute(line);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const h = historyRef.current;
      if (!h.length) return;
      let i = histIndexRef.current ?? h.length;
      i = e.key === 'ArrowUp' ? Math.max(0, i - 1) : Math.min(h.length, i + 1);
      histIndexRef.current = i;
      setInput(h[i] ?? '');
    }
  };

  /* ---------------- render ---------------- */
  const glow = (c: string, strength = 0.35) => ({ color: c, textShadow: `0 0 6px ${c}${Math.round(strength * 255).toString(16).padStart(2, '0')}` });

  const renderPrompt = (key: string | number, dir: string, text: string, cursor = false) => (
    <div key={key} className="mt-1">
      <div>
        <span style={glow(color, 0.25)}>┌──(</span>
        <span className="font-bold" style={glow('#5eb3ff')}>pacifique@portfolio</span>
        <span style={glow(color, 0.25)}>)-[</span>
        <span className="font-bold" style={glow('#f5f7fa', 0.15)}>{dir}</span>
        <span style={glow(color, 0.25)}>]</span>
      </div>
      <div className="whitespace-pre-wrap break-all">
        <span style={glow(color, 0.25)}>└─</span>
        <span className="font-bold" style={glow('#5eb3ff')}>$ </span>
        <span style={glow(KIND_COLORS.in, 0.15)}>{text}</span>
        {cursor && <span className="inline-block w-[0.6em] h-[1.1em] -mb-[0.2em] ml-px animate-pulse" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />}
      </div>
    </div>
  );

  const toolbar = (
    <>
      <button type="button" onClick={() => (autoplaying ? interrupt() : startLive())}
        title={autoplaying ? 'Stop the live feed' : 'Start the live feed'}
        className={`h-6 px-2 mr-1 rounded-full flex items-center gap-1.5 text-[11px] font-semibold transition-colors ${autoplaying ? 'bg-macblue text-white' : 'bg-black/6 dark:bg-white/10 text-black/60 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/15'}`}>
        {autoplaying ? <><span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE <IoPause className="text-[11px]" /></> : <><IoPlay className="text-[11px]" /> Go Live</>}
      </button>
      {!compact && (Object.keys(THEMES) as ThemeName[]).map(t => (
        <button key={t} type="button" title={`${t} theme`} onClick={() => setTheme(t)}
          className={`w-3.5 h-3.5 rounded-full mx-0.5 transition-transform ${theme === t ? 'scale-125 ring-2 ring-offset-1 ring-black/20 dark:ring-white/40 ring-offset-transparent' : 'hover:scale-110'}`}
          style={{ background: THEMES[t], boxShadow: `0 0 6px ${THEMES[t]}` }} />
      ))}
      <div className="w-2" />
      <ToolbarButton title="Clear" onClick={() => setLines([])}><IoTrashOutline className="text-[15px]" /></ToolbarButton>
    </>
  );

  return (
    <WindowLayout title={`pacifique@portfolio: ${cwd}`} subtitle="zsh — secure shell" toolbar={toolbar}>
      <div
        className="relative h-full bg-[#06090c] overflow-hidden cursor-text"
        style={{ backgroundImage: `radial-gradient(120% 90% at 50% 0%, ${color}14, transparent 60%)` }}
        onClick={() => inputRef.current?.focus()}
      >
        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto mac-scroll px-3 @md:px-4 py-3 font-mono text-[12px] @md:text-[12.5px] leading-[1.45]">
          {lines.map(l =>
            l.kind === 'in' ? (
              renderPrompt(l.id, l.cwd ?? '~', l.text)
            ) : l.kind === 'banner' ? (
              <pre key={l.id} className="m-0 text-[7.5px] @xl:text-[11px] leading-[1.05] font-bold" style={glow(color, 0.6)}>{l.text}</pre>
            ) : (
              <div key={l.id} className="whitespace-pre-wrap wrap-break-word min-h-[1.45em]" style={glow(l.kind === 'out' ? color : KIND_COLORS[l.kind], l.kind === 'dim' ? 0 : 0.3)}>
                {l.text}
              </div>
            ),
          )}
          {!busy && renderPrompt('live', cwd, input, true)}
        </div>

        {/* CRT scanlines + vignette */}
        <div className="pointer-events-none absolute inset-0 z-10" style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 3px), radial-gradient(130% 100% at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)',
        }} />

        {matrix && <MatrixRain color={color} onExit={() => { setMatrix(false); inputRef.current?.focus(); }} />}

        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={(e) => !busy && !autoplaying && setInput(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Terminal input"
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          className="absolute opacity-0 w-px h-px -left-2499.75"
        />
      </div>
    </WindowLayout>
  );
}
