'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  IoImages, IoHeart, IoHeartOutline, IoRibbon, IoMedal, IoDocumentText, IoChevronBack, IoChevronForward,
  IoOpenOutline, IoInformationCircleOutline, IoAdd, IoRemove, IoSquareOutline, IoExpandOutline,
} from 'react-icons/io5';
import { WindowLayout } from '../MacWindow';
import { SidebarItem, SidebarSection, ToolbarButton } from '../ui/mac';
import { PHOTOS, Photo, PhotoAlbum } from '../photos-data';

type View = 'library' | 'favorites' | PhotoAlbum;

const VIEW_TITLES: Record<View, string> = {
  library: 'Library',
  favorites: 'Favorites',
  certificates: 'Certificates',
  badges: 'Badges',
  documents: 'Documents',
};

const ALBUM_LABEL: Record<PhotoAlbum, string> = { certificates: 'Certificate', badges: 'Badge', documents: 'Document' };

// Featured until the viewer picks their own favorites.
const DEFAULT_FAVORITES = ['73-alx-aice-ai-career-essentials-certificate-mugisha-pacifique', '1', 'c-advanced'];
const FAVORITES_KEY = 'photos-favorites';

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // storage unavailable (private mode, blocked) — fall back to defaults
  }
  return DEFAULT_FAVORITES;
}

function monthLabel(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function longDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export default function Photos() {
  const [view, setView] = useState<View>('library');
  const [columns, setColumns] = useState(6);
  const [squareCrop, setSquareCrop] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [viewing, setViewing] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(loadFavorites);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      try { localStorage.setItem(FAVORITES_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const photos = useMemo(() => {
    if (view === 'library') return PHOTOS;
    if (view === 'favorites') return PHOTOS.filter(p => favorites.includes(p.id));
    return PHOTOS.filter(p => p.album === view);
  }, [view, favorites]);

  // Month sections, like "All Photos" in the Photos app
  const groups = useMemo(() => {
    const map = new Map<string, Photo[]>();
    photos.forEach(p => {
      const key = monthLabel(p.date);
      map.set(key, [...(map.get(key) ?? []), p]);
    });
    return [...map.entries()];
  }, [photos]);

  const current = viewing !== null ? photos[viewing] : null;

  const go = (delta: number) => setViewing(v => (v === null ? v : Math.min(photos.length - 1, Math.max(0, v + delta))));

  // Arrow keys move between photos in the viewer, Escape returns to the grid
  useEffect(() => {
    if (viewing === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'Escape') setViewing(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const switchView = (v: View) => {
    setView(v);
    setViewing(null);
    setSelected(null);
  };

  const count = (v: View) =>
    v === 'library' ? PHOTOS.length : v === 'favorites' ? favorites.length : PHOTOS.filter(p => p.album === v).length;

  const sidebar = (
    <>
      <SidebarSection title="Photos">
        <SidebarItem icon={<IoImages />} label="Library" badge={count('library')} active={view === 'library'} onClick={() => switchView('library')} />
        <SidebarItem icon={<IoHeart />} label="Favorites" badge={count('favorites')} active={view === 'favorites'} onClick={() => switchView('favorites')} />
      </SidebarSection>
      <SidebarSection title="Albums">
        <SidebarItem icon={<IoRibbon />} label="Certificates" badge={count('certificates')} active={view === 'certificates'} onClick={() => switchView('certificates')} />
        <SidebarItem icon={<IoMedal />} label="Badges" badge={count('badges')} active={view === 'badges'} onClick={() => switchView('badges')} />
        <SidebarItem icon={<IoDocumentText />} label="Documents" badge={count('documents')} active={view === 'documents'} onClick={() => switchView('documents')} />
      </SidebarSection>
    </>
  );

  const gridToolbar = (
    <>
      <ToolbarButton title={squareCrop ? 'Show whole photos' : 'Show square photos'} onClick={() => setSquareCrop(s => !s)}>
        {squareCrop ? <IoExpandOutline className="text-[15px]" /> : <IoSquareOutline className="text-[15px]" />}
      </ToolbarButton>
      <div className="flex items-center gap-1.5 ml-1">
        <button type="button" title="Smaller" onClick={() => setColumns(c => Math.min(10, c + 1))} className="text-black/55 dark:text-white/60 hover:text-black dark:hover:text-white"><IoRemove /></button>
        <input
          type="range" min={2} max={10} step={1}
          value={12 - columns}
          onChange={(e) => setColumns(12 - Number(e.target.value))}
          aria-label="Zoom"
          className="w-24 h-1 rounded-full cursor-pointer"
          style={{ background: `linear-gradient(to right, var(--mac-blue) ${((12 - columns - 2) / 8) * 100}%, rgba(120,120,128,0.3) ${((12 - columns - 2) / 8) * 100}%)` }}
        />
        <button type="button" title="Larger" onClick={() => setColumns(c => Math.max(2, c - 1))} className="text-black/55 dark:text-white/60 hover:text-black dark:hover:text-white"><IoAdd /></button>
      </div>
    </>
  );

  const viewerToolbar = current && (
    <>
      <ToolbarButton title="Previous" onClick={() => go(-1)}><IoChevronBack className={viewing === 0 ? 'opacity-30' : ''} /></ToolbarButton>
      <ToolbarButton title="Next" onClick={() => go(1)}><IoChevronForward className={viewing === photos.length - 1 ? 'opacity-30' : ''} /></ToolbarButton>
      <div className="w-2" />
      <ToolbarButton title={favorites.includes(current.id) ? 'Unfavorite' : 'Favorite'} onClick={() => toggleFavorite(current.id)}>
        {favorites.includes(current.id) ? <IoHeart className="text-[16px] text-[#ff2d55]" /> : <IoHeartOutline className="text-[16px]" />}
      </ToolbarButton>
      <ToolbarButton title="Info" active={showInfo} onClick={() => setShowInfo(s => !s)}><IoInformationCircleOutline className="text-[17px]" /></ToolbarButton>
      <ToolbarButton title="Open Original" onClick={() => window.open(current.src, '_blank', 'noopener')}><IoOpenOutline className="text-[15px]" /></ToolbarButton>
    </>
  );

  return (
    <WindowLayout
      title={current ? current.title : VIEW_TITLES[view]}
      subtitle={current ? longDate(current.date) : `${photos.length} ${photos.length === 1 ? 'item' : 'items'}`}
      sidebar={sidebar}
      sidebarWidth={200}
      toolbar={current ? viewerToolbar : gridToolbar}
    >
      {current ? (
        /* ---------------- Single photo viewer ---------------- */
        <div className="flex h-full">
          <div className="relative flex-1 bg-(--content-bg)" onDoubleClick={() => setViewing(null)}>
            <button type="button" onClick={() => setViewing(null)}
              className="absolute top-3 left-3 z-10 flex items-center gap-1 h-7 pl-1.5 pr-2.5 rounded-full text-[12px] mac-panel">
              <IoChevronBack /> {VIEW_TITLES[view]}
            </button>
            <Image
              key={current.id}
              src={current.src}
              alt={current.title}
              fill
              sizes="(max-width: 1200px) 80vw, 900px"
              className="object-contain p-6 animate-fade-in"
              priority
            />
            {viewing! > 0 && (
              <button type="button" aria-label="Previous photo" onClick={() => go(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full mac-panel flex items-center justify-center opacity-80 hover:opacity-100">
                <IoChevronBack />
              </button>
            )}
            {viewing! < photos.length - 1 && (
              <button type="button" aria-label="Next photo" onClick={() => go(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full mac-panel flex items-center justify-center opacity-80 hover:opacity-100">
                <IoChevronForward />
              </button>
            )}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full mac-panel text-[11px] tabular-nums">
              {viewing! + 1} of {photos.length}
            </div>
          </div>
          {showInfo && (
            <aside className="w-57.5 shrink-0 border-l border-(--hairline) p-4 text-[12px] space-y-3 overflow-y-auto mac-scroll">
              <div>
                <div className="text-[13px] font-semibold leading-snug">{current.title}</div>
                <div className="text-black/50 dark:text-white/50 mt-0.5">{ALBUM_LABEL[current.album]}</div>
              </div>
              <div className="h-px bg-(--hairline)" />
              {[
                ['Date', longDate(current.date)],
                ['Dimensions', `${current.width} × ${current.height}`],
                ['Album', VIEW_TITLES[current.album]],
                ['Favorite', favorites.includes(current.id) ? 'Yes' : 'No'],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[72px_1fr] gap-2">
                  <span className="text-black/45 dark:text-white/45">{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </aside>
          )}
        </div>
      ) : photos.length === 0 ? (
        /* ---------------- Empty album ---------------- */
        <div className="h-full flex flex-col items-center justify-center text-center gap-2 px-8">
          <IoHeartOutline className="text-[40px] text-black/25 dark:text-white/25" />
          <div className="text-[15px] font-semibold">No Favorites</div>
          <div className="text-[12px] text-black/50 dark:text-white/50 max-w-65">Open a photo and click the heart to add it to your Favorites.</div>
        </div>
      ) : (
        /* ---------------- Grid ---------------- */
        <div className="pb-4" onClick={() => setSelected(null)}>
          {groups.map(([month, items]) => (
            <section key={month}>
              <div className="sticky top-0 z-10 px-4 pt-3 pb-2 bg-(--toolbar-bg) backdrop-blur-xl flex items-baseline gap-2">
                <h3 className="text-[15px] font-bold">{month}</h3>
                <span className="text-[11px] text-black/45 dark:text-white/45">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
              </div>
              <div className="grid gap-0.5 px-0.5" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
                {items.map(p => {
                  const index = photos.indexOf(p);
                  const isSelected = selected === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      title={p.title}
                      onClick={(e) => { e.stopPropagation(); setSelected(p.id); }}
                      onDoubleClick={() => setViewing(index)}
                      className="relative aspect-square overflow-hidden bg-black/4 dark:bg-white/5 outline-none group"
                    >
                      <Image
                        src={p.src}
                        alt={p.title}
                        fill
                        sizes={`${Math.ceil(100 / columns) + 5}vw`}
                        className={`${squareCrop ? 'object-cover' : 'object-contain p-1'} transition-transform duration-300 group-hover:scale-[1.03]`}
                      />
                      {favorites.includes(p.id) && (
                        <IoHeart className="absolute bottom-1.5 left-1.5 text-[13px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                      )}
                      {isSelected && <span className="absolute inset-0 ring-[3px] ring-inset ring-macblue" />}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
          <div className="text-center text-[11px] text-black/45 dark:text-white/45 pt-4">
            {photos.length} {photos.length === 1 ? 'Photo' : 'Photos'} · Double-click a photo to open it
          </div>
        </div>
      )}
    </WindowLayout>
  );
}
