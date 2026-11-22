'use client';

import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';
import { CloseMark, MinimizeMark, ZoomMark } from './icons/SystemIcons';
import { useViewport } from './useViewport';

const MENU_BAR_H = 28;
/** Space kept free under full-screen windows on phones for the Dock. */
const PHONE_DOCK_H = 66;
/** Windows narrower than this use the compact layout (sidebar becomes a drawer). */
const COMPACT_MAX = 720;

interface ChromeCtx {
  lights: ReactNode;
  startDrag: (e: React.MouseEvent) => void;
  toggleZoom: () => void;
  active: boolean;
  /** Narrow window — sidebars collapse into a drawer, master/detail views stack. */
  compact: boolean;
  /** Phone layout — windows are full screen and can't be dragged. */
  phone: boolean;
}

const WindowChromeContext = createContext<ChromeCtx | null>(null);

function useWindowChrome() {
  const ctx = useContext(WindowChromeContext);
  if (!ctx) throw new Error('WindowLayout must be rendered inside <MacWindow>');
  return ctx;
}

/** Lets app windows adapt their own layout to the window size. */
export function useWindowSize() {
  const { compact, phone } = useWindowChrome();
  return { compact, phone };
}

/* ------------------------------------------------------------------ */
/* Traffic lights                                                      */
/* ------------------------------------------------------------------ */

function TrafficLights({ active, onClose, onMinimize, onZoom }: { active: boolean; onClose?: () => void; onMinimize?: () => void; onZoom: () => void }) {
  const base = 'w-3 h-3 rounded-full flex items-center justify-center';
  const ring = { boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.18)' };
  const idle = 'bg-[#d4d4d6] dark:bg-[#4b4b4f]';
  return (
    <div className="group/lights flex items-center gap-2 shrink-0" data-no-drag onDoubleClick={(e) => e.stopPropagation()}>
      <button type="button" aria-label="Close" onClick={(e) => { e.stopPropagation(); onClose?.(); }}
        className={`${base} ${active ? 'bg-[#ff5f57]' : idle} group-hover/lights:bg-[#ff5f57]!`} style={ring}>
        <span className="opacity-0 group-hover/lights:opacity-100"><CloseMark /></span>
      </button>
      <button type="button" aria-label="Minimize" onClick={(e) => { e.stopPropagation(); onMinimize?.(); }}
        className={`${base} ${active ? 'bg-[#febc2e]' : idle} group-hover/lights:bg-[#febc2e]!`} style={ring}>
        <span className="opacity-0 group-hover/lights:opacity-100"><MinimizeMark /></span>
      </button>
      <button type="button" aria-label="Zoom" onClick={(e) => { e.stopPropagation(); onZoom(); }}
        className={`${base} ${active ? 'bg-[#28c840]' : idle} group-hover/lights:bg-[#28c840]!`} style={ring}>
        <span className="opacity-0 group-hover/lights:opacity-100"><ZoomMark /></span>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Window frame                                                        */
/* ------------------------------------------------------------------ */

interface MacWindowProps {
  children: ReactNode;
  zIndex: number;
  active: boolean;
  initialOffset: number;
  onClose?: () => void;
  onMinimize?: () => void;
  onFocus?: () => void;
  /** Zoom state is owned by the window manager so the Window menu can toggle it */
  zoomed: boolean;
  onToggleZoom: () => void;
}

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), Math.max(min, max));

export default function MacWindow({ children, zIndex, active, initialOffset, onClose, onMinimize, onFocus, zoomed, onToggleZoom }: MacWindowProps) {
  const vp = useViewport(true);

  // Preferred size, chosen once; it is clamped to the viewport on every render below.
  const [size] = useState(() => ({
    w: Math.max(320, Math.min(920, window.innerWidth - 150)),
    h: Math.max(320, Math.min(620, window.innerHeight - MENU_BAR_H - 110)),
  }));
  // Cascade new windows from the top-left.
  const [pos, setPos] = useState(() => ({
    x: Math.max(10, (window.innerWidth - size.w) / 2 - 60 + initialOffset * 24),
    y: MENU_BAR_H + 16 + initialOffset * 24,
  }));
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Keep the window fully on screen even after the browser is resized.
  const w = Math.min(size.w, vp.width - 24);
  const h = Math.min(size.h, vp.height - MENU_BAR_H - 90);
  const x = clamp(pos.x, 6, vp.width - w - 6);
  const y = clamp(pos.y, MENU_BAR_H + 4, vp.height - h - 80);

  const startDrag = (e: React.MouseEvent) => {
    if (e.button !== 0 || zoomed || vp.phone) return;
    if ((e.target as HTMLElement).closest('button, a, input, textarea, select, [data-no-drag]')) return;
    dragOffset.current = { x: e.clientX - x, y: e.clientY - y };
    setDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent) => {
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: Math.max(MENU_BAR_H, e.clientY - dragOffset.current.y),
      });
    };
    const up = () => setDragging(false);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
  }, [dragging]);

  const toggleZoom = () => { if (!vp.phone) onToggleZoom(); };

  let frameStyle: React.CSSProperties;
  let frameWidth: number;
  if (vp.phone) {
    frameStyle = { left: 0, top: MENU_BAR_H, width: '100vw', height: `calc(100dvh - ${MENU_BAR_H}px - ${PHONE_DOCK_H}px)`, borderRadius: 0 };
    frameWidth = vp.width;
  } else if (zoomed) {
    frameStyle = { left: 6, top: MENU_BAR_H + 6, width: 'calc(100vw - 12px)', height: `calc(100dvh - ${MENU_BAR_H}px - 92px)` };
    frameWidth = vp.width - 12;
  } else {
    frameStyle = { left: x, top: y, width: w, height: h };
    frameWidth = w;
  }

  const ctx: ChromeCtx = {
    lights: <TrafficLights active={active} onClose={onClose} onMinimize={onMinimize} onZoom={toggleZoom} />,
    startDrag,
    toggleZoom,
    active,
    compact: frameWidth < COMPACT_MAX,
    phone: vp.phone,
  };

  return (
    <WindowChromeContext.Provider value={ctx}>
      <div
        className={`fixed overflow-hidden rounded-[10px] animate-scale-in bg-(--window-bg) text-[#1d1d1f] dark:text-white ${
          dragging ? '' : 'transition-[left,top,width,height,border-radius] duration-300 ease-out'
        }`}
        style={{
          ...frameStyle,
          zIndex,
          boxShadow: active
            ? '0 0 0 0.5px rgba(0,0,0,0.45), inset 0 0 0 0.5px rgba(255,255,255,0.12), 0 24px 70px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.2)'
            : '0 0 0 0.5px rgba(0,0,0,0.35), inset 0 0 0 0.5px rgba(255,255,255,0.08), 0 12px 32px rgba(0,0,0,0.28)',
        }}
        onMouseDownCapture={onFocus}
        onTouchStartCapture={onFocus}
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </WindowChromeContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Layout used by every app window                                     */
/* ------------------------------------------------------------------ */

interface WindowLayoutProps {
  title: ReactNode;
  subtitle?: ReactNode;
  sidebar?: ReactNode;
  sidebarWidth?: number;
  toolbar?: ReactNode;
  children: ReactNode;
  /** Background of the content pane — 'window' (white) or 'grouped' (light gray, for inset lists) */
  surface?: 'window' | 'grouped';
}

function SidebarGlyph() {
  return (
    <svg viewBox="0 0 18 14" width="17" height="13" fill="none" stroke="currentColor" strokeWidth={1.4}>
      <rect x="0.7" y="0.7" width="16.6" height="12.6" rx="2.4" />
      <path d="M6 0.7 V13.3" />
      <path d="M2.4 3.8 H4.2 M2.4 6 H4.2 M2.4 8.2 H4.2" strokeLinecap="round" />
    </svg>
  );
}

export function WindowLayout({ title, subtitle, sidebar, sidebarWidth = 210, toolbar, children, surface = 'window' }: WindowLayoutProps) {
  const { lights, startDrag, toggleZoom, active, compact } = useWindowChrome();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drag = { onMouseDown: startDrag, onDoubleClick: toggleZoom };
  const drawer = Boolean(sidebar) && compact;

  // In drawer mode, choosing anything in the sidebar closes it.
  const closeOnPick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, a')) setTimeout(() => setDrawerOpen(false), 0);
  };

  return (
    <div className="relative flex h-full">
      {sidebar && !drawer && (
        <aside className="mac-sidebar flex flex-col shrink-0 border-r border-(--hairline)" style={{ width: sidebarWidth }}>
          <div className="h-13 flex items-center px-4.5 shrink-0" {...drag}>{lights}</div>
          <div className="flex-1 overflow-y-auto mac-scroll px-2.5 pb-3">{sidebar}</div>
        </aside>
      )}

      <div className={`flex-1 flex flex-col min-w-0 ${surface === 'grouped' ? 'bg-(--content-bg)' : 'bg-(--window-bg)'}`}>
        <div className={`h-13 flex items-center gap-3 shrink-0 border-b border-(--hairline) bg-(--toolbar-bg) backdrop-blur-xl ${compact ? 'px-3' : 'px-4'}`} {...drag}>
          {(!sidebar || drawer) && lights}
          {drawer && (
            <button type="button" aria-label="Show sidebar" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(o => !o)}
              className="h-7 w-8 shrink-0 rounded-md flex items-center justify-center text-black/60 dark:text-white/70 hover:bg-black/6 dark:hover:bg-white/8">
              <SidebarGlyph />
            </button>
          )}
          <div className={`min-w-0 ${sidebar && !drawer ? '' : 'pl-1'} ${active ? '' : 'opacity-50'}`}>
            <div className="text-[15px] font-bold leading-tight truncate">{title}</div>
            {subtitle && <div className="text-[11px] text-black/50 dark:text-white/50 leading-tight truncate">{subtitle}</div>}
          </div>
          <div className="flex-1" />
          {toolbar && <div className="flex items-center gap-1 min-w-0 overflow-x-auto no-scrollbar" data-no-drag>{toolbar}</div>}
        </div>
        <div className="@container flex-1 overflow-y-auto mac-scroll">{children}</div>
      </div>

      {/* Compact windows: sidebar slides in as a drawer */}
      {drawer && drawerOpen && (
        <>
          <div className="absolute inset-0 z-20 bg-black/25 animate-fade-in" onClick={() => setDrawerOpen(false)} />
          <aside
            className="mac-sidebar absolute inset-y-0 left-0 z-30 flex flex-col w-[min(260px,85%)] border-r border-(--hairline) shadow-2xl animate-slide-in-left"
            onClickCapture={closeOnPick}
          >
            <div className="h-13 flex items-center justify-between px-4 shrink-0">
              <span className="text-[13px] font-semibold">{title}</span>
              <button type="button" aria-label="Hide sidebar" onClick={() => setDrawerOpen(false)}
                className="h-7 w-8 rounded-md flex items-center justify-center text-black/60 dark:text-white/70 hover:bg-black/6 dark:hover:bg-white/8">
                <SidebarGlyph />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto mac-scroll px-2.5 pb-3">{sidebar}</div>
          </aside>
        </>
      )}
    </div>
  );
}
