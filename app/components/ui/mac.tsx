'use client';
// Shared macOS-style controls.
import { ReactNode } from 'react';
import type { IconType } from 'react-icons';

/* ---------------- Switch (NSSwitch) ---------------- */
export function Toggle({ on, onChange, disabled, size = 'sm' }: { on: boolean; onChange?: (v: boolean) => void; disabled?: boolean; size?: 'sm' | 'md' }) {
  const w = size === 'sm' ? 26 : 38;
  const h = size === 'sm' ? 15 : 22;
  const k = h - 2;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={(e) => { e.stopPropagation(); onChange?.(!on); }}
      className="relative rounded-full transition-colors duration-200 disabled:opacity-40 flex-shrink-0"
      style={{
        width: w,
        height: h,
        background: on ? 'var(--mac-blue)' : 'rgba(120,120,128,0.32)',
        boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.15)',
      }}
    >
      <span
        className="absolute top-[1px] rounded-full bg-white transition-all duration-200"
        style={{ width: k, height: k, left: on ? w - k - 1 : 1, boxShadow: '0 1px 2px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(0,0,0,0.05)' }}
      />
    </button>
  );
}

/* ---------------- Control Center slider ---------------- */
export function CCSlider({ value, onChange, min = 0, max = 100, icon }: { value: number; onChange: (v: number) => void; min?: number; max?: number; icon: ReactNode }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative h-[22px] w-full rounded-full overflow-hidden" style={{ background: 'rgba(120,120,128,0.28)', boxShadow: 'inset 0 0 0 0.5px var(--hairline)' }}>
      <div className="absolute inset-y-0 left-0 bg-white" style={{ width: `calc(22px + (100% - 22px) * ${pct / 100})`, borderRadius: 999 }} />
      <div className="absolute left-[5px] top-0 bottom-0 flex items-center text-[#6e6e73] pointer-events-none">{icon}</div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="slider"
      />
    </div>
  );
}

/* ---------------- Menus ---------------- */
export function MenuItem({ children, onClick, checked, danger, hint }: { children: ReactNode; onClick?: () => void; checked?: boolean; danger?: boolean; hint?: ReactNode }) {
  return (
    <button type="button" className="mac-menu-item" onClick={onClick}>
      <span className="flex items-center gap-1.5 min-w-0">
        <span className="w-3 flex items-center justify-center flex-shrink-0">
          {checked && (
            <svg viewBox="0 0 14 14" width="10" height="10" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.5 L5.6 10.5 L11.5 3.5" /></svg>
          )}
        </span>
        <span className={`truncate ${danger ? 'text-[#ff453a]' : ''}`}>{children}</span>
      </span>
      {hint && <span className="mac-shortcut">{hint}</span>}
    </button>
  );
}

export function MenuSeparator() {
  return <div className="mac-menu-sep" />;
}

/* ---------------- Circle icon (Wi-Fi / Bluetooth rows, CC) ---------------- */
export function CircleIcon({ children, active, size = 26 }: { children: ReactNode; active?: boolean; size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full flex-shrink-0 transition-colors"
      style={{
        width: size,
        height: size,
        background: active ? 'var(--mac-blue)' : 'rgba(120,120,128,0.25)',
        color: active ? '#fff' : 'var(--menu-fg)',
      }}
    >
      {children}
    </span>
  );
}

/* ---------------- Settings-style coloured symbol tile ---------------- */
export function SymbolTile({ Glyph, color, size = 22 }: { Glyph: IconType; color: string; size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        background: `linear-gradient(180deg, ${color}, color-mix(in srgb, ${color} 78%, black))`,
        boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.12)',
      }}
    >
      <Glyph style={{ color: 'white', width: size * 0.62, height: size * 0.62 }} />
    </span>
  );
}

/* ---------------- Inset grouped list (System Settings) ---------------- */
export function InsetGroup({ title, footer, children }: { title?: ReactNode; footer?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-5">
      {title && <h3 className="px-2.5 mb-1.5 text-[13px] font-semibold text-[#1d1d1f] dark:text-white/90">{title}</h3>}
      <div className="rounded-[10px] overflow-hidden bg-[var(--group-bg)] shadow-[0_0_0_0.5px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_0.5px_rgba(255,255,255,0.08)] divide-y divide-black/[0.07] dark:divide-white/[0.07]">
        {children}
      </div>
      {footer && <p className="px-2.5 mt-1.5 text-[11px] text-black/45 dark:text-white/45">{footer}</p>}
    </section>
  );
}

export function GroupRow({ icon, label, detail, right, onClick, href }: { icon?: ReactNode; label: ReactNode; detail?: ReactNode; right?: ReactNode; onClick?: () => void; href?: string }) {
  const content = (
    <>
      {icon}
      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-[#1d1d1f] dark:text-white">{label}</div>
        {detail && <div className="text-[11px] text-black/50 dark:text-white/50 mt-px">{detail}</div>}
      </div>
      {right && <div className="flex items-center gap-1.5 text-[13px] text-black/50 dark:text-white/50 flex-shrink-0">{right}</div>}
    </>
  );
  const cls = 'flex items-center gap-2.5 px-3 py-2 min-h-[36px] w-full text-left';
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={`${cls} hover:bg-black/[0.03] dark:hover:bg-white/[0.04]`}>{content}</a>;
  if (onClick) return <button type="button" onClick={onClick} className={`${cls} hover:bg-black/[0.03] dark:hover:bg-white/[0.04]`}>{content}</button>;
  return <div className={cls}>{content}</div>;
}

/* ---------------- Sidebar (source list) ---------------- */
export function SidebarSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="mb-3">
      {title && <div className="px-2.5 pb-1 text-[11px] font-semibold text-black/40 dark:text-white/40">{title}</div>}
      <div className="space-y-px">{children}</div>
    </div>
  );
}

export function SidebarItem({ icon, label, active, onClick, badge }: { icon?: ReactNode; label: ReactNode; active?: boolean; onClick?: () => void; badge?: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2 h-7 px-2.5 rounded-md text-[13px] text-left transition-colors ${
        active ? 'bg-black/[0.08] dark:bg-white/[0.12]' : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
      } text-[#1d1d1f] dark:text-white/90`}
    >
      {icon && <span className="flex items-center justify-center w-[18px] text-macblue flex-shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{label}</span>
      {badge !== undefined && <span className="text-[11px] text-black/40 dark:text-white/40">{badge}</span>}
    </button>
  );
}

/* ---------------- Push buttons ---------------- */
export function PushButton({ children, primary, onClick, href, download, type = 'button', disabled }: { children: ReactNode; primary?: boolean; onClick?: () => void; href?: string; download?: boolean; type?: 'button' | 'submit'; disabled?: boolean }) {
  const cls = `inline-flex items-center justify-center gap-1.5 h-[24px] px-3 rounded-md text-[13px] font-medium transition-[filter] active:brightness-90 disabled:opacity-50 ${
    primary
      ? 'text-white shadow-[0_0.5px_1px_rgba(0,0,0,0.25),inset_0_0.5px_0_rgba(255,255,255,0.25)] bg-[linear-gradient(180deg,#3d95ff,#0a6cff)]'
      : 'bg-white dark:bg-white/[0.16] text-[#1d1d1f] dark:text-white shadow-[0_0.5px_1.5px_rgba(0,0,0,0.25),0_0_0_0.5px_rgba(0,0,0,0.12)]'
  }`;
  if (href) {
    const external = href.startsWith('http');
    return <a href={href} download={download} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} className={cls}>{children}</a>;
  }
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

/* ---------------- Level indicator ---------------- */
export function LevelBar({ value, color = 'var(--mac-blue)' }: { value: number; color?: string }) {
  return (
    <div className="h-[5px] w-full rounded-full bg-black/[0.08] dark:bg-white/[0.12] overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
    </div>
  );
}

/* ---------------- Toolbar icon button ---------------- */
export function ToolbarButton({ children, onClick, title, active }: { children: ReactNode; onClick?: () => void; title?: string; active?: boolean }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`h-7 min-w-7 px-1.5 rounded-md flex items-center justify-center gap-1 text-black/60 dark:text-white/70 hover:bg-black/[0.06] dark:hover:bg-white/[0.08] ${active ? 'bg-black/[0.08] dark:bg-white/[0.12]' : ''}`}
    >
      {children}
    </button>
  );
}
