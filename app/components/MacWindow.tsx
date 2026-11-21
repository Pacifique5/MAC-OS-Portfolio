'use client';

import { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';
import { CloseMark, MinimizeMark, ZoomMark } from './icons/SystemIcons';

const MENU_BAR_H = 28;

interface ChromeCtx {
  lights: ReactNode;
  startDrag: (e: React.MouseEvent) => void;
  toggleZoom: () => void;
  active: boolean;
}

const WindowChromeContext = createContext<ChromeCtx | null>(null);

function useWindowChrome() {
  const ctx = useContext(WindowChromeContext);
  if (!ctx) throw new Error('WindowLayout must be rendered inside <MacWindow>');
  return ctx;
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

export default function MacWindow({ children, zIndex, active, initialOffset, onClose, onMinimize, onFocus, zoomed, onToggleZoom }: MacWindowProps) {
  // Size to the viewport, leaving room for the menu bar, Dock and desktop icons.
  const [size] = useState(() => ({
    w: Math.max(320, Math.min(920, window.innerWidth - 150)),
    h: Math.max(320, Math.min(620, window.innerHeight - MENU_BAR_H - 110)),
  }));
  // Cascade windows but always keep them fully on screen, above the Dock.
  const [pos, setPos] = useState(() => {
    const maxX = Math.max(10, window.innerWidth - size.w - 120);
    const maxY = Math.max(MENU_BAR_H + 8, window.innerHeight - size.h - 90);
    return {
      x: Math.min(maxX, Math.max(10, (window.innerWidth - size.w) / 2 - 60 + initialOffset * 24)),
      y: Math.min(maxY, MENU_BAR_H + 16 + initialOffset * 24),
    };
  });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const startDrag = (e: React.MouseEvent) => {
    if (e.button !== 0 || zoomed) return;
    if ((e.target as HTMLElement).closest('button, a, input, textarea, select, [data-no-drag]')) return;
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
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

  const toggleZoom = onToggleZoom;

  const frameStyle: React.CSSProperties = zoomed
    ? { left: 6, top: MENU_BAR_H + 6, width: 'calc(100vw - 12px)', height: `calc(100vh - ${MENU_BAR_H}px - 92px)` }
    : { left: pos.x, top: pos.y, width: size.w, height: size.h };

  const ctx: ChromeCtx = {
    lights: <TrafficLights active={active} onClose={onClose} onMinimize={onMinimize} onZoom={toggleZoom} />,
    startDrag,
    toggleZoom,
    active,
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

export function WindowLayout({ title, subtitle, sidebar, sidebarWidth = 210, toolbar, children, surface = 'window' }: WindowLayoutProps) {
  const { lights, startDrag, toggleZoom, active } = useWindowChrome();
  const drag = { onMouseDown: startDrag, onDoubleClick: toggleZoom };

  return (
    <div className="flex h-full">
      {sidebar && (
        <aside className="mac-sidebar flex flex-col shrink-0 border-r border-(--hairline)" style={{ width: sidebarWidth }}>
          <div className="h-13 flex items-center px-4.5 shrink-0" {...drag}>{lights}</div>
          <div className="flex-1 overflow-y-auto mac-scroll px-2.5 pb-3">{sidebar}</div>
        </aside>
      )}
      <div className={`flex-1 flex flex-col min-w-0 ${surface === 'grouped' ? 'bg-(--content-bg)' : 'bg-(--window-bg)'}`}>
        <div className="h-13 flex items-center gap-3 px-4 shrink-0 border-b border-(--hairline) bg-(--toolbar-bg) backdrop-blur-xl" {...drag}>
          {!sidebar && lights}
          <div className={`min-w-0 ${sidebar ? '' : 'pl-2'} ${active ? '' : 'opacity-50'}`}>
            <div className="text-[15px] font-bold leading-tight truncate">{title}</div>
            {subtitle && <div className="text-[11px] text-black/50 dark:text-white/50 leading-tight truncate">{subtitle}</div>}
          </div>
          <div className="flex-1" />
          {toolbar && <div className="flex items-center gap-1" data-no-drag>{toolbar}</div>}
        </div>
        <div className="flex-1 overflow-y-auto mac-scroll">{children}</div>
      </div>
    </div>
  );
}
