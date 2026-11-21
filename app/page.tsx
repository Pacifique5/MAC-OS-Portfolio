'use client';
import { useEffect, useState } from 'react';
import MacWindow from './components/MacWindow';
import MenuBar, { OpenMenu, MenuActions } from './components/MenuBar';
import Dock from './components/Dock';
import { Spotlight, NotificationCenter, NotificationBanner, Launchpad, ContextMenu } from './components/SystemOverlays';
import { FolderIcon } from './components/icons/AppIcons';
import { APPS, SECTION_IDS, WINDOW_TITLES, WindowId } from './components/apps';
import { useSystem } from './components/useSystem';
import Finder from './components/sections/Finder';
import Photos from './components/sections/Photos';
import Terminal from './components/sections/Terminal';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Experience from './components/sections/Experience';
import Testimonials from './components/sections/Testimonials';
import Contact from './components/sections/Contact';

const ALL_WINDOWS: WindowId[] = ['finder', 'photos', 'terminal', ...SECTION_IDS];

// `tone` tells the menu bar and desktop labels whether to use dark or light text,
// the same way macOS adapts the menu bar to the wallpaper.
type Tone = 'light' | 'dark';
const WALLPAPERS: { name: string; background: string; tone: Tone }[] = [
  { name: 'Quote Desk', background: 'url(/kk.webp) center / cover no-repeat, #e8ebe9', tone: 'light' },
  { name: 'Dusk', background: 'radial-gradient(120% 90% at 85% 110%, #ff8a5c 0%, rgba(255,138,92,0) 55%), radial-gradient(90% 80% at 8% 100%, #c2389b 0%, rgba(194,56,155,0) 60%), radial-gradient(100% 90% at 50% -10%, #2b2f8f 0%, rgba(43,47,143,0) 70%), linear-gradient(160deg, #141a4a 0%, #4a2b8c 45%, #b8437e 75%, #f08a5d 100%)', tone: 'dark' },
  { name: 'Ocean', background: 'radial-gradient(100% 80% at 80% 100%, #3ad1c6 0%, rgba(58,209,198,0) 60%), radial-gradient(90% 70% at 0% 0%, #1b3a8f 0%, rgba(27,58,143,0) 70%), linear-gradient(165deg, #0b1d4a 0%, #13478f 45%, #1f8fb0 75%, #5fd3c4 100%)', tone: 'dark' },
];

type Ctx = { x: number; y: number; target: string | null; kind: 'desktop' | 'icon' | 'dock' };

export default function Home() {
  const sys = useSystem();

  // Window manager: `order` is the z-order (last = front-most)
  const [order, setOrder] = useState<WindowId[]>([]);
  const [minimized, setMinimized] = useState<WindowId[]>([]);

  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<OpenMenu | null>(null);
  const [contextMenu, setContextMenu] = useState<Ctx | null>(null);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [launchpadOpen, setLaunchpadOpen] = useState(false);
  const [bouncing, setBouncing] = useState<string | null>(null);
  const [sleeping, setSleeping] = useState(false);
  const [wallpaper, setWallpaper] = useState(0);
  const [banner, setBanner] = useState(false);
  const [zoomed, setZoomed] = useState<WindowId[]>([]);
  const [hud, setHud] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const tone = WALLPAPERS[wallpaper].tone;
  const visible = order.filter(id => !minimized.includes(id));
  const activeWindow = visible[visible.length - 1] ?? null;
  const appName = activeWindow ? WINDOW_TITLES[activeWindow] : 'Finder';

  /* ---------------- window actions ---------------- */
  const focusWindow = (id: WindowId) => setOrder(o => (o[o.length - 1] === id ? o : [...o.filter(w => w !== id), id]));
  const openWindow = (id: WindowId) => {
    setMinimized(m => m.filter(w => w !== id));
    focusWindow(id);
  };
  const closeWindow = (id: WindowId) => {
    setOrder(o => o.filter(w => w !== id));
    setMinimized(m => m.filter(w => w !== id));
  };
  const minimizeWindow = (id: WindowId) => setMinimized(m => (m.includes(id) ? m : [...m, id]));
  const toggleZoom = (id: WindowId) => setZoomed(z => (z.includes(id) ? z.filter(w => w !== id) : [...z, id]));

  /** macOS-style centered confirmation (like the volume/brightness HUD). */
  const showHud = (message: string) => {
    setHud(message);
    setTimeout(() => setHud(h => (h === message ? null : h)), 1600);
  };
  const copy = (text: string, confirmation: string) => {
    navigator.clipboard?.writeText(text).then(() => showHud(confirmation), () => showHud('Couldn’t access the clipboard'));
  };
  const linkFor = (id: string) => {
    const a = APPS[id]?.action;
    return a?.type === 'link' ? a.href : `${window.location.origin}/#${id}`;
  };

  const bounce = (id: string) => {
    setBouncing(id);
    setTimeout(() => setBouncing(b => (b === id ? null : b)), 900);
  };

  const closeOverlays = () => {
    setOpenMenu(null);
    setContextMenu(null);
    setNotificationsOpen(false);
  };

  const launch = (id: string) => {
    const app = APPS[id];
    if (!app) return;
    closeOverlays();
    switch (app.action.type) {
      case 'window':
        if (!order.includes(app.action.window)) bounce(id);
        openWindow(app.action.window);
        break;
      case 'link':
        bounce(id);
        window.open(app.action.href, '_blank', 'noopener,noreferrer');
        break;
      case 'launchpad':
        setLaunchpadOpen(v => !v);
        break;
      case 'controlcenter':
        setOpenMenu({ id: 'controlcenter', side: 'right', x: 8 });
        break;
      case 'notifications':
        setNotificationsOpen(true);
        break;
      default:
        bounce(id);
    }
  };

  const actions: MenuActions = {
    openWindow,
    restoreWindow: openWindow,
    closeActive: () => activeWindow && closeWindow(activeWindow),
    minimizeActive: () => activeWindow && minimizeWindow(activeWindow),
    closeAll: () => { setOrder([]); setMinimized([]); },
    bringAllToFront: () => setMinimized([]),
    openSpotlight: () => setSpotlightOpen(true),
    openLaunchpad: () => setLaunchpadOpen(true),
    sleep: () => setSleeping(true),
    openSelected: () => selectedIcon && launch(selectedIcon),
    zoomActive: () => activeWindow && toggleZoom(activeWindow),
    copy,
    setWallpaper,
    wallpapers: WALLPAPERS.map(w => w.name),
    wallpaper,
    fullscreen,
    selectedLabel: selectedIcon ? APPS[selectedIcon]?.label ?? null : null,
    windows: order,
    activeWindow,
  };

  /* ---------------- keyboard ---------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
        e.preventDefault();
        setSpotlightOpen(v => !v);
      }
      if (e.key === 'Escape') {
        setSpotlightOpen(false);
        setLaunchpadOpen(false);
        setOpenMenu(null);
        setContextMenu(null);
        setNotificationsOpen(false);
      }
    };
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFullscreen);
    };
  }, []);

  /* ---------------- welcome banner ---------------- */
  useEffect(() => {
    const show = setTimeout(() => setBanner(true), 1500);
    const hide = setTimeout(() => setBanner(false), 9000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);

  const renderSection = (id: WindowId) => {
    switch (id) {
      case 'finder': return <Finder onOpen={launch} />;
      case 'photos': return <Photos />;
      case 'terminal': return <Terminal onOpen={launch} onClose={() => closeWindow('terminal')} />;
      case 'about': return <About onOpen={launch} />;
      case 'projects': return <Projects />;
      case 'skills': return <Skills />;
      case 'experience': return <Experience />;
      case 'testimonials': return <Testimonials />;
      case 'contact': return <Contact />;
    }
  };

  const ctxRunning = (() => {
    const a = contextMenu?.target ? APPS[contextMenu.target]?.action : undefined;
    return a?.type === 'window' && order.includes(a.window);
  })();

  return (
    <div
      className="relative w-full h-screen overflow-hidden select-none"
      onClick={() => { setSelectedIcon(null); closeOverlays(); }}
      onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, target: null, kind: 'desktop' }); }}
    >
      {/* Wallpaper */}
      <div className="absolute inset-0" style={{ background: WALLPAPERS[wallpaper].background }} />

      <MenuBar
        tone={tone}
        appName={appName}
        openMenu={openMenu}
        setOpenMenu={(m) => { setContextMenu(null); setNotificationsOpen(false); setOpenMenu(m); }}
        sys={sys}
        actions={actions}
        notificationsOpen={notificationsOpen}
        onToggleNotifications={() => setNotificationsOpen(v => !v)}
      />

      {/* Desktop icons — macOS stacks them from the top-right */}
      <div
        className="absolute top-9 right-3 bottom-22 z-10 grid grid-flow-col auto-cols-[96px] grid-rows-[repeat(auto-fill,96px)] gap-x-1"
        style={{ direction: 'rtl' }}
      >
        {SECTION_IDS.map(id => {
          const app = APPS[id];
          const sel = selectedIcon === id;
          return (
            <button
              key={id}
              type="button"
              style={{ direction: 'ltr' }}
              className="flex flex-col items-center gap-1 pt-1 outline-none"
              onClick={(e) => { e.stopPropagation(); closeOverlays(); setSelectedIcon(id); }}
              onDoubleClick={() => launch(id)}
              onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedIcon(id); setContextMenu({ x: e.clientX, y: e.clientY, target: id, kind: 'icon' }); }}
            >
              <span className={`p-0.75 rounded-md ${sel ? (tone === 'light' ? 'bg-black/10 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]' : 'bg-black/25 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]') : ''}`}>
                <FolderIcon size={64} Glyph={app.folderGlyph} />
              </span>
              <span
                className={`text-[12px] font-medium leading-tight px-1.25 py-px rounded-sm ${sel ? 'bg-[#0a5fd6] text-white' : tone === 'light' ? 'text-[#1d1d1f]' : 'text-white'}`}
                style={sel ? undefined : tone === 'light'
                  ? { textShadow: '0 0 4px rgba(255,255,255,0.9), 0 1px 1px rgba(255,255,255,0.8)' }
                  : { textShadow: '0 1px 2px rgba(0,0,0,0.75), 0 0 6px rgba(0,0,0,0.35)' }}
              >
                {app.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Windows — rendered in a stable order, stacked by z-index; minimized windows stay mounted */}
      {ALL_WINDOWS.filter(id => order.includes(id)).map(id => (
        <div key={id} style={{ display: minimized.includes(id) ? 'none' : 'contents' }}>
          <MacWindow
            zIndex={20 + order.indexOf(id)}
            active={id === activeWindow}
            initialOffset={ALL_WINDOWS.indexOf(id)}
            onFocus={() => focusWindow(id)}
            onClose={() => closeWindow(id)}
            onMinimize={() => minimizeWindow(id)}
            zoomed={zoomed.includes(id)}
            onToggleZoom={() => toggleZoom(id)}
          >
            {renderSection(id)}
          </MacWindow>
        </div>
      ))}

      <Dock
        running={order}
        minimized={minimized}
        bouncing={bouncing}
        onAppClick={launch}
        onRestore={openWindow}
        onContextMenu={(e, id) => { e.preventDefault(); e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY - 10, target: id, kind: 'dock' }); }}
      />

      {contextMenu && (
        <ContextMenu
          {...contextMenu}
          isRunning={ctxRunning}
          onOpen={() => contextMenu.target && launch(contextMenu.target)}
          onQuit={() => {
            const a = contextMenu.target ? APPS[contextMenu.target]?.action : undefined;
            if (a?.type === 'window') closeWindow(a.window);
          }}
          onClose={() => setContextMenu(null)}
          onChangeWallpaper={() => setWallpaper(w => (w + 1) % WALLPAPERS.length)}
          onShowInFinder={() => openWindow('finder')}
          onCopyLink={() => contextMenu.target && copy(linkFor(contextMenu.target), 'Link copied')}
          onLaunchpad={() => setLaunchpadOpen(true)}
          onSpotlight={() => setSpotlightOpen(true)}
          onCloseAll={() => { setOrder([]); setMinimized([]); }}
          hasWindows={order.length > 0}
        />
      )}

      {/* Confirmation HUD */}
      {hud && (
        <div className="absolute inset-0 z-80 flex items-center justify-center pointer-events-none">
          <div className="mac-panel rounded-[18px]! px-6 py-4 flex flex-col items-center gap-2 animate-scale-in">
            <svg viewBox="0 0 14 14" width="34" height="34" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 7.5 L5.6 10.5 L11.5 3.5" /></svg>
            <span className="text-[13px] font-medium">{hud}</span>
          </div>
        </div>
      )}

      {notificationsOpen && <NotificationCenter focusOn={sys.focusOn} onOpen={(id) => { setNotificationsOpen(false); launch(id); }} />}
      {banner && !notificationsOpen && !openMenu && !sys.focusOn && (
        <NotificationBanner onOpen={() => { setBanner(false); openWindow('finder'); }} onDismiss={() => setBanner(false)} />
      )}
      {launchpadOpen && <Launchpad onClose={() => setLaunchpadOpen(false)} onOpen={launch} />}
      {spotlightOpen && <Spotlight onClose={() => setSpotlightOpen(false)} onOpen={launch} />}

      {/* Display brightness */}
      <div className="absolute inset-0 bg-black pointer-events-none z-90" style={{ opacity: ((100 - sys.brightness) / 100) * 0.85 }} />

      {/* Sleep / lock */}
      {sleeping && (
        <div className="absolute inset-0 z-100 bg-black animate-fade-in flex items-end justify-center pb-16 cursor-pointer" onClick={(e) => { e.stopPropagation(); setSleeping(false); }}>
          <span className="text-white/30 text-[13px]">Click anywhere to wake</span>
        </div>
      )}
    </div>
  );
}
