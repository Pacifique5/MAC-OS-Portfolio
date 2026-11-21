'use client';
import { ReactNode, useEffect, useState } from 'react';
import { FaApple } from 'react-icons/fa';
import { MenuItem, MenuSeparator, Toggle, CCSlider, CircleIcon } from './ui/mac';
import {
  WifiGlyph, WifiOffGlyph, BluetoothGlyph, SpeakerGlyph, BatteryGlyph, ControlCenterGlyph, SearchGlyph,
  LockGlyph, MoonGlyph, Spinner, LaptopGlyph, HeadphonesGlyph, DisplayGlyph, CheckGlyph,
} from './icons/SystemIcons';
import ControlCenter from './ControlCenter';
import { APPS, SECTION_IDS, WINDOW_TITLES, WindowId } from './apps';
import { SystemState, WIFI_NETWORKS, OUTPUT_DEVICES, volumeLevel } from './useSystem';

export type OpenMenu = { id: string; x: number; side: 'left' | 'right' };

export interface MenuActions {
  openWindow: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  closeActive: () => void;
  minimizeActive: () => void;
  closeAll: () => void;
  bringAllToFront: () => void;
  openSpotlight: () => void;
  openLaunchpad: () => void;
  sleep: () => void;
  openSelected: () => void;
  zoomActive: () => void;
  /** Copy text to the clipboard and show a confirmation */
  copy: (text: string, confirmation: string) => void;
  setWallpaper: (index: number) => void;
  wallpapers: string[];
  wallpaper: number;
  fullscreen: boolean;
  selectedLabel: string | null;
  windows: WindowId[];
  activeWindow: WindowId | null;
}

interface MenuBarProps {
  /** Wallpaper brightness: light wallpapers get a dark menu bar text, like macOS. */
  tone: 'light' | 'dark';
  appName: string;
  openMenu: OpenMenu | null;
  setOpenMenu: (m: OpenMenu | null) => void;
  sys: SystemState;
  actions: MenuActions;
  notificationsOpen: boolean;
  onToggleNotifications: () => void;
}

const LEFT_MENUS = ['apple', 'app', 'file', 'edit', 'view', 'go', 'window', 'help'] as const;

function formatClock(d: Date) {
  const day = d.toLocaleDateString('en-US', { weekday: 'short' });
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${day} ${date} ${time}`;
}

export default function MenuBar({ tone, appName, openMenu, setOpenMenu, sys, actions, notificationsOpen, onToggleNotifications }: MenuBarProps) {
  const [clock, setClock] = useState('');
  const [helpQuery, setHelpQuery] = useState('');

  useEffect(() => {
    const tick = () => setClock(formatClock(new Date()));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const toggle = (id: string, side: 'left' | 'right') => (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (openMenu?.id === id) return setOpenMenu(null);
    const r = e.currentTarget.getBoundingClientRect();
    setOpenMenu({ id, side, x: side === 'left' ? r.left : window.innerWidth - r.right });
  };

  // macOS: once a menu is open, hovering another title switches to it
  const hoverSwitch = (id: string) => (e: React.MouseEvent<HTMLElement>) => {
    if (!openMenu || openMenu.side !== 'left' || openMenu.id === id) return;
    const r = e.currentTarget.getBoundingClientRect();
    setOpenMenu({ id, side: 'left', x: r.left });
  };

  const run = (fn: () => void) => () => { fn(); setOpenMenu(null); };

  const light = tone === 'light';
  const pressed = light ? 'bg-black/15' : 'bg-white/25';
  const hover = light ? 'hover:bg-black/[0.07]' : 'hover:bg-white/10';
  const titleCls = (id: string) =>
    `h-5.5 px-2.25 rounded-sm flex items-center transition-colors ${openMenu?.id === id ? pressed : hover}`;
  const statusCls = (id: string) =>
    `h-5.5 px-1.75 rounded-sm flex items-center gap-1.5 transition-colors ${openMenu?.id === id ? pressed : hover}`;

  const labels: Record<(typeof LEFT_MENUS)[number], ReactNode> = {
    apple: <FaApple className="text-[15px] -mt-px" />,
    app: <span className="font-bold">{appName}</span>,
    file: 'File', edit: 'Edit', view: 'View', go: 'Go', window: 'Window', help: 'Help',
  };

  return (
    <>
      <div
        className={`absolute top-0 inset-x-0 h-7 z-60 flex items-center justify-between px-2 text-[13px] backdrop-blur-2xl select-none transition-colors ${
          light ? 'text-black/85 bg-white/35' : 'text-white bg-black/25'
        }`}
        style={{ textShadow: light ? 'none' : '0 0 6px rgba(0,0,0,0.25)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center">
          {LEFT_MENUS.map(id => (
            <button key={id} type="button" className={titleCls(id)} onClick={toggle(id, 'left')} onMouseEnter={hoverSwitch(id)}>
              {labels[id]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-0.5">
          {sys.focusOn && <span className="h-5.5 px-1.75 flex items-center" title="Do Not Disturb"><MoonGlyph size={13} /></span>}
          <button type="button" className={statusCls('bluetooth')} onClick={toggle('bluetooth', 'right')} aria-label="Bluetooth">
            <BluetoothGlyph size={14} className={sys.btOn && sys.btSupported ? '' : 'opacity-50'} />
          </button>
          <button type="button" className={statusCls('sound')} onClick={toggle('sound', 'right')} aria-label="Sound">
            <SpeakerGlyph size={13} level={volumeLevel(sys.volume)} />
          </button>
          <button type="button" className={statusCls('battery')} onClick={toggle('battery', 'right')} aria-label="Battery">
            <span className="text-[12px]">{sys.battery.level}%</span>
            <BatteryGlyph size={12} level={sys.battery.level} charging={sys.battery.charging} />
          </button>
          <button type="button" className={statusCls('wifi')} onClick={toggle('wifi', 'right')} aria-label="Wi-Fi">
            {sys.wifiOn ? <WifiGlyph size={13} strength={sys.connectedNetwork ? (WIFI_NETWORKS.find(n => n.name === sys.connectedNetwork)?.signal ?? 3) : 0} /> : <WifiOffGlyph size={13} />}
          </button>
          <button type="button" className={statusCls('spotlight')} onClick={(e) => { e.stopPropagation(); setOpenMenu(null); actions.openSpotlight(); }} aria-label="Spotlight">
            <SearchGlyph size={13} />
          </button>
          <button type="button" className={statusCls('controlcenter')} onClick={toggle('controlcenter', 'right')} aria-label="Control Center">
            <ControlCenterGlyph size={13} />
          </button>
          <button type="button" className={`h-5.5 px-1.75 rounded-sm transition-colors ${notificationsOpen ? pressed : hover}`}
            onClick={(e) => { e.stopPropagation(); setOpenMenu(null); onToggleNotifications(); }}>
            <span suppressHydrationWarning>{clock}</span>
          </button>
        </div>
      </div>

      {openMenu && (
        <div
          className="absolute top-6.75 z-61 animate-fade-in"
          style={openMenu.side === 'left' ? { left: openMenu.x } : { right: openMenu.id === 'controlcenter' ? 8 : Math.max(6, openMenu.x) }}
          onClick={(e) => e.stopPropagation()}
        >
          {openMenu.id === 'controlcenter' ? (
            <ControlCenter sys={sys} />
          ) : (
            <div className={`mac-menu ${openMenu.side === 'right' ? 'w-71' : 'min-w-57.5'}`}>
              {renderMenu(openMenu.id)}
            </div>
          )}
        </div>
      )}
    </>
  );

  function renderMenu(id: string) {
    switch (id) {
      case 'apple':
        return (
          <>
            <MenuItem onClick={run(() => actions.openWindow('about'))}>About This Mac</MenuItem>
            <MenuSeparator />
            <MenuItem onClick={() => setOpenMenu({ id: 'controlcenter', side: 'right', x: 8 })}>System Settings…</MenuItem>
            <MenuItem onClick={run(actions.openLaunchpad)}>Applications…</MenuItem>
            <MenuSeparator />
            {actions.windows.length > 0 && <MenuItem onClick={run(actions.closeAll)}>Close All Windows</MenuItem>}
            {actions.windows.length > 0 && <MenuSeparator />}
            <MenuItem onClick={run(actions.sleep)}>Sleep</MenuItem>
            <MenuItem onClick={run(() => window.location.reload())}>Restart…</MenuItem>
            <MenuItem onClick={run(actions.sleep)}>Shut Down…</MenuItem>
            <MenuSeparator />
            <MenuItem onClick={run(actions.sleep)}>Lock Screen</MenuItem>
          </>
        );
      case 'app':
        return (
          <>
            <MenuItem onClick={run(() => actions.openWindow('about'))}>About {appName}</MenuItem>
            <MenuSeparator />
            <MenuItem onClick={() => setOpenMenu({ id: 'controlcenter', side: 'right', x: 8 })}>Settings…</MenuItem>
            <MenuSeparator />
            {actions.activeWindow && <MenuItem onClick={run(actions.minimizeActive)}>Hide {appName}</MenuItem>}
            <MenuItem onClick={run(actions.bringAllToFront)}>Show All Windows</MenuItem>
            {actions.activeWindow && (
              <>
                <MenuSeparator />
                <MenuItem onClick={run(actions.closeActive)}>Quit {appName}</MenuItem>
              </>
            )}
          </>
        );
      case 'file':
        return (
          <>
            <MenuItem onClick={run(() => actions.openWindow('finder'))}>New Finder Window</MenuItem>
            {actions.selectedLabel && <MenuItem onClick={run(actions.openSelected)}>Open “{actions.selectedLabel}”</MenuItem>}
            {actions.activeWindow && <MenuItem onClick={run(actions.closeActive)}>Close Window</MenuItem>}
            <MenuSeparator />
            <MenuItem onClick={run(() => window.open('/MUGISHA PACIFIQUE.pdf', '_blank'))}>Download CV</MenuItem>
            <MenuItem onClick={run(() => { window.location.href = 'mailto:Pacifiquem58@gmail.com'; })}>New Email to Pacifique</MenuItem>
            <MenuSeparator />
            <MenuItem onClick={run(actions.openSpotlight)}>Find…</MenuItem>
          </>
        );
      case 'edit':
        return (
          <>
            <MenuItem onClick={run(() => actions.copy('Pacifiquem58@gmail.com', 'Email address copied'))}>Copy Email Address</MenuItem>
            <MenuItem onClick={run(() => actions.copy('+250 795 653 123', 'Phone number copied'))}>Copy Phone Number</MenuItem>
            <MenuItem onClick={run(() => actions.copy('https://github.com/Pacifique5', 'GitHub link copied'))}>Copy GitHub Link</MenuItem>
            <MenuItem onClick={run(() => actions.copy('https://www.linkedin.com/in/pacifique-mugisha-449a4a3b0/', 'LinkedIn link copied'))}>Copy LinkedIn Link</MenuItem>
            <MenuSeparator />
            <MenuItem onClick={run(() => actions.copy(window.location.href, 'Portfolio link copied'))}>Copy Portfolio Link</MenuItem>
          </>
        );
      case 'view':
        return (
          <>
            <div className="mac-menu-heading">Wallpaper</div>
            {actions.wallpapers.map((name, i) => (
              <MenuItem key={name} checked={i === actions.wallpaper} onClick={run(() => actions.setWallpaper(i))}>{name}</MenuItem>
            ))}
            <MenuSeparator />
            <MenuItem onClick={run(actions.openLaunchpad)}>Show Launchpad</MenuItem>
            <MenuItem onClick={() => setOpenMenu({ id: 'controlcenter', side: 'right', x: 8 })}>Show Control Center</MenuItem>
            <MenuSeparator />
            <MenuItem onClick={run(() => {
              if (document.fullscreenElement) document.exitFullscreen();
              else document.documentElement.requestFullscreen?.();
            })}>{actions.fullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}</MenuItem>
          </>
        );
      case 'go':
        return (
          <>
            {SECTION_IDS.map(sid => (
              <MenuItem key={sid} checked={actions.activeWindow === sid} onClick={run(() => actions.openWindow(sid))}>{APPS[sid].label}</MenuItem>
            ))}
            <MenuSeparator />
            <MenuItem onClick={run(() => actions.openWindow('finder'))}>Desktop</MenuItem>
            <MenuItem onClick={run(actions.openLaunchpad)}>Applications</MenuItem>
            <MenuSeparator />
            <MenuItem onClick={run(() => window.open('https://github.com/Pacifique5', '_blank', 'noopener'))}>GitHub Profile</MenuItem>
            <MenuItem onClick={run(() => window.open('https://www.linkedin.com/in/pacifique-mugisha-449a4a3b0/', '_blank', 'noopener'))}>LinkedIn Profile</MenuItem>
          </>
        );
      case 'window':
        return (
          <>
            {actions.activeWindow ? (
              <>
                <MenuItem onClick={run(actions.minimizeActive)}>Minimize</MenuItem>
                <MenuItem onClick={run(actions.zoomActive)}>Zoom</MenuItem>
                <MenuItem onClick={run(actions.closeActive)}>Close</MenuItem>
                <MenuSeparator />
              </>
            ) : (
              <div className="px-2.25 py-1 text-[12px] opacity-60">No open windows</div>
            )}
            {actions.windows.length > 0 && (
              <>
                <MenuItem onClick={run(actions.bringAllToFront)}>Bring All to Front</MenuItem>
                <MenuItem onClick={run(actions.closeAll)}>Close All</MenuItem>
                <MenuSeparator />
              </>
            )}
            {actions.windows.map(w => (
              <MenuItem key={w} checked={w === actions.activeWindow} onClick={run(() => actions.restoreWindow(w))}>{WINDOW_TITLES[w]}</MenuItem>
            ))}
            {actions.windows.length === 0 && <MenuItem onClick={run(() => actions.openWindow('finder'))}>New Finder Window</MenuItem>}
          </>
        );
      case 'help': {
        const q = helpQuery.trim().toLowerCase();
        const hits = q ? SECTION_IDS.filter(s => APPS[s].label.toLowerCase().includes(q)) : [];
        return (
          <>
            <div className="px-1.5 pt-1 pb-1.5">
              <div className="flex items-center gap-1.5 h-5.5 px-2 rounded-[5px] bg-black/6 dark:bg-white/10 shadow-[inset_0_0_0_0.5px_var(--hairline)]">
                <SearchGlyph size={11} className="opacity-50" />
                <input autoFocus value={helpQuery} onChange={(e) => setHelpQuery(e.target.value)} placeholder="Search"
                  className="bg-transparent outline-none text-[13px] w-full placeholder:text-(--menu-dim)" />
              </div>
            </div>
            {hits.length > 0 && (
              <>
                <div className="mac-menu-heading">Sections</div>
                {hits.map(s => <MenuItem key={s} onClick={run(() => { setHelpQuery(''); actions.openWindow(s); })}>Open {APPS[s].label}</MenuItem>)}
                <MenuSeparator />
              </>
            )}
            {q && hits.length === 0 && <div className="px-2.25 py-1 text-[12px] opacity-60">No results</div>}
            <MenuItem onClick={run(() => actions.openWindow('finder'))}>Getting Started</MenuItem>
            <MenuItem onClick={run(() => actions.openWindow('about'))}>About This Portfolio</MenuItem>
            <MenuSeparator />
            <MenuItem onClick={run(() => actions.openWindow('contact'))}>Contact Me</MenuItem>
            <MenuItem onClick={run(() => window.open('https://github.com/Pacifique5/MAC-OS-Portfolio/issues', '_blank', 'noopener'))}>Report an Issue</MenuItem>
          </>
        );
      }
      case 'wifi':
        return <WifiMenu sys={sys} close={() => setOpenMenu({ id: 'controlcenter', side: 'right', x: 8 })} />;
      case 'bluetooth':
        return <BluetoothMenu sys={sys} close={() => setOpenMenu({ id: 'controlcenter', side: 'right', x: 8 })} />;
      case 'sound':
        return (
          <>
            <div className="px-2.25 pt-1 pb-2 text-[13px] font-semibold">Sound</div>
            <div className="px-2.25 pb-2">
              <CCSlider value={sys.volume} onChange={sys.setVolume} icon={<SpeakerGlyph size={11} level={volumeLevel(sys.volume)} />} />
            </div>
            <MenuSeparator />
            <div className="mac-menu-heading">Output</div>
            {OUTPUT_DEVICES.map(dev => {
              const active = sys.outputDevice === dev;
              const Glyph = dev.includes('AirPods') ? HeadphonesGlyph : dev.includes('Display') ? DisplayGlyph : LaptopGlyph;
              return (
                <button key={dev} type="button" className="mac-menu-item py-1!" onClick={() => sys.setOutputDevice(dev)}>
                  <span className="flex items-center gap-2"><CircleIcon active={active}><Glyph size={11} /></CircleIcon>{dev}</span>
                </button>
              );
            })}
            <MenuSeparator />
            <MenuItem onClick={() => setOpenMenu({ id: 'controlcenter', side: 'right', x: 8 })}>Sound Settings…</MenuItem>
          </>
        );
      case 'battery':
        return (
          <>
            <div className="px-2.25 pt-1 pb-1 flex items-center justify-between">
              <span className="text-[13px] font-semibold">Battery</span>
              <span className="text-[13px] opacity-60">{sys.battery.level}%</span>
            </div>
            <div className="px-2.25 pb-1 text-[12px] opacity-60">
              Power Source: {sys.battery.charging ? 'Power Adapter' : 'Battery'}
              {!sys.battery.supported && <span className="block text-[11px] opacity-80">Battery status unavailable in this browser</span>}
            </div>
            <MenuSeparator />
            <div className="mac-menu-heading">Using Significant Energy</div>
            <div className="px-2.25 pb-1 text-[12px] opacity-60">No Apps Using Significant Energy</div>
            <MenuSeparator />
            <MenuItem onClick={() => setOpenMenu({ id: 'controlcenter', side: 'right', x: 8 })}>Battery Settings…</MenuItem>
          </>
        );
      default:
        return null;
    }
  }
}

/* ------------------------------------------------------------------ */

function WifiMenu({ sys, close }: { sys: SystemState; close: () => void }) {
  const current = WIFI_NETWORKS.find(n => n.name === sys.connectedNetwork);
  const others = WIFI_NETWORKS.filter(n => n.name !== sys.connectedNetwork);

  const row = (net: (typeof WIFI_NETWORKS)[number], connected: boolean) => (
    <button key={net.name} type="button" className="mac-menu-item py-1! group" onClick={() => sys.connectNetwork(net.name)}>
      <span className="flex items-center gap-2 min-w-0">
        <CircleIcon active={connected}><WifiGlyph size={10} strength={net.signal} /></CircleIcon>
        <span className="truncate">{net.name}</span>
      </span>
      <span className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100">
        {sys.connectingTo === net.name ? <Spinner size={13} /> : net.lock ? <LockGlyph size={11} /> : null}
      </span>
    </button>
  );

  return (
    <>
      <div className="px-2.25 pt-1 pb-1.5 flex items-center justify-between">
        <span className="text-[13px] font-semibold">Wi-Fi</span>
        <Toggle on={sys.wifiOn} onChange={sys.toggleWifi} />
      </div>
      {sys.wifiOn && (
        <>
          <MenuSeparator />
          {sys.wifiSearching ? (
            <div className="flex items-center gap-2 px-2.25 py-2 text-[12px] opacity-60"><Spinner size={13} /> Looking for networks…</div>
          ) : (
            <>
              {current && (
                <>
                  <div className="mac-menu-heading">Known Network</div>
                  {row(current, true)}
                </>
              )}
              <div className="mac-menu-heading mt-1">Other Networks</div>
              {others.map(n => row(n, false))}
            </>
          )}
        </>
      )}
      <MenuSeparator />
      <MenuItem onClick={close}>Wi-Fi Settings…</MenuItem>
    </>
  );
}

function BluetoothMenu({ sys, close }: { sys: SystemState; close: () => void }) {
  return (
    <>
      <div className="px-2.25 pt-1 pb-1.5 flex items-center justify-between">
        <span className="text-[13px] font-semibold">Bluetooth</span>
        <Toggle on={sys.btSupported && sys.btOn} onChange={sys.setBtOn} disabled={!sys.btSupported} />
      </div>
      <MenuSeparator />
      {!sys.btSupported ? (
        <div className="px-2.25 py-2 text-[12px] opacity-60 leading-snug">Bluetooth isn’t available in this browser. Try Chrome or Edge on desktop.</div>
      ) : !sys.btOn ? (
        <div className="px-2.25 py-2 text-[12px] opacity-60">Bluetooth is off.</div>
      ) : (
        <>
          <div className="mac-menu-heading">Devices</div>
          {sys.btDevices.length === 0 && <div className="px-2.25 py-1 text-[12px] opacity-50">No devices paired yet</div>}
          {sys.btDevices.map(d => (
            <div key={d.id} className="mac-menu-item py-1!">
              <span className="flex items-center gap-2 min-w-0">
                <CircleIcon active><HeadphonesGlyph size={11} /></CircleIcon>
                <span className="truncate">{d.name}</span>
              </span>
              <CheckGlyph size={11} className="opacity-60" />
            </div>
          ))}
          <MenuSeparator />
          <button type="button" className="mac-menu-item" onClick={sys.scanBluetooth} disabled={sys.btScanning}>
            <span className="flex items-center gap-2">{sys.btScanning && <Spinner size={12} />}{sys.btScanning ? 'Scanning…' : 'Connect a Device…'}</span>
          </button>
        </>
      )}
      <MenuSeparator />
      <MenuItem onClick={close}>Bluetooth Settings…</MenuItem>
    </>
  );
}
