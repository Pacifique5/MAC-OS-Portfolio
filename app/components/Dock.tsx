'use client';
import { useRef, useState } from 'react';
import { APPS, DOCK_LAYOUT, WindowId } from './apps';
import { useViewport } from './useViewport';

const RANGE = 150;
const PHONE_ICON = 44;

interface DockProps {
  running: WindowId[];
  minimized: WindowId[];
  bouncing: string | null;
  onAppClick: (id: string) => void;
  onRestore: (id: WindowId) => void;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
}

type Entry = { key: string; kind: 'app' | 'min' | 'sep'; id?: string };

export default function Dock({ running, minimized, bouncing, onAppClick, onRestore, onContextMenu }: DockProps) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [sizes, setSizes] = useState<number[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);

  const entries: Entry[] = [
    ...DOCK_LAYOUT.map((id, i): Entry => (id ? { key: id, kind: 'app', id } : { key: `sep-${i}`, kind: 'sep' })),
    { key: 'sep-end', kind: 'sep' },
    ...minimized.map((id): Entry => ({ key: `min-${id}`, kind: 'min', id })),
    { key: 'trash', kind: 'app', id: 'trash' },
  ];

  const vp = useViewport();
  const iconCount = entries.filter(e => e.kind !== 'sep').length;
  // Larger screens shrink the Dock to fit, like macOS. When icons would get too small to use
  // (phones, narrow windows), it switches to a fixed size and becomes a swipeable strip.
  const fitted = Math.min(50, Math.floor((vp.width - 70) / iconCount) - 8);
  const scroll = vp.phone || fitted < 34;
  const BASE = vp.phone ? PHONE_ICON : scroll ? 38 : fitted;
  const MAX = Math.round(BASE * 1.6);
  // Magnification and hover labels need a mouse and room to grow
  const pointer = !vp.touch && !scroll;

  const handleMove = (e: React.MouseEvent) => {
    if (!pointer) return;
    setSizes(entries.map((_, i) => {
      const el = refs.current[i];
      if (!el) return BASE;
      const r = el.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      const t = Math.max(0, 1 - d / RANGE);
      const eased = t * t * (3 - 2 * t);
      return BASE + (MAX - BASE) * eased;
    }));
  };

  const isRunning = (id: string) => {
    if (id === 'finder') return true; // Finder is always running on macOS
    const action = APPS[id]?.action;
    return action?.type === 'window' && running.includes(action.window);
  };

  return (
    <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-50 max-w-[calc(100vw-12px)]" onClick={(e) => e.stopPropagation()}>
      <div
        className={`flex items-end px-1.5 pt-1.5 pb-1 rounded-[20px] bg-white/20 dark:bg-black/25 backdrop-blur-2xl backdrop-saturate-150 ${scroll ? 'overflow-x-auto no-scrollbar snap-x' : ''}`}
        style={{ boxShadow: '0 0 0 0.5px rgba(0,0,0,0.25), inset 0 0 0 0.5px rgba(255,255,255,0.35), 0 10px 30px rgba(0,0,0,0.25)' }}
        onMouseMove={handleMove}
        onMouseLeave={() => { setSizes([]); setHovered(null); }}
      >
        {entries.map((entry, i) => {
          if (entry.kind === 'sep') {
            return <div key={entry.key} className="w-px shrink-0 self-stretch mx-1.5 my-1.5 bg-black/20 dark:bg-white/25" style={{ boxShadow: '1px 0 0 rgba(255,255,255,0.25)' }} />;
          }
          const size = sizes[i] ?? BASE;
          const app = APPS[entry.id!];
          const label = entry.kind === 'min' ? `${app.label}` : app.label;
          return (
            <div
              key={entry.key}
              ref={el => { refs.current[i] = el; }}
              className="relative flex flex-col items-center px-0.75 shrink-0 snap-start"
              onMouseEnter={() => pointer && setHovered(entry.key)}
            >
              {hovered === entry.key && (
                <div className="absolute bottom-full mb-2.5 pointer-events-none animate-fade-in" style={{ marginBottom: 10 + (size - BASE) * 0.15 }}>
                  <div className="mac-menu py-0.75! px-2.5! text-[13px] whitespace-nowrap">{label}</div>
                  <div className="mx-auto w-2.5 h-2.5 rotate-45 -mt-1.5 bg-(--menu-bg)" style={{ boxShadow: '0.5px 0.5px 0 rgba(0,0,0,0.25)' }} />
                </div>
              )}
              <button
                type="button"
                aria-label={label}
                onClick={() => (entry.kind === 'min' ? onRestore(entry.id as WindowId) : onAppClick(entry.id!))}
                onContextMenu={(e) => onContextMenu(e, entry.id!)}
                className={`block outline-none ${bouncing === entry.id ? 'animate-dock-bounce' : ''}`}
                style={{ width: size, height: size, transition: sizes.length ? 'none' : 'width 0.2s, height 0.2s', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))' }}
              >
                {entry.kind === 'min' ? <MinimizedThumb id={entry.id!} size={size} /> : <app.Icon size={size} />}
              </button>
              <span className={`mt-0.75 w-1 h-1 rounded-full ${entry.kind === 'app' && isRunning(entry.id!) ? 'bg-black/70 dark:bg-white/80' : 'bg-transparent'}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Minimized windows sit next to the Trash as a tiny window preview with the app badge. */
function MinimizedThumb({ id, size }: { id: string; size: number }) {
  const app = APPS[id];
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-[88%] h-[70%] rounded-sm bg-white dark:bg-[#2c2c2e] shadow-[0_0_0_0.5px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="h-[18%] bg-[#ececec] dark:bg-[#3a3a3c] flex items-center gap-0.5 px-[6%]">
          <span className="w-1.25 h-1.25 rounded-full bg-[#ff5f57]" />
          <span className="w-1.25 h-1.25 rounded-full bg-[#febc2e]" />
          <span className="w-1.25 h-1.25 rounded-full bg-[#28c840]" />
        </div>
        <div className="p-[8%] space-y-[6%]">
          <div className="h-0.75 w-3/4 rounded bg-black/10 dark:bg-white/15" />
          <div className="h-0.75 w-1/2 rounded bg-black/10 dark:bg-white/15" />
          <div className="h-0.75 w-2/3 rounded bg-black/10 dark:bg-white/15" />
        </div>
      </div>
      <div className="absolute bottom-0 right-0"><app.Icon size={size * 0.42} /></div>
    </div>
  );
}
