// SF Symbols–style glyphs used by the menu bar, Control Center and menus.
// All glyphs inherit `currentColor` so they adapt to light/dark surfaces.

type GlyphProps = { className?: string; size?: number };

export function WifiGlyph({ strength = 3, className, size = 16 }: GlyphProps & { strength?: number }) {
  const arc = (on: boolean) => ({ opacity: on ? 1 : 0.28 });
  return (
    <svg viewBox="0 0 20 16" width={size * 1.25} height={size} className={className} fill="none" stroke="currentColor" strokeLinecap="round">
      <path d="M1.3 4.6 A12.3 12.3 0 0 1 18.7 4.6" strokeWidth={2} style={arc(strength >= 3)} />
      <path d="M4.1 7.4 A8.3 8.3 0 0 1 15.9 7.4" strokeWidth={2} style={arc(strength >= 2)} />
      <path d="M6.9 10.2 A4.3 4.3 0 0 1 13.1 10.2" strokeWidth={2} style={arc(strength >= 1)} />
      <circle cx="10" cy="13.3" r="1.55" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WifiOffGlyph({ className, size = 16 }: GlyphProps) {
  return (
    <svg viewBox="0 0 20 16" width={size * 1.25} height={size} className={className} fill="none" stroke="currentColor" strokeLinecap="round">
      <g opacity={0.35}>
        <path d="M1.3 4.6 A12.3 12.3 0 0 1 18.7 4.6" strokeWidth={2} />
        <path d="M4.1 7.4 A8.3 8.3 0 0 1 15.9 7.4" strokeWidth={2} />
        <path d="M6.9 10.2 A4.3 4.3 0 0 1 13.1 10.2" strokeWidth={2} />
        <circle cx="10" cy="13.3" r="1.55" fill="currentColor" stroke="none" />
      </g>
      <path d="M3 1.5 L17 15" strokeWidth={1.8} />
    </svg>
  );
}

export function BluetoothGlyph({ className, size = 16 }: GlyphProps) {
  return (
    <svg viewBox="0 0 16 18" width={size * 0.9} height={size} className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 5 L12 12.5 L8 16 V2 L12 5.5 L3.5 13" />
    </svg>
  );
}

export function SpeakerGlyph({ level = 3, className, size = 16 }: GlyphProps & { level?: number }) {
  return (
    <svg viewBox="0 0 22 18" width={size * 1.22} height={size} className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
      <path d="M2.5 6.5 H5.8 L10 2.8 V15.2 L5.8 11.5 H2.5 Z" fill="currentColor" strokeLinejoin="round" />
      {level === 0 ? (
        <path d="M13.5 6.5 L18.5 11.5 M18.5 6.5 L13.5 11.5" />
      ) : (
        <>
          <path d="M12.8 6.6 A3.4 3.4 0 0 1 12.8 11.4" style={{ opacity: level >= 1 ? 1 : 0.28 }} />
          <path d="M15.2 4.4 A6.6 6.6 0 0 1 15.2 13.6" style={{ opacity: level >= 2 ? 1 : 0.28 }} />
          <path d="M17.6 2.2 A9.8 9.8 0 0 1 17.6 15.8" style={{ opacity: level >= 3 ? 1 : 0.28 }} />
        </>
      )}
    </svg>
  );
}

export function BatteryGlyph({ level = 100, charging = false, className, size = 13 }: GlyphProps & { level?: number; charging?: boolean }) {
  const w = Math.max(1.5, (19.5 * Math.min(100, Math.max(0, level))) / 100);
  const low = level <= 20 && !charging;
  return (
    <svg viewBox="0 0 28 13" width={(size * 28) / 13} height={size} className={className} fill="none">
      <rect x="0.6" y="0.6" width="23.4" height="11.8" rx="3.6" stroke="currentColor" strokeOpacity={0.45} strokeWidth={1.2} />
      <rect x="25" y="4.3" width="1.8" height="4.4" rx="0.9" fill="currentColor" fillOpacity={0.45} />
      <rect x="2.4" y="2.4" width={w} height="8.2" rx="2" fill={low ? '#ff3b30' : 'currentColor'} />
      {charging && (
        <path d="M13.6 1.2 L8.8 7 H12.1 L10.6 11.8 L15.6 5.8 H12.3 Z" fill="currentColor" stroke="black" strokeOpacity={0.35} strokeWidth={0.6} />
      )}
    </svg>
  );
}

export function ControlCenterGlyph({ className, size = 15 }: GlyphProps) {
  return (
    <svg viewBox="0 0 18 16" width={size * 1.12} height={size} className={className} fill="none" stroke="currentColor" strokeWidth={1.4}>
      <rect x="1" y="1.4" width="16" height="5.6" rx="2.8" />
      <circle cx="14.2" cy="4.2" r="1.7" fill="currentColor" stroke="none" />
      <rect x="1" y="9" width="16" height="5.6" rx="2.8" />
      <circle cx="3.8" cy="11.8" r="1.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SearchGlyph({ className, size = 15 }: GlyphProps) {
  return (
    <svg viewBox="0 0 18 18" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeLinecap="round">
      <circle cx="7.6" cy="7.6" r="5.6" strokeWidth={1.8} />
      <path d="M11.9 11.9 L16.4 16.4" strokeWidth={2.2} />
    </svg>
  );
}

export function SunGlyph({ className, size = 16 }: GlyphProps) {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    const r = (n: number) => Math.round(n * 1000) / 1000;
    return { x1: r(9 + Math.cos(a) * 5.6), y1: r(9 + Math.sin(a) * 5.6), x2: r(9 + Math.cos(a) * 7.8), y2: r(9 + Math.sin(a) * 7.8) };
  });
  return (
    <svg viewBox="0 0 18 18" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <circle cx="9" cy="9" r="3.4" fill="currentColor" stroke="none" />
      {rays.map((r, i) => <line key={i} {...r} />)}
    </svg>
  );
}

export function MoonGlyph({ className, size = 16 }: GlyphProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="currentColor">
      <path d="M13.8 10.4 A6.2 6.2 0 1 1 6.6 2.1 A5 5 0 0 0 13.8 10.4 Z" />
    </svg>
  );
}

export function AirDropGlyph({ className, size = 16 }: GlyphProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <circle cx="8" cy="9" r="1.5" fill="currentColor" stroke="none" />
      <path d="M5.1 11.9 A4.1 4.1 0 1 1 10.9 11.9" />
      <path d="M3.05 13.95 A7 7 0 1 1 12.95 13.95" />
    </svg>
  );
}

export function StageManagerGlyph({ className, size = 16 }: GlyphProps) {
  return (
    <svg viewBox="0 0 18 16" width={size * 1.12} height={size} className={className} fill="none" stroke="currentColor" strokeWidth={1.4}>
      <rect x="6" y="2.5" width="10.5" height="11" rx="2" />
      <rect x="1.5" y="3.5" width="2.6" height="2.4" rx="0.7" fill="currentColor" stroke="none" />
      <rect x="1.5" y="6.8" width="2.6" height="2.4" rx="0.7" fill="currentColor" stroke="none" />
      <rect x="1.5" y="10.1" width="2.6" height="2.4" rx="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ScreenMirrorGlyph({ className, size = 16 }: GlyphProps) {
  return (
    <svg viewBox="0 0 18 16" width={size * 1.12} height={size} className={className} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round">
      <rect x="1.5" y="1.8" width="11.5" height="8.2" rx="1.6" />
      <rect x="5" y="5.8" width="11.5" height="8.2" rx="1.6" fill="currentColor" fillOpacity={0.25} />
    </svg>
  );
}

export function LockGlyph({ className, size = 12 }: GlyphProps) {
  return (
    <svg viewBox="0 0 12 14" width={(size * 12) / 14} height={size} className={className} fill="none">
      <path d="M3.3 6.4 V4.4 A2.7 2.7 0 0 1 8.7 4.4 V6.4" stroke="currentColor" strokeWidth={1.5} />
      <rect x="1.2" y="6" width="9.6" height="7.4" rx="1.8" fill="currentColor" />
    </svg>
  );
}

export function CheckGlyph({ className, size = 12 }: GlyphProps) {
  return (
    <svg viewBox="0 0 14 14" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 7.5 L5.6 10.5 L11.5 3.5" />
    </svg>
  );
}

export function ChevronGlyph({ dir = 'right', className, size = 10 }: GlyphProps & { dir?: 'right' | 'left' | 'down' | 'up' }) {
  const rot = { right: 0, down: 90, left: 180, up: 270 }[dir];
  return (
    <svg viewBox="0 0 10 10" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M3.5 1.5 L7 5 L3.5 8.5" />
    </svg>
  );
}

export function PlayGlyph({ className, size = 14 }: GlyphProps) {
  return (
    <svg viewBox="0 0 14 14" width={size} height={size} className={className} fill="currentColor">
      <path d="M3.5 1.8 L12 7 L3.5 12.2 Z" />
    </svg>
  );
}

export function ForwardGlyph({ className, size = 14 }: GlyphProps) {
  return (
    <svg viewBox="0 0 18 14" width={(size * 18) / 14} height={size} className={className} fill="currentColor">
      <path d="M1.5 2 L8.5 7 L1.5 12 Z M9 2 L16 7 L9 12 Z" />
    </svg>
  );
}

export function LaptopGlyph({ className, size = 16 }: GlyphProps) {
  return (
    <svg viewBox="0 0 20 14" width={(size * 20) / 14} height={size} className={className} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round">
      <rect x="3.5" y="1.5" width="13" height="8.6" rx="1.2" />
      <path d="M1 12.3 H19" strokeLinecap="round" strokeWidth={1.8} />
    </svg>
  );
}

export function HeadphonesGlyph({ className, size = 16 }: GlyphProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <path d="M2.5 10 V8 A5.5 5.5 0 0 1 13.5 8 V10" />
      <rect x="1.8" y="9" width="3.2" height="5" rx="1.4" fill="currentColor" />
      <rect x="11" y="9" width="3.2" height="5" rx="1.4" fill="currentColor" />
    </svg>
  );
}

export function DisplayGlyph({ className, size = 16 }: GlyphProps) {
  return (
    <svg viewBox="0 0 18 16" width={size * 1.12} height={size} className={className} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round">
      <rect x="1.5" y="1.5" width="15" height="10" rx="1.5" />
      <path d="M6 14.5 H12 M9 11.5 V14.5" strokeLinecap="round" />
    </svg>
  );
}

/** Classic macOS spoked activity indicator. */
export function Spinner({ size = 18, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} className={`animate-spin ${className ?? ''}`} style={{ animationDuration: '0.9s', animationTimingFunction: 'steps(12)' }}>
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x="9.1" y="1.5" width="1.8" height="5" rx="0.9" fill="currentColor" opacity={0.15 + (i / 12) * 0.85} transform={`rotate(${i * 30} 10 10)`} />
      ))}
    </svg>
  );
}

/* --- Traffic light glyphs --- */
export function CloseMark() {
  return (
    <svg viewBox="0 0 8 8" width={6} height={6} fill="none" stroke="rgba(77,0,0,0.75)" strokeWidth={1.3} strokeLinecap="round">
      <path d="M1.5 1.5 L6.5 6.5 M6.5 1.5 L1.5 6.5" />
    </svg>
  );
}
export function MinimizeMark() {
  return (
    <svg viewBox="0 0 8 8" width={7} height={7} fill="none" stroke="rgba(100,60,0,0.8)" strokeWidth={1.4} strokeLinecap="round">
      <path d="M1 4 H7" />
    </svg>
  );
}
export function ZoomMark() {
  return (
    <svg viewBox="0 0 8 8" width={6} height={6} fill="rgba(0,80,0,0.75)">
      <path d="M1 1 H5 L1 5 Z M7 7 H3 L7 3 Z" />
    </svg>
  );
}
