'use client';
import { useState } from 'react';
import { APPS, AppDef } from './apps';
import { SearchGlyph } from './icons/SystemIcons';
import { MessagesIcon, MailIcon } from './icons/AppIcons';
import { MenuItem, MenuSeparator } from './ui/mac';

/* ------------------------------------------------------------------ */
/* Spotlight                                                           */
/* ------------------------------------------------------------------ */

const SPOTLIGHT_KEYWORDS: Record<string, string> = {
  about: 'bio profile resume cv who',
  projects: 'work portfolio apps github code',
  skills: 'react next typescript python node tech stack',
  experience: 'internship education training certificates alx harvard',
  testimonials: 'reviews recommendations references',
  contact: 'email phone hire message reach',
};

export function Spotlight({ onClose, onOpen }: { onClose: () => void; onOpen: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);

  const q = query.trim().toLowerCase();
  const results: AppDef[] = q
    ? Object.values(APPS).filter(a => a.id !== 'trash' && `${a.label} ${a.kind} ${SPOTLIGHT_KEYWORDS[a.id] ?? ''}`.toLowerCase().includes(q))
    : [];
  const selected = results[Math.min(index, results.length - 1)];

  const groups: { title: string; items: AppDef[] }[] = [];
  if (results.length) {
    groups.push({ title: 'Top Hit', items: [results[0]] });
    for (const kind of ['Folder', 'Application', 'Website']) {
      const items = results.slice(1).filter(r => r.kind === kind);
      if (items.length) groups.push({ title: kind === 'Folder' ? 'Folders' : `${kind}s`, items });
    }
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIndex(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIndex(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && selected) { onOpen(selected.id); onClose(); }
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="absolute inset-0 z-[70]" onClick={onClose}>
      <div
        className="mac-panel !rounded-[14px] absolute top-[20%] left-1/2 -translate-x-1/2 w-[680px] max-w-[calc(100vw-32px)] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 h-[54px] px-4">
          <SearchGlyph size={20} className="opacity-45 flex-shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => { setQuery(e.target.value); setIndex(0); }}
            onKeyDown={onKey}
            placeholder="Spotlight Search"
            className="flex-1 bg-transparent outline-none text-[22px] font-light placeholder:text-[var(--menu-dim)]"
          />
          {selected && <span className="flex items-center gap-1.5 text-[13px] opacity-50 truncate max-w-[180px]">— {selected.label}</span>}
        </div>

        {q && (
          <div className="flex border-t border-[var(--menu-sep)] h-[300px]">
            <div className="w-[46%] overflow-y-auto mac-scroll p-1.5 border-r border-[var(--menu-sep)]">
              {results.length === 0 && <div className="p-4 text-center text-[13px] opacity-50">No Results</div>}
              {groups.map(g => (
                <div key={g.title}>
                  <div className="px-2 pt-2 pb-1 text-[11px] font-semibold opacity-50">{g.title}</div>
                  {g.items.map(item => {
                    const i = results.indexOf(item);
                    const active = selected?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onMouseEnter={() => setIndex(i)}
                        onClick={() => { onOpen(item.id); onClose(); }}
                        className={`w-full flex items-center gap-2 h-7 px-2 rounded-[5px] text-[13px] text-left ${active ? 'bg-[var(--mac-blue)] text-white' : ''}`}
                      >
                        <item.Icon size={20} />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-2 p-6 text-center">
              {selected && (
                <>
                  <selected.Icon size={96} />
                  <div className="text-[17px] font-semibold mt-2">{selected.label}</div>
                  <div className="text-[12px] opacity-50">{selected.kind}</div>
                  <div className="text-[11px] opacity-40 mt-3">Press Return to open</div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Notification Center                                                 */
/* ------------------------------------------------------------------ */

function CalendarWidget() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];

  return (
    <div className="mac-panel !rounded-[20px] p-3.5">
      <div className="text-[11px] font-bold text-[#ff3b30] uppercase tracking-wide mb-1.5">
        {now.toLocaleDateString('en-US', { month: 'long' })}
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-[10px]">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="font-semibold opacity-50">{d}</div>)}
        {cells.map((d, i) => (
          <div key={i} className="flex items-center justify-center h-[18px]">
            {d && (
              <span className={`w-[18px] h-[18px] leading-[18px] rounded-full font-medium ${d === now.getDate() ? 'bg-[#ff3b30] text-white' : (i % 7 === 0 || i % 7 === 6) ? 'opacity-50' : ''}`}>
                {d}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotificationCenter({ onOpen, focusOn }: { onOpen: (id: string) => void; focusOn: boolean }) {
  return (
    <div className="absolute top-9 right-2 z-[60] w-[344px] space-y-2.5 animate-slide-in-right" onClick={(e) => e.stopPropagation()}>
      {focusOn ? (
        <div className="mac-panel !rounded-[18px] px-4 py-3 text-[13px] opacity-80">Do Not Disturb is on — notifications are silenced.</div>
      ) : (
        <>
          <button type="button" onClick={() => onOpen('testimonials')} className="mac-panel !rounded-[18px] p-3 flex gap-2.5 w-full text-left">
            <MessagesIcon size={34} />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-[13px]"><span className="font-semibold">Messages</span><span className="opacity-45 text-[11px]">now</span></div>
              <div className="text-[13px] font-semibold">Recommendations</div>
              <div className="text-[13px] opacity-75 leading-snug">5 people shared what it’s like working with me. Tap to read.</div>
            </div>
          </button>
          <button type="button" onClick={() => onOpen('contact')} className="mac-panel !rounded-[18px] p-3 flex gap-2.5 w-full text-left">
            <MailIcon size={34} />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between text-[13px]"><span className="font-semibold">Mail</span><span className="opacity-45 text-[11px]">2m ago</span></div>
              <div className="text-[13px] font-semibold">Available for new projects</div>
              <div className="text-[13px] opacity-75 leading-snug">Open to full-time, part-time and freelance work.</div>
            </div>
          </button>
        </>
      )}
      <div className="grid grid-cols-2 gap-2.5">
        <CalendarWidget />
        <div className="mac-panel !rounded-[20px] p-3.5 flex flex-col">
          <div className="text-[11px] font-bold text-[#ff3b30] uppercase tracking-wide">Up Next</div>
          <div className="mt-2 flex gap-2">
            <span className="w-[3px] rounded-full bg-[#34c759]" />
            <div>
              <div className="text-[12px] font-semibold leading-tight">Open to opportunities</div>
              <div className="text-[11px] opacity-55">All day</div>
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <span className="w-[3px] rounded-full bg-[#007aff]" />
            <div>
              <div className="text-[12px] font-semibold leading-tight">Building with Next.js</div>
              <div className="text-[11px] opacity-55">Every day</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Banner that slides in from the top-right, like a macOS notification. */
export function NotificationBanner({ onOpen, onDismiss }: { onOpen: () => void; onDismiss: () => void }) {
  return (
    <div className="absolute top-9 right-2 z-[58] w-[344px] animate-slide-in-right group" onClick={(e) => e.stopPropagation()}>
      <button type="button" onClick={onOpen} className="mac-panel !rounded-[18px] p-3 flex gap-2.5 w-full text-left">
        <APPS.finder.Icon size={34} />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-[13px]"><span className="font-semibold">Welcome to my portfolio</span><span className="opacity-45 text-[11px]">now</span></div>
          <div className="text-[13px] opacity-80 leading-snug">Double-click a folder on the desktop, or press ⌘ Space to search.</div>
        </div>
      </button>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={onDismiss}
        className="absolute -top-1.5 -left-1.5 w-5 h-5 mac-panel !rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center"
      >
        <svg viewBox="0 0 8 8" width="7" height="7" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round"><path d="M1.5 1.5 L6.5 6.5 M6.5 1.5 L1.5 6.5" /></svg>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Launchpad                                                           */
/* ------------------------------------------------------------------ */

export function Launchpad({ onClose, onOpen }: { onClose: () => void; onOpen: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const apps = Object.values(APPS).filter(a => a.id !== 'trash' && a.id !== 'launchpad' && a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="absolute inset-0 z-[55] bg-black/25 backdrop-blur-[40px] animate-launchpad-in" onClick={onClose}>
      <div className="flex justify-center pt-12" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1.5 w-[240px] h-7 px-2.5 rounded-lg bg-white/15 text-white shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.25)]">
          <SearchGlyph size={12} className="opacity-70" />
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search"
            onKeyDown={(e) => e.key === 'Escape' && onClose()}
            className="bg-transparent outline-none text-[13px] w-full placeholder:text-white/60" />
        </div>
      </div>
      <div className="max-w-[1000px] mx-auto mt-14 px-8 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-y-12 justify-items-center">
        {apps.map(app => (
          <button key={app.id} type="button" className="flex flex-col items-center gap-2 w-[110px] group"
            onClick={(e) => { e.stopPropagation(); onOpen(app.id); onClose(); }}>
            <span className="transition-transform group-active:scale-90" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}>
              <app.Icon size={84} />
            </span>
            <span className="text-white text-[13px] font-medium text-center leading-tight" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>{app.label}</span>
          </button>
        ))}
      </div>
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2">
        <span className="w-[7px] h-[7px] rounded-full bg-white" />
        <span className="w-[7px] h-[7px] rounded-full bg-white/35" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Context menus                                                       */
/* ------------------------------------------------------------------ */

const TAG_COLORS = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#007aff', '#af52de', '#8e8e93'];

export function ContextMenu({
  x, y, target, kind, isRunning, onOpen, onQuit, onClose, onChangeWallpaper, onShowInFinder,
}: {
  x: number; y: number; target: string | null; kind: 'desktop' | 'icon' | 'dock';
  isRunning: boolean;
  onOpen: () => void; onQuit: () => void; onClose: () => void; onChangeWallpaper: () => void; onShowInFinder: () => void;
}) {
  const run = (fn: () => void) => () => { fn(); onClose(); };
  const left = Math.min(x, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 250);
  const top = Math.min(y, (typeof window !== 'undefined' ? window.innerHeight : 800) - 300);

  return (
    <div className="absolute z-[62] mac-menu min-w-[220px] animate-fade-in" style={{ left, top }} onClick={(e) => e.stopPropagation()}>
      {kind === 'desktop' && (
        <>
          <MenuItem disabled>New Folder</MenuItem>
          <MenuSeparator />
          <MenuItem onClick={run(onShowInFinder)}>Get Info</MenuItem>
          <MenuSeparator />
          <MenuItem onClick={run(onChangeWallpaper)}>Change Wallpaper…</MenuItem>
          <MenuItem disabled>Use Stacks</MenuItem>
          <MenuItem disabled>Sort By</MenuItem>
          <MenuItem disabled>Clean Up</MenuItem>
          <MenuItem disabled>Show View Options</MenuItem>
        </>
      )}
      {kind === 'icon' && target && (
        <>
          <MenuItem onClick={run(onOpen)}>Open</MenuItem>
          <MenuSeparator />
          <MenuItem shortcut="⌘⌫" disabled>Move to Trash</MenuItem>
          <MenuSeparator />
          <MenuItem shortcut="⌘I" onClick={run(onOpen)}>Get Info</MenuItem>
          <MenuItem disabled>Rename</MenuItem>
          <MenuItem disabled>Compress “{APPS[target]?.label}”</MenuItem>
          <MenuItem disabled>Duplicate</MenuItem>
          <MenuItem onClick={run(onOpen)}>Quick Look “{APPS[target]?.label}”</MenuItem>
          <MenuSeparator />
          <MenuItem disabled>Copy</MenuItem>
          <MenuSeparator />
          <div className="flex items-center gap-[7px] px-[9px] py-1">
            {TAG_COLORS.map(c => <span key={c} className="w-3 h-3 rounded-full" style={{ background: c, boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.2)' }} />)}
          </div>
          <MenuItem disabled>Tags…</MenuItem>
        </>
      )}
      {kind === 'dock' && target && (
        <>
          <MenuItem onClick={run(onShowInFinder)}>Show in Finder</MenuItem>
          <MenuSeparator />
          {isRunning ? <MenuItem onClick={run(onQuit)}>Quit</MenuItem> : <MenuItem onClick={run(onOpen)}>Open</MenuItem>}
        </>
      )}
    </div>
  );
}
