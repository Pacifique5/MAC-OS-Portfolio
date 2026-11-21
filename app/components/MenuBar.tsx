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
    `h-[22px] px-[9px] rounded-[4px] flex items-center transition-colors ${openMenu?.id === id ? pressed : hover}`;
  const statusCls = (id: string) =>
    `h-[22px] px-[7px] rounded-[4px] flex items-center gap-1.5 transition-colors ${openMenu?.id === id ? pressed : hover}`;

  const labels: Record<(typeof LEFT_MENUS)[number], ReactNode> = {
    apple: <FaApple className="text-[15px] -mt-px" />,
    app: <span className="font-bold">{appName}</span>,
    file: 'File', edit: 'Edit', view: 'View', go: 'Go', window: 'Window', help: 'Help',
  };

  return (
    <>
      <div
        className={`absolute top-0 inset-x-0 h-7 z-[60] flex items-center justify-between px-2 text-[13px] backdrop-blur-2xl select-none transition-colors ${
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
          {sys.focusOn && <span className="h-[22px] px-[7px] flex items-center" title="Do Not Disturb"><MoonGlyph size={13} /></span>}
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
          <button type="button" className={`h-[22px] px-[7px] rounded-[4px] transition-colors ${notificationsOpen ? pressed : hover}`}
            onClick={(e) => { e.stopPropagation(); setOpenMenu(null); onToggleNotifications(); }}>
            <span suppressHydrationWarning>{clock}</span>
          </button>
        </div>
      </div>

      {openMenu && (
        <div
          className="absolute top-[27px] z-[61] animate-fade-in"
          style={openMenu.side === 'left' ? { left: openMenu.x } : { right: openMenu.id === 'controlcenter' ? 8 : Math.max(6, openMenu.x) }}
          onClick={(e) => e.stopPropagation()}
        >
          {openMenu.id === 'controlcenter' ? (
            <ControlCenter sys={sys} />
          ) : (
            <div className={`mac-menu ${openMenu.side === 'right' ? 'w-[284px]' : 'min-w-[230px]'}`}>
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
            <MenuItem onClick={run(() => window.open('https://github.com/Pacifique5', '_blank'))}>App Store…</MenuItem>
            <MenuSeparator />
            <MenuItem onClick={run(actions.openLaunchpad)}>Recent Items</MenuItem>
            <MenuSeparator />
            <MenuItem shortcut="⌥⌘⎋" onClick={run(actions.closeAll)} disabled={actions.windows.length === 0}>Force Quit…</MenuItem>
            <MenuSeparator />
            <MenuItem onClick={run(actions.sleep)}>Sleep</MenuItem>
            <MenuItem onClick={run(() => window.location.reload())}>Restart…</MenuItem>
            <MenuItem onClick={run(actions.sleep)}>Shut Down…</MenuItem>
            <MenuSeparator />
            <MenuItem shortcut="⌃⌘Q" onClick={run(actions.sleep)}>Lock Screen</MenuItem>
            <MenuItem shortcut="⇧⌘Q" onClick={run(actions.sleep)}>Log Out Mugisha Pacifique…</MenuItem>
          </>
        );
      case 'app':
        return (
          <>
            <MenuItem onClick={run(() => actions.openWindow('about'))}>About {appName}</MenuItem>
            <MenuSeparator />
            <MenuItem shortcut="⌘," onClick={() => setOpenMenu({ id: 'controlcenter', side: 'right', x: 8 })}>Settings…</MenuItem>
            <MenuSeparator />
            <MenuItem shortcut="⌘H" onClick={run(actions.minimizeActive)} disabled={!actions.activeWindow}>Hide {appName}</MenuItem>
            <MenuItem shortcut="⌥⌘H" disabled>Hide Others</MenuItem>
            <MenuItem onClick={run(actions.bringAllToFront)}>Show All</MenuItem>
            {appName !== 'Finder' && (
              <>
                <MenuSeparator />
                <MenuItem shortcut="⌘Q" onClick={run(actions.closeActive)}>Quit {appName}</MenuItem>
              </>
            )}
          </>
        );
      case 'file':
        return (
          <>
            <MenuItem shortcut="⌘N" onClick={run(() => actions.openWindow('finder'))}>New Finder Window</MenuItem>
            <MenuItem shortcut="⇧⌘N" disabled>New Folder</MenuItem>
            <MenuItem shortcut="⌘O" onClick={run(actions.openSelected)}>Open</MenuItem>
            <MenuSeparator />
            <MenuItem shortcut="⌘W" onClick={run(actions.closeActive)} disabled={!actions.activeWindow}>Close Window</MenuItem>
            <MenuSeparator />
            <MenuItem shortcut="⌘F" onClick={run(actions.openSpotlight)}>Find</MenuItem>
          </>
        );
      case 'edit':
        return (
          <>
            <MenuItem shortcut="⌘Z" disabled>Undo</MenuItem>
            <MenuItem shortcut="⇧⌘Z" disabled>Redo</MenuItem>
            <MenuSeparator />
            <MenuItem shortcut="⌘X" disabled>Cut</MenuItem>
            <MenuItem shortcut="⌘C" onClick={run(() => document.execCommand('copy'))}>Copy</MenuItem>
            <MenuItem shortcut="⌘V" disabled>Paste</MenuItem>
            <MenuItem shortcut="⌘A" onClick={run(() => document.execCommand('selectAll'))}>Select All</MenuItem>
            <MenuSeparator />
            <MenuItem shortcut="⌃⌘Space">Emoji &amp; Symbols</MenuItem>
          </>
        );
      case 'view':
        return (
          <>
            <MenuItem shortcut="⌘1" checked>as Icons</MenuItem>
            <MenuItem shortcut="⌘2" disabled>as List</MenuItem>
            <MenuItem shortcut="⌘3" disabled>as Columns</MenuItem>
            <MenuItem shortcut="⌘4" disabled>as Gallery</MenuItem>
            <MenuSeparator />
            <MenuItem shortcut="⌥⌘P" disabled>Show Path Bar</MenuItem>
            <MenuItem shortcut="⌘/" disabled>Show Status Bar</MenuItem>
            <MenuSeparator />
            <MenuItem shortcut="⌃⌘F" onClick={run(() => {
              if (document.fullscreenElement) document.exitFullscreen();
              else document.documentElement.requestFullscreen?.();
            })}>Enter Full Screen</MenuItem>
          </>
        );
      case 'go':
        return (
          <>
            <MenuItem shortcut="⌘[" disabled>Back</MenuItem>
            <MenuItem shortcut="⌘]" disabled>Forward</MenuItem>
            <MenuSeparator />
            {SECTION_IDS.map((sid, i) => (
              <MenuItem key={sid} shortcut={`⇧⌘${i + 1}`} onClick={run(() => actions.openWindow(sid))}>{APPS[sid].label}</MenuItem>
            ))}
            <MenuSeparator />
            <MenuItem shortcut="⇧⌘A" onClick={run(actions.openLaunchpad)}>Applications</MenuItem>
            <MenuItem shortcut="⇧⌘G" onClick={run(actions.openSpotlight)}>Go to Folder…</MenuItem>
            <MenuItem shortcut="⌘K" onClick={run(() => actions.openWindow('contact'))}>Connect to Server…</MenuItem>
          </>
        );
      case 'window':
        return (
          <>
            <MenuItem shortcut="⌘M" onClick={run(actions.minimizeActive)} disabled={!actions.activeWindow}>Minimize</MenuItem>
            <MenuItem disabled={!actions.activeWindow}>Zoom</MenuItem>
            <MenuSeparator />
            <MenuItem onClick={run(actions.bringAllToFront)} disabled={actions.windows.length === 0}>Bring All to Front</MenuItem>
            {actions.windows.length > 0 && <MenuSeparator />}
            {actions.windows.map(w => (
              <MenuItem key={w} checked={w === actions.activeWindow} onClick={run(() => actions.restoreWindow(w))}>{WINDOW_TITLES[w]}</MenuItem>
            ))}
          </>
        );
      case 'help': {
        const q = helpQuery.trim().toLowerCase();
        const hits = q ? SECTION_IDS.filter(s => APPS[s].label.toLowerCase().includes(q)) : [];
        return (
          <>
            <div className="px-1.5 pt-1 pb-1.5">
              <div className="flex items-center gap-1.5 h-[22px] px-2 rounded-[5px] bg-black/[0.06] dark:bg-white/10 shadow-[inset_0_0_0_0.5px_var(--hairline)]">
                <SearchGlyph size={11} className="opacity-50" />
                <input autoFocus value={helpQuery} onChange={(e) => setHelpQuery(e.target.value)} placeholder="Search"
                  className="bg-transparent outline-none text-[13px] w-full placeholder:text-[var(--menu-dim)]" />
              </div>
            </div>
            {hits.length > 0 && (
              <>
                <div className="mac-menu-heading">Menu Items</div>
                {hits.map(s => <MenuItem key={s} onClick={run(() => { setHelpQuery(''); actions.openWindow(s); })}>Go ▸ {APPS[s].label}</MenuItem>)}
                <MenuSeparator />
              </>
            )}
            <MenuItem onClick={run(() => actions.openWindow('about'))}>Portfolio Help</MenuItem>
            <MenuItem onClick={run(() => actions.openWindow('finder'))}>Getting Started</MenuItem>
            <MenuSeparator />
            <MenuItem onClick={run(() => actions.openWindow('contact'))}>Send Feedback…</MenuItem>
          </>
        );
      }
      case 'wifi':
        return <WifiMenu sys={sys} close={() => setOpenMenu(null)} />;
      case 'bluetooth':
        return <BluetoothMenu sys={sys} close={() => setOpenMenu(null)} />;
      case 'sound':
        return (
          <>
            <div className="px-[9px] pt-1 pb-2 text-[13px] font-semibold">Sound</div>
            <div className="px-[9px] pb-2">
              <CCSlider value={sys.volume} onChange={sys.setVolume} icon={<SpeakerGlyph size={11} level={volumeLevel(sys.volume)} />} />
            </div>
            <MenuSeparator />
            <div className="mac-menu-heading">Output</div>
            {OUTPUT_DEVICES.map(dev => {
              const active = sys.outputDevice === dev;
              const Glyph = dev.includes('AirPods') ? HeadphonesGlyph : dev.includes('Display') ? DisplayGlyph : LaptopGlyph;
              return (
                <button key={dev} type="button" className="mac-menu-item !py-1" onClick={() => sys.setOutputDevice(dev)}>
                  <span className="flex items-center gap-2"><CircleIcon active={active}><Glyph size={11} /></CircleIcon>{dev}</span>
                </button>
              );
            })}
            <MenuSeparator />
            <MenuItem onClick={() => setOpenMenu(null)}>Sound Settings…</MenuItem>
          </>
        );
      case 'battery':
        return (
          <>
            <div className="px-[9px] pt-1 pb-1 flex items-center justify-between">
              <span className="text-[13px] font-semibold">Battery</span>
              <span className="text-[13px] opacity-60">{sys.battery.level}%</span>
            </div>
            <div className="px-[9px] pb-1 text-[12px] opacity-60">
              Power Source: {sys.battery.charging ? 'Power Adapter' : 'Battery'}
              {!sys.battery.supported && <span className="block text-[11px] opacity-80">Battery status unavailable in this browser</span>}
            </div>
            <MenuSeparator />
            <div className="mac-menu-heading">Using Significant Energy</div>
            <div className="px-[9px] pb-1 text-[12px] opacity-60">No Apps Using Significant Energy</div>
            <MenuSeparator />
            <MenuItem onClick={() => setOpenMenu(null)}>Battery Settings…</MenuItem>
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
    <button key={net.name} type="button" className="mac-menu-item !py-1 group" onClick={() => sys.connectNetwork(net.name)}>
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
      <div className="px-[9px] pt-1 pb-1.5 flex items-center justify-between">
        <span className="text-[13px] font-semibold">Wi-Fi</span>
        <Toggle on={sys.wifiOn} onChange={sys.toggleWifi} />
      </div>
      {sys.wifiOn && (
        <>
          <MenuSeparator />
          {sys.wifiSearching ? (
            <div className="flex items-center gap-2 px-[9px] py-2 text-[12px] opacity-60"><Spinner size={13} /> Looking for networks…</div>
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
      <div className="px-[9px] pt-1 pb-1.5 flex items-center justify-between">
        <span className="text-[13px] font-semibold">Bluetooth</span>
        <Toggle on={sys.btSupported && sys.btOn} onChange={sys.setBtOn} disabled={!sys.btSupported} />
      </div>
      <MenuSeparator />
      {!sys.btSupported ? (
        <div className="px-[9px] py-2 text-[12px] opacity-60 leading-snug">Bluetooth isn’t available in this browser. Try Chrome or Edge on desktop.</div>
      ) : !sys.btOn ? (
        <div className="px-[9px] py-2 text-[12px] opacity-60">Bluetooth is off.</div>
      ) : (
        <>
          <div className="mac-menu-heading">Devices</div>
          {sys.btDevices.length === 0 && <div className="px-[9px] py-1 text-[12px] opacity-50">No devices paired yet</div>}
          {sys.btDevices.map(d => (
            <div key={d.id} className="mac-menu-item !py-1">
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
