'use client';
// macOS Big Sur–style application icons drawn as SVG.
// Every icon shares the continuous-corner "squircle" silhouette.

import { ReactNode, useId } from 'react';
import type { IconType } from 'react-icons';

export const SQUIRCLE =
  'M50,0 C96,0 100,4 100,50 C100,96 96,100 50,100 C4,100 0,96 0,50 C0,4 4,0 50,0 Z';

function useUid() {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, '');
  return (name: string) => `${name}-${raw}`;
}

type IconProps = { size?: number; className?: string };

function Frame({ size = 56, className, children, defs }: IconProps & { children: ReactNode; defs?: ReactNode }) {
  const uid = useUid();
  const clip = uid('clip');
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <defs>
        <clipPath id={clip}><path d={SQUIRCLE} /></clipPath>
        {defs}
      </defs>
      <g clipPath={`url(#${clip})`}>{children}</g>
      <path d={SQUIRCLE} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth={0.8} />
    </svg>
  );
}

function LinearGrad({ id, from, to, x2 = 0, y2 = 1 }: { id: string; from: string; to: string; x2?: number; y2?: number }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2={x2} y2={y2}>
      <stop offset="0" stopColor={from} />
      <stop offset="1" stopColor={to} />
    </linearGradient>
  );
}

/* ------------------------------------------------------------------ */
/* System apps                                                         */
/* ------------------------------------------------------------------ */

export function FinderIcon(p: IconProps) {
  const u = useUid();
  return (
    <Frame {...p} defs={<>
      <LinearGrad id={u('l')} from="#6fd2ff" to="#1877ee" />
      <LinearGrad id={u('r')} from="#ffffff" to="#d3dfeb" />
    </>}>
      <rect width="100" height="100" fill={`url(#${u('r')})`} />
      <path d="M0 0 H57 C53 18 49 34 45 49 C43 55 40 59 41 62 C46 63.5 51 63.5 54.5 64.5 C53.5 76 53.5 88 55.5 100 H0 Z" fill={`url(#${u('l')})`} />
      <rect x="27" y="27" width="5.6" height="16" rx="2.8" fill="#0f2238" />
      <rect x="68" y="27" width="5.6" height="16" rx="2.8" fill="#0f2238" />
      <path d="M21 70 Q50 86 79 70" stroke="#0f2238" strokeWidth={4.4} strokeLinecap="round" fill="none" />
    </Frame>
  );
}

export function LaunchpadIcon(p: IconProps) {
  const u = useUid();
  const colors = ['#ff453a', '#ff9f0a', '#ffd60a', '#30d158', '#64d2ff', '#0a84ff', '#5e5ce6', '#bf5af2', '#ff375f'];
  return (
    <Frame {...p} defs={<LinearGrad id={u('bg')} from="#f5f5f7" to="#b8b8c0" />}>
      <rect width="100" height="100" fill={`url(#${u('bg')})`} />
      {colors.map((c, i) => (
        <rect key={c} x={17 + (i % 3) * 23} y={17 + Math.floor(i / 3) * 23} width="20" height="20" rx="5.5" fill={c} />
      ))}
    </Frame>
  );
}

export function SafariIcon(p: IconProps) {
  const u = useUid();
  // Rounded so server- and browser-computed trig values serialize identically (no hydration mismatch).
  const r = (n: number) => Math.round(n * 1000) / 1000;
  const ticks = Array.from({ length: 48 }, (_, i) => {
    const a = (i * Math.PI * 2) / 48;
    const long = i % 4 === 0;
    const r1 = long ? 28.5 : 31;
    return { x1: r(50 + Math.cos(a) * r1), y1: r(50 + Math.sin(a) * r1), x2: r(50 + Math.cos(a) * 34), y2: r(50 + Math.sin(a) * 34), long };
  });
  return (
    <Frame {...p} defs={<>
      <LinearGrad id={u('bg')} from="#ffffff" to="#dcdce2" />
      <radialGradient id={u('dial')} cx="0.5" cy="0.25" r="0.8">
        <stop offset="0" stopColor="#2fd9ff" />
        <stop offset="1" stopColor="#1453f0" />
      </radialGradient>
    </>}>
      <rect width="100" height="100" fill={`url(#${u('bg')})`} />
      <circle cx="50" cy="50" r="40" fill="#c7c7cc" />
      <circle cx="50" cy="50" r="38" fill={`url(#${u('dial')})`} />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="white" strokeOpacity={t.long ? 0.95 : 0.6} strokeWidth={t.long ? 1.4 : 0.8} />
      ))}
      <g transform="rotate(45 50 50)">
        <path d="M50 15 L56.5 50 H43.5 Z" fill="#ff3b30" />
        <path d="M50 85 L56.5 50 H43.5 Z" fill="#f2f2f7" />
      </g>
      <circle cx="50" cy="50" r="2.2" fill="#1c1c1e" opacity={0.25} />
    </Frame>
  );
}

export function TerminalIcon(p: IconProps) {
  const u = useUid();
  return (
    <Frame {...p} defs={<LinearGrad id={u('bg')} from="#ececf0" to="#9d9da5" />}>
      <rect width="100" height="100" fill={`url(#${u('bg')})`} />
      <rect x="10" y="14" width="80" height="68" rx="7" fill="#1c1c1e" />
      <rect x="10" y="14" width="80" height="68" rx="7" fill="none" stroke="rgba(0,0,0,0.4)" />
      <polyline points="21,31 32,40 21,49" fill="none" stroke="#f2f2f7" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <line x1="37" y1="51" x2="53" y2="51" stroke="#f2f2f7" strokeWidth={5} strokeLinecap="round" />
    </Frame>
  );
}

export function PhotosIcon(p: IconProps) {
  const colors = ['#ffcc00', '#ff9500', '#ff3b30', '#ff2d92', '#af52de', '#5856d6', '#34aadc', '#4cd964'];
  return (
    <Frame {...p}>
      <rect width="100" height="100" fill="#ffffff" />
      {colors.map((c, i) => (
        <ellipse key={c} cx="50" cy="31" rx="10.5" ry="17.5" fill={c} opacity={0.82} transform={`rotate(${i * 45} 50 50)`} style={{ mixBlendMode: 'multiply' }} />
      ))}
    </Frame>
  );
}

export function CalendarIcon(p: IconProps) {
  const now = new Date();
  const weekday = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  return (
    <Frame {...p}>
      <rect width="100" height="100" fill="#ffffff" />
      <text x="50" y="28" textAnchor="middle" fontSize="15" fontWeight="600" fill="#ff3b30" fontFamily="-apple-system, BlinkMacSystemFont, Inter, sans-serif" suppressHydrationWarning>
        {weekday}
      </text>
      <text x="50" y="79" textAnchor="middle" fontSize="52" fontWeight="300" fill="#1d1d1f" fontFamily="-apple-system, BlinkMacSystemFont, Inter, sans-serif" suppressHydrationWarning>
        {now.getDate()}
      </text>
    </Frame>
  );
}

function gearPath(cx: number, cy: number, teeth: number, outer: number, inner: number) {
  const s = (Math.PI * 2) / teeth;
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const t = i * s;
    const pt = (r: number, a: number) => `${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`;
    pts.push(pt(inner, t), pt(outer, t + s * 0.18), pt(outer, t + s * 0.47), pt(inner, t + s * 0.65));
  }
  return `M${pts.join(' L')} Z`;
}

export function SettingsIcon(p: IconProps) {
  const u = useUid();
  return (
    <Frame {...p} defs={<>
      <LinearGrad id={u('bg')} from="#c4c4ca" to="#6c6c74" />
      <LinearGrad id={u('gear')} from="#8e8e93" to="#2c2c2e" />
      <LinearGrad id={u('hub')} from="#e5e5ea" to="#a1a1a8" />
    </>}>
      <rect width="100" height="100" fill={`url(#${u('bg')})`} />
      <path d={gearPath(50, 50, 14, 38, 31)} fill={`url(#${u('gear')})`} />
      <circle cx="50" cy="50" r="22" fill={`url(#${u('hub')})`} />
      <circle cx="50" cy="50" r="22" fill="none" stroke="rgba(0,0,0,0.25)" />
      <path d={gearPath(50, 50, 8, 15, 11)} fill="#636366" />
      <circle cx="50" cy="50" r="5" fill="#c7c7cc" />
    </Frame>
  );
}

/** The Trash is the one Dock item without a squircle — a wire-mesh bin. */
export function TrashIcon({ size = 56, className, full = false }: IconProps & { full?: boolean }) {
  const u = useUid();
  const ribs = [0, 1, 2, 3, 4, 5, 6].map(i => ({ top: 29 + i * 7, bottom: 36 + i * 4.7 }));
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <defs>
        <LinearGrad id={u('body')} from="#fafafc" to="#c4c4cc" x2={1} y2={0} />
      </defs>
      <path d="M23 25 L29.5 91 Q30.5 96 35.5 96 H64.5 Q69.5 96 70.5 91 L77 25 Z" fill={`url(#${u('body')})`} fillOpacity={0.92} stroke="#8e8e96" strokeWidth={1} />
      {ribs.map((r, i) => (
        <line key={i} x1={r.top} y1="29" x2={r.bottom} y2="92" stroke="#9b9ba3" strokeWidth={1.6} strokeOpacity={0.55} />
      ))}
      {[40, 55, 70, 84].map(y => (
        <line key={y} x1={24 + (y - 25) * 0.1} y1={y} x2={76 - (y - 25) * 0.1} y2={y} stroke="#9b9ba3" strokeWidth={0.8} strokeOpacity={0.35} />
      ))}
      {full && <path d="M30 26 Q38 12 50 18 Q60 8 70 24 Z" fill="#f2f2f7" stroke="#b0b0b8" />}
      <ellipse cx="50" cy="25" rx="28" ry="5.2" fill="#ececf0" stroke="#86868e" strokeWidth={1.2} />
      <ellipse cx="50" cy="25" rx="24.5" ry="3.4" fill="#8e8e96" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Portfolio "apps"                                                    */
/* ------------------------------------------------------------------ */

/** About Me — Contacts-style address book. */
export function ContactsIcon(p: IconProps) {
  const u = useUid();
  return (
    <Frame {...p} defs={<>
      <LinearGrad id={u('bg')} from="#fbf7ef" to="#e6d8bf" />
      <LinearGrad id={u('spine')} from="#a87e55" to="#755434" x2={1} y2={0} />
    </>}>
      <rect width="100" height="100" fill={`url(#${u('bg')})`} />
      <rect x="0" y="0" width="22" height="100" fill={`url(#${u('spine')})`} />
      <rect x="22" y="0" width="1.5" height="100" fill="rgba(0,0,0,0.12)" />
      <circle cx="60" cy="40" r="13" fill="#a8937a" />
      <path d="M36 80 Q36 57 60 57 Q84 57 84 80 Z" fill="#a8937a" />
    </Frame>
  );
}

/** Projects — blueprint & hammer, Xcode-style developer tool. */
export function ProjectsIcon(p: IconProps) {
  const u = useUid();
  return (
    <Frame {...p} defs={<>
      <LinearGrad id={u('bg')} from="#3a95ff" to="#0d3fb8" />
      <LinearGrad id={u('handle')} from="#4a4a4e" to="#141416" x2={1} y2={0} />
      <LinearGrad id={u('head')} from="#ffffff" to="#a5a5ad" />
    </>}>
      <rect width="100" height="100" fill={`url(#${u('bg')})`} />
      {[12.5, 25, 37.5, 50, 62.5, 75, 87.5].map(v => (
        <g key={v} stroke="white" strokeOpacity={0.12} strokeWidth={0.8}>
          <line x1={v} y1="0" x2={v} y2="100" />
          <line x1="0" y1={v} x2="100" y2={v} />
        </g>
      ))}
      <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeOpacity={0.35} strokeWidth={1.2} strokeDasharray="3 3" />
      <g transform="rotate(-38 50 50)">
        <rect x="45.5" y="32" width="9" height="58" rx="3.5" fill={`url(#${u('handle')})`} />
        <path d="M27 20 Q27 16 31 16 H66 Q74 16 78 22 L80 26 Q74 24 68 25 V31 Q68 35 64 35 H31 Q27 35 27 31 Z" fill={`url(#${u('head')})`} stroke="rgba(0,0,0,0.25)" strokeWidth={0.8} />
      </g>
    </Frame>
  );
}

/** Skills — Activity Monitor–style live graph. */
export function SkillsIcon(p: IconProps) {
  const u = useUid();
  const pts = '16,70 25,63 33,67 41,47 50,55 58,35 66,45 74,28 84,38';
  return (
    <Frame {...p} defs={<>
      <LinearGrad id={u('bg')} from="#dadade" to="#85858d" />
      <LinearGrad id={u('area')} from="rgba(50,215,75,0.45)" to="rgba(50,215,75,0)" />
    </>}>
      <rect width="100" height="100" fill={`url(#${u('bg')})`} />
      <rect x="11" y="13" width="78" height="74" rx="8" fill="#0b0b0d" />
      {[31, 49, 67].map(y => <line key={y} x1="14" y1={y} x2="86" y2={y} stroke="#1f5f2a" strokeOpacity={0.6} strokeWidth={0.7} />)}
      {[30, 50, 70].map(x => <line key={x} x1={x} y1="16" x2={x} y2="84" stroke="#1f5f2a" strokeOpacity={0.6} strokeWidth={0.7} />)}
      <polygon points={`16,84 ${pts} 84,84`} fill={`url(#${u('area')})`} />
      <polyline points={pts} fill="none" stroke="#32d74b" strokeOpacity={0.35} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={pts} fill="none" stroke="#5cf27a" strokeWidth={2.6} strokeLinejoin="round" strokeLinecap="round" />
    </Frame>
  );
}

/** Experience — Books-style open book. */
export function ExperienceIcon(p: IconProps) {
  const u = useUid();
  return (
    <Frame {...p} defs={<LinearGrad id={u('bg')} from="#ffb84a" to="#ff6d00" />}>
      <rect width="100" height="100" fill={`url(#${u('bg')})`} />
      <path d="M50 31 C42 25 30 24 19 26.5 V73 C30 71 42 72 50 78 Z" fill="#ffffff" />
      <path d="M50 31 C58 25 70 24 81 26.5 V73 C70 71 58 72 50 78 Z" fill="#ffffff" fillOpacity={0.9} />
    </Frame>
  );
}

/** Testimonials — Messages-style speech bubble. */
export function MessagesIcon(p: IconProps) {
  const u = useUid();
  return (
    <Frame {...p} defs={<LinearGrad id={u('bg')} from="#6cf983" to="#0bbd2e" />}>
      <rect width="100" height="100" fill={`url(#${u('bg')})`} />
      <ellipse cx="50" cy="47" rx="32" ry="25.5" fill="#ffffff" />
      <path d="M29 61 Q28 72 19 77 Q33 77.5 41 68 Z" fill="#ffffff" />
    </Frame>
  );
}

/** Contact — Mail-style envelope. */
export function MailIcon(p: IconProps) {
  const u = useUid();
  return (
    <Frame {...p} defs={<LinearGrad id={u('bg')} from="#52c6ff" to="#1463f0" />}>
      <rect width="100" height="100" fill={`url(#${u('bg')})`} />
      <rect x="17" y="29" width="66" height="44" rx="5" fill="#ffffff" />
      <path d="M20 70 L42 51 M80 70 L58 51" stroke="#a9cbfb" strokeWidth={2} strokeLinecap="round" />
      <path d="M19.5 32 L50 55 L80.5 32" fill="none" stroke="#4d90f5" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
    </Frame>
  );
}

/** Slack — the four-colour hash mark on a dark tile. */
export function SlackIcon(p: IconProps) {
  const u = useUid();
  return (
    <Frame {...p} defs={<LinearGrad id={u('bg')} from="#2b2b2e" to="#141416" />}>
      <rect width="100" height="100" fill={`url(#${u('bg')})`} />
      <g transform="translate(23 23) scale(1)">
        <path d="M19.712.133a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386h5.376V5.52A5.381 5.381 0 0 0 19.712.133m0 14.365H5.376A5.381 5.381 0 0 0 0 19.884a5.381 5.381 0 0 0 5.376 5.387h14.336a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386" fill="#36C5F0" />
        <path d="M53.76 19.884a5.381 5.381 0 0 0-5.376-5.386 5.381 5.381 0 0 0-5.376 5.386v5.387h5.376a5.381 5.381 0 0 0 5.376-5.387m-14.336 0V5.52A5.381 5.381 0 0 0 34.048.133a5.381 5.381 0 0 0-5.376 5.387v14.364a5.381 5.381 0 0 0 5.376 5.387 5.381 5.381 0 0 0 5.376-5.387" fill="#2EB67D" />
        <path d="M34.048 54a5.381 5.381 0 0 0 5.376-5.387 5.381 5.381 0 0 0-5.376-5.386h-5.376v5.386A5.381 5.381 0 0 0 34.048 54m0-14.365h14.336a5.381 5.381 0 0 0 5.376-5.386 5.381 5.381 0 0 0-5.376-5.387H34.048a5.381 5.381 0 0 0-5.376 5.387 5.381 5.381 0 0 0 5.376 5.386" fill="#ECB22E" />
        <path d="M0 34.249a5.381 5.381 0 0 0 5.376 5.386 5.381 5.381 0 0 0 5.376-5.386v-5.387H5.376A5.381 5.381 0 0 0 0 34.25m14.336-.001v14.364A5.381 5.381 0 0 0 19.712 54a5.381 5.381 0 0 0 5.376-5.387V34.25a5.381 5.381 0 0 0-5.376-5.387 5.381 5.381 0 0 0-5.376 5.387" fill="#E01E5A" />
      </g>
    </Frame>
  );
}

/** A squircle tile carrying a brand mark (GitHub, LinkedIn…). */
export function BrandTile({ size = 56, className, bg, fg = '#fff', Glyph, glyphScale = 0.56 }: IconProps & { bg: [string, string]; fg?: string; Glyph: IconType; glyphScale?: number }) {
  const u = useUid();
  return (
    <div className={className} style={{ position: 'relative', width: size, height: size }}>
      <Frame size={size} defs={<LinearGrad id={u('bg')} from={bg[0]} to={bg[1]} />}>
        <rect width="100" height="100" fill={`url(#${u('bg')})`} />
      </Frame>
      <Glyph style={{ position: 'absolute', inset: 0, margin: 'auto', color: fg, width: size * glyphScale, height: size * glyphScale }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Finder folder                                                       */
/* ------------------------------------------------------------------ */

/** Big Sur blue folder with an optional embossed SF-style symbol. */
export function FolderIcon({ size = 64, className, Glyph }: IconProps & { Glyph?: IconType }) {
  const u = useUid();
  return (
    <div className={className} style={{ position: 'relative', width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
        <defs>
          <LinearGrad id={u('back')} from="#44aaf0" to="#1c86dc" />
          <LinearGrad id={u('front')} from="#93d6fe" to="#52b5f6" />
        </defs>
        <path d="M8 22 Q8 15 15 15 H37 Q41.5 15 44 18.5 L47 22.5 H85 Q92 22.5 92 29.5 V80 Q92 86 86 86 H14 Q8 86 8 80 Z" fill={`url(#${u('back')})`} />
        <path d="M8 34.5 Q8 28.5 14 28.5 H86 Q92 28.5 92 34.5 V80.5 Q92 87 85.5 87 H14.5 Q8 87 8 80.5 Z" fill={`url(#${u('front')})`} />
        <path d="M14 29.3 H86" stroke="white" strokeOpacity={0.7} strokeWidth={1} />
        <path d="M8 34.5 Q8 28.5 14 28.5 H86 Q92 28.5 92 34.5 V80.5 Q92 87 85.5 87 H14.5 Q8 87 8 80.5 Z" fill="none" stroke="rgba(0,60,140,0.18)" strokeWidth={0.8} />
      </svg>
      {Glyph && (
        <Glyph
          style={{
            position: 'absolute',
            left: '50%',
            top: '58%',
            transform: 'translate(-50%, -50%)',
            width: size * 0.3,
            height: size * 0.3,
            color: '#2f8fdc',
            filter: 'drop-shadow(0 0.5px 0 rgba(255,255,255,0.55)) drop-shadow(0 -0.5px 0 rgba(0,50,120,0.25))',
          }}
        />
      )}
    </div>
  );
}

/** Monogram avatar like Contacts / Messages when no photo is set. */
export function Monogram({ initials, size = 40, tint }: { initials: string; size?: number; tint?: [string, string] }) {
  const [a, b] = tint ?? ['#a6a6ae', '#6e6e76'];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `linear-gradient(180deg, ${a}, ${b})`,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: size * 0.4,
        letterSpacing: '0.02em',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
