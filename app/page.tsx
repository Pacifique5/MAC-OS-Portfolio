'use client';
import { useState, useEffect } from 'react';
import MacWindow from './components/MacWindow';
import DockIcon from './components/DockIcon';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Experience from './components/sections/Experience';
import Testimonials from './components/sections/Testimonials';
import Contact from './components/sections/Contact';
import { FiSearch, FiBluetooth, FiBell } from 'react-icons/fi';
import { HiOutlineUser } from 'react-icons/hi';
import { BsBriefcaseFill, BsBatteryFull, BsGrid3X3Gap } from 'react-icons/bs';
import { HiLightningBolt } from 'react-icons/hi';
import { IoSchool, IoChatbubble } from 'react-icons/io5';
import { MdEmail } from 'react-icons/md';
import { FaTrash, FaChrome, FaGithub, FaLinkedin, FaTerminal, FaApple, FaVolumeUp, FaWifi } from 'react-icons/fa';
import { SiSafari } from 'react-icons/si';
import { IoRocketSharp, IoSettingsSharp } from 'react-icons/io5';
import { MdPhotoLibrary, MdBrightness6 } from 'react-icons/md';
import { BsCalendarFill } from 'react-icons/bs';

const folders = [
  { id: 'about',        label: 'About Me',    gradient: ['#7c3aed','#6d28d9','#4c1d95'], Icon: HiOutlineUser,   position: { top: '80px',  left: '30px'  } },
  { id: 'projects',     label: 'Projects',    gradient: ['#fb923c','#ea580c','#c2410c'], Icon: BsBriefcaseFill, position: { top: '80px',  left: '150px' } },
  { id: 'skills',       label: 'Skills',      gradient: ['#fbbf24','#f59e0b','#d97706'], Icon: HiLightningBolt, position: { top: '230px', left: '30px'  } },
  { id: 'experience',   label: 'Experience',  gradient: ['#34d399','#10b981','#059669'], Icon: IoSchool,        position: { top: '230px', left: '150px' } },
  { id: 'testimonials', label: 'Testimonials',gradient: ['#f472b6','#ec4899','#db2777'], Icon: IoChatbubble,    position: { top: '380px', left: '30px'  } },
  { id: 'contact',      label: 'Contact',     gradient: ['#60a5fa','#3b82f6','#2563eb'], Icon: MdEmail,         position: { top: '380px', left: '150px' } },
];
const dockApps = [
  // System apps (left side)
  { id: 'finder',       label: 'Finder',       gradient: ['#5ac8fa','#007aff','#0051d5'], Icon: FiSearch,        action: 'system' },
  { id: 'launchpad',    label: 'Launchpad',    gradient: ['#ff6b6b','#ee0979','#ff6b6b'], Icon: IoRocketSharp,   action: 'system' },
  { id: 'safari',       label: 'Safari',       gradient: ['#34aadc','#007aff','#0051d5'], Icon: SiSafari,        action: 'system' },
  { id: 'chrome',       label: 'Chrome',       gradient: ['#fbbc04','#34a853','#4285f4'], Icon: FaChrome,        action: 'link', href: 'https://google.com' },
  { id: 'terminal',     label: 'Terminal',     gradient: ['#1a1a2e','#16213e','#0f3460'], Icon: FaTerminal,      action: 'system' },
  { id: 'photos',       label: 'Photos',       gradient: ['#ff9a9e','#fecfef','#ff9a9e'], Icon: MdPhotoLibrary,  action: 'system' },
  { id: 'calendar',     label: 'Calendar',     gradient: ['#ff3b30','#ff6b6b','#ff3b30'], Icon: BsCalendarFill,  action: 'system' },
  { id: 'divider1',     label: '',             gradient: [],                               Icon: FiSearch,        action: 'divider' },
  // Portfolio apps
  { id: 'about',        label: 'About Me',     gradient: ['#a78bfa','#7c3aed','#6d28d9'], Icon: HiOutlineUser,   action: 'open' },
  { id: 'projects',     label: 'Projects',     gradient: ['#fb923c','#ea580c','#c2410c'], Icon: BsBriefcaseFill, action: 'open' },
  { id: 'skills',       label: 'Skills',       gradient: ['#fbbf24','#f59e0b','#d97706'], Icon: HiLightningBolt, action: 'open' },
  { id: 'experience',   label: 'Experience',   gradient: ['#34d399','#10b981','#059669'], Icon: IoSchool,        action: 'open' },
  { id: 'testimonials', label: 'Testimonials', gradient: ['#f472b6','#ec4899','#db2777'], Icon: IoChatbubble,    action: 'open' },
  { id: 'contact',      label: 'Contact',      gradient: ['#60a5fa','#3b82f6','#2563eb'], Icon: MdEmail,         action: 'open' },
  { id: 'divider2',     label: '',             gradient: [],                               Icon: FiSearch,        action: 'divider' },
  // Social + settings
  { id: 'github',       label: 'GitHub',       gradient: ['#333','#24292e','#111'],        Icon: FaGithub,        action: 'link', href: 'https://github.com/Pacifique5' },
  { id: 'linkedin',     label: 'LinkedIn',     gradient: ['#0077b5','#005885','#003f5c'], Icon: FaLinkedin,      action: 'link', href: 'https://linkedin.com/in/mugisha-pacifique' },
  { id: 'settings',     label: 'Settings',     gradient: ['#8e8e93','#636366','#48484a'], Icon: IoSettingsSharp, action: 'system' },
  { id: 'divider3',     label: '',             gradient: [],                               Icon: FiSearch,        action: 'divider' },
  { id: 'trash',        label: 'Trash',        gradient: ['#9ca3af','#6b7280','#4b5563'], Icon: FaTrash,         action: 'system' },
];
// WiFi signal strength indicator
function WifiSignal({ bars, active }: { bars: number; active: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-3.5">
      {[1, 2, 3].map(b => (
        <div key={b} className={`w-1 rounded-sm transition-colors ${b <= bars ? (active ? 'bg-blue-400' : 'bg-white') : 'bg-white/20'}`} style={{ height: `${b * 33}%` }}></div>
      ))}
    </div>
  );
}

export default function Home() {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; target: string | null } | null>(null);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState('');
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  // Functional system state
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(75);

  // Real Bluetooth state
  const [btDevices, setBtDevices] = useState<{ id: string; name: string }[]>([]);
  const [btScanning, setBtScanning] = useState(false);
  const [btSupported, setBtSupported] = useState(false);

  // WiFi state
  const [wifiOn, setWifiOn] = useState(true);
  const [connectedNetwork, setConnectedNetwork] = useState('Home Network');
  const [scanningWifi, setScanningWifi] = useState(false);
  const wifiNetworks = [
    { name: 'Home Network', signal: 3, lock: true },
    { name: 'Office_5G', signal: 3, lock: true },
    { name: 'Guest_WiFi', signal: 2, lock: false },
    { name: 'iPhone Hotspot', signal: 2, lock: true },
    { name: 'Neighbor_2.4G', signal: 1, lock: true },
    { name: 'CoffeeShop_Free', signal: 2, lock: false },
  ];

  const handleWifiToggle = () => {
    if (wifiOn) { setWifiOn(false); setConnectedNetwork(''); }
    else {
      setWifiOn(true);
      setScanningWifi(true);
      setTimeout(() => { setScanningWifi(false); setConnectedNetwork('Home Network'); }, 2000);
    }
  };

  const handleConnectNetwork = (name: string) => {
    if (connectedNetwork === name) return;
    setScanningWifi(true);
    setTimeout(() => { setConnectedNetwork(name); setScanningWifi(false); }, 1500);
  };

  useEffect(() => {
    setBtSupported(typeof navigator !== 'undefined' && 'bluetooth' in navigator);
  }, []);

  const handleBtScan = async () => {
    if (!btSupported) return;
    setBtScanning(true);
    try {
      // Web Bluetooth API — opens browser's native device picker
      const device = await (navigator as Navigator & { bluetooth: { requestDevice: (o: object) => Promise<{ id: string; name?: string }> } }).bluetooth.requestDevice({
        acceptAllDevices: true,
      });
      setBtDevices(prev => {
        if (prev.find(d => d.id === device.id)) return prev;
        return [...prev, { id: device.id, name: device.name ?? 'Unknown Device' }];
      });
    } catch {
      // user cancelled or denied — that's fine
    } finally {
      setBtScanning(false);
    }
  };
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      const date = now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
      setCurrentTime(`${date} ${time}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === ' ') {
        e.preventDefault();
        setSpotlightOpen(true);
      }
      if (e.key === 'Escape') {
        setSpotlightOpen(false);
        setActiveMenu(null);
        setContextMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const handleFolderClick = (folderId: string) => {
    setSelectedFolder(folderId);
    setContextMenu(null);
  };
  const handleFolderDoubleClick = (folderId: string) => {
    if (!openWindows.includes(folderId)) {
      setOpenWindows([...openWindows, folderId]);
    }
    setContextMenu(null);
  };
  const handleCloseWindow = (folderId: string) => {
    setOpenWindows(openWindows.filter(id => id !== folderId));
    setMinimizedWindows(minimizedWindows.filter(id => id !== folderId));
  };

  const handleMinimizeWindow = (folderId: string) => {
    if (!minimizedWindows.includes(folderId)) {
      setMinimizedWindows([...minimizedWindows, folderId]);
    }
  };

  const handleRestoreWindow = (folderId: string) => {
    setMinimizedWindows(minimizedWindows.filter(id => id !== folderId));
  };

  const handleDockClick = (app: { id: string; action: string; href?: string }) => {
    if (app.action === 'link' && app.href) {
      window.open(app.href, '_blank');
    } else if (app.action === 'open') {
      if (minimizedWindows.includes(app.id)) {
        handleRestoreWindow(app.id);
      } else if (!openWindows.includes(app.id)) {
        setOpenWindows([...openWindows, app.id]);
      }
    }
  };
  const handleContextMenu = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, target });
  };
  const handleDesktopClick = () => {
    setSelectedFolder(null);
    setActiveMenu(null);
    setContextMenu(null);
  };
  const handleSpotlightSearch = (query: string) => {
    setSpotlightQuery(query);
  };
  const getSpotlightResults = () => {
    if (!spotlightQuery) return [];
    return folders.filter(f => f.label.toLowerCase().includes(spotlightQuery.toLowerCase()));
  };
  const renderSection = (section: string) => {
    switch (section) {
      case 'about': return <About />;
      case 'projects': return <Projects />;
      case 'skills': return <Skills />;
      case 'experience': return <Experience />;
      case 'testimonials': return <Testimonials />;
      case 'contact': return <Contact />;
      default: return null;
    }
  };
  return (
    <div className="relative w-full h-screen overflow-hidden select-none" onClick={handleDesktopClick}>
      {/* Brightness overlay */}
      <div className="absolute inset-0 bg-black pointer-events-none z-[45]" style={{ opacity: (100 - brightness) / 100 * 0.85 }}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700/30 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-700/30 via-transparent to-transparent"></div>
      </div>
      {/* macOS Menu Bar */}
      <div className="absolute top-0 left-0 right-0 h-7 bg-black/40 backdrop-blur-2xl border-b border-white/10 z-50 flex items-center justify-between px-3 text-white text-xs">
        {/* Left side */}
        <div className="flex items-center gap-0.5">
          {/* Apple logo */}
          <button className="px-2 py-1 rounded hover:bg-white/10 transition-colors flex items-center" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'apple' ? null : 'apple'); }}>
            <FaApple className="text-base" />
          </button>
          <button className="px-2.5 py-1 rounded hover:bg-white/10 font-semibold transition-colors" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'finder' ? null : 'finder'); }}>Finder</button>
          <button className="px-2.5 py-1 rounded hover:bg-white/10 transition-colors" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'file' ? null : 'file'); }}>File</button>
          <button className="px-2.5 py-1 rounded hover:bg-white/10 transition-colors" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'edit' ? null : 'edit'); }}>Edit</button>
          <button className="px-2.5 py-1 rounded hover:bg-white/10 transition-colors" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'view' ? null : 'view'); }}>View</button>
          <button className="px-2.5 py-1 rounded hover:bg-white/10 transition-colors" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'go' ? null : 'go'); }}>Go</button>
          <button className="px-2.5 py-1 rounded hover:bg-white/10 transition-colors" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'window' ? null : 'window'); }}>Window</button>
          <button className="px-2.5 py-1 rounded hover:bg-white/10 transition-colors" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'help' ? null : 'help'); }}>Help</button>
        </div>
        {/* Right side — system tray */}
        <div className="flex items-center gap-0.5">
          <button className="px-2 py-1 rounded hover:bg-white/10 transition-colors flex items-center gap-1" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'wifi' ? null : 'wifi'); }}>
            <FaWifi className="text-sm" />
          </button>
          <button className="px-2 py-1 rounded hover:bg-white/10 transition-colors flex items-center gap-1" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'bluetooth' ? null : 'bluetooth'); }}>
            <FiBluetooth className="text-sm" />
          </button>
          <button className="px-2 py-1 rounded hover:bg-white/10 transition-colors flex items-center gap-1" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'volume' ? null : 'volume'); }}>
            <FaVolumeUp className="text-sm" />
          </button>
          <button className="px-2 py-1 rounded hover:bg-white/10 transition-colors flex items-center gap-1" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'battery' ? null : 'battery'); }}>
            <BsBatteryFull className="text-base" />
            <span className="text-xs">100%</span>
          </button>
          <button className="px-2 py-1 rounded hover:bg-white/10 transition-colors flex items-center gap-1" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'brightness' ? null : 'brightness'); }}>
            <MdBrightness6 className="text-sm" />
          </button>
          <button className="px-2 py-1 rounded hover:bg-white/10 transition-colors" onClick={(e) => { e.stopPropagation(); setSpotlightOpen(true); }}>
            <FiSearch className="text-sm" />
          </button>
          <button className="px-2 py-1 rounded hover:bg-white/10 transition-colors" onClick={(e) => { e.stopPropagation(); setShowNotificationCenter(!showNotificationCenter); }}>
            <FiBell className="text-sm" />
          </button>
          <button className="px-2 py-1 rounded hover:bg-white/10 transition-colors" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'controlcenter' ? null : 'controlcenter'); }}>
            <BsGrid3X3Gap className="text-sm" />
          </button>
          <div className="px-2 py-1 text-xs font-medium">{currentTime}</div>
        </div>
      </div>
      {activeMenu === 'apple' && (
        <div className="absolute top-7 left-4 w-56 bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/10 z-50 py-2 text-white text-sm" onClick={(e) => e.stopPropagation()}>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">About This Mac</button>
          <div className="h-px bg-white/10 my-2"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">System Preferences...</button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">App Store...</button>
          <div className="h-px bg-white/10 my-2"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Recent Items</button>
          <div className="h-px bg-white/10 my-2"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Sleep</button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Restart...</button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Shut Down...</button>
        </div>
      )}
      {activeMenu === 'file' && (
        <div className="absolute top-7 left-[180px] w-56 bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/10 z-50 py-2 text-white text-sm" onClick={(e) => e.stopPropagation()}>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">New Finder Window <span className="float-right text-white/50">⌘N</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">New Folder <span className="float-right text-white/50">⇧⌘N</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">New Smart Folder</button>
          <div className="h-px bg-white/10 my-2"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Open <span className="float-right text-white/50">⌘O</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Close Window <span className="float-right text-white/50">⌘W</span></button>
        </div>
      )}
      {activeMenu === 'view' && (
        <div className="absolute top-7 left-[310px] w-56 bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/10 z-50 py-2 text-white text-sm" onClick={(e) => e.stopPropagation()}>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">as Icons <span className="float-right text-white/50">⌘1</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">as List <span className="float-right text-white/50">⌘2</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">as Columns <span className="float-right text-white/50">⌘3</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">as Gallery <span className="float-right text-white/50">⌘4</span></button>
          <div className="h-px bg-white/10 my-2"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Show Preview</button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Show Toolbar</button>
        </div>
      )}
      {activeMenu === 'edit' && (
        <div className="absolute top-7 left-[255px] w-56 bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/10 z-50 py-2 text-white text-sm" onClick={(e) => e.stopPropagation()}>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500 text-white/40 cursor-default">Undo <span className="float-right">⌘Z</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500 text-white/40 cursor-default">Redo <span className="float-right">⇧⌘Z</span></button>
          <div className="h-px bg-white/10 my-2"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Cut <span className="float-right text-white/50">⌘X</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Copy <span className="float-right text-white/50">⌘C</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Paste <span className="float-right text-white/50">⌘V</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Select All <span className="float-right text-white/50">⌘A</span></button>
          <div className="h-px bg-white/10 my-2"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Find <span className="float-right text-white/50">⌘F</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Find and Replace <span className="float-right text-white/50">⌥⌘F</span></button>
        </div>
      )}
      {activeMenu === 'go' && (
        <div className="absolute top-7 left-[360px] w-56 bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/10 z-50 py-2 text-white text-sm" onClick={(e) => e.stopPropagation()}>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Back <span className="float-right text-white/50">⌘[</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Forward <span className="float-right text-white/50">⌘]</span></button>
          <div className="h-px bg-white/10 my-2"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Computer <span className="float-right text-white/50">⇧⌘C</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Home <span className="float-right text-white/50">⇧⌘H</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Desktop <span className="float-right text-white/50">⇧⌘D</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Downloads <span className="float-right text-white/50">⌥⌘L</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Applications <span className="float-right text-white/50">⇧⌘A</span></button>
          <div className="h-px bg-white/10 my-2"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Go to Folder… <span className="float-right text-white/50">⇧⌘G</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Connect to Server… <span className="float-right text-white/50">⌘K</span></button>
        </div>
      )}
      {activeMenu === 'window' && (
        <div className="absolute top-7 left-[420px] w-56 bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/10 z-50 py-2 text-white text-sm" onClick={(e) => e.stopPropagation()}>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Minimize <span className="float-right text-white/50">⌘M</span></button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Zoom</button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Tile Window to Left</button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Tile Window to Right</button>
          <div className="h-px bg-white/10 my-2"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Bring All to Front</button>
          <div className="h-px bg-white/10 my-2"></div>
          {openWindows.length === 0
            ? <div className="px-4 py-2 text-white/40 text-xs">No open windows</div>
            : openWindows.map(id => {
                const folder = folders.find(f => f.id === id);
                return folder ? (
                  <button key={id} className="w-full text-left px-4 py-2 hover:bg-blue-500 flex items-center gap-2" onClick={() => handleRestoreWindow(id)}>
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                    {folder.label}
                  </button>
                ) : null;
              })
          }
        </div>
      )}
      {activeMenu === 'help' && (
        <div className="absolute top-7 left-[490px] w-64 bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/10 z-50 py-2 text-white text-sm" onClick={(e) => e.stopPropagation()}>
          <div className="px-3 pb-2">
            <div className="flex items-center gap-2 bg-white/10 rounded-md px-3 py-1.5">
              <FiSearch className="text-white/50 text-sm" />
              <input type="text" placeholder="Search" className="bg-transparent text-white text-sm outline-none placeholder-white/40 w-full" />
            </div>
          </div>
          <div className="h-px bg-white/10 my-1"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Help Center</button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Portfolio Help</button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Keyboard Shortcuts</button>
          <div className="h-px bg-white/10 my-2"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Send Feedback…</button>
        </div>
      )}
      {/* Right-side system tray dropdowns */}
      {activeMenu === 'wifi' && (
        <div className="absolute top-7 right-[200px] w-72 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 py-3 text-white text-sm" onClick={(e) => e.stopPropagation()}>
          <div className="px-4 pb-2 flex items-center justify-between">
            <span className="font-semibold text-base">Wi-Fi</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50">{wifiOn ? 'On' : 'Off'}</span>
              <button onClick={handleWifiToggle} className={`w-10 h-5 rounded-full relative transition-colors ${wifiOn ? 'bg-green-500' : 'bg-white/20'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${wifiOn ? 'right-0.5' : 'left-0.5'}`}></div>
              </button>
            </div>
          </div>
          <div className="h-px bg-white/10 mx-4 mb-2"></div>
          {!wifiOn ? (
            <div className="px-4 py-6 text-center text-white/40 text-xs">Wi-Fi is turned off</div>
          ) : scanningWifi ? (
            <div className="px-4 py-6 text-center">
              <div className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mb-2"></div>
              <div className="text-xs text-white/50">Scanning for networks…</div>
            </div>
          ) : (
            <div className="px-2">
              {connectedNetwork && (
                <>
                  <div className="px-2 py-1 text-xs text-white/50 uppercase tracking-wider">Connected</div>
                  <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-white/10 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400">✓</span>
                      <span className="font-medium">{connectedNetwork}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {wifiNetworks.find(n => n.name === connectedNetwork)?.lock && <span className="text-xs">🔒</span>}
                      <WifiSignal bars={wifiNetworks.find(n => n.name === connectedNetwork)?.signal ?? 3} active />
                    </div>
                  </div>
                </>
              )}
              <div className="px-2 py-1 text-xs text-white/50 uppercase tracking-wider mt-1">Other Networks</div>
              {wifiNetworks.filter(n => n.name !== connectedNetwork).map(net => (
                <button key={net.name} onClick={() => handleConnectNetwork(net.name)} className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-white/10">
                  <span>{net.name}</span>
                  <div className="flex items-center gap-1 text-white/50">
                    {net.lock && <span className="text-xs">🔒</span>}
                    <WifiSignal bars={net.signal} active={false} />
                  </div>
                </button>
              ))}
            </div>
          )}
          <div className="h-px bg-white/10 mx-4 my-2"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-white/10 text-blue-400">Network Preferences…</button>
        </div>
      )}
      {activeMenu === 'bluetooth' && (
        <div className="absolute top-7 right-[160px] w-72 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 py-3 text-white text-sm" onClick={(e) => e.stopPropagation()}>
          <div className="px-4 pb-2 flex items-center justify-between">
            <span className="font-semibold text-base">Bluetooth</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/50">{btSupported ? 'On' : 'N/A'}</span>
              <div className={`w-10 h-5 rounded-full relative ${btSupported ? 'bg-blue-500' : 'bg-white/20'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow ${btSupported ? 'right-0.5' : 'left-0.5'}`}></div>
              </div>
            </div>
          </div>
          <div className="h-px bg-white/10 mx-4 mb-3"></div>
          {!btSupported ? (
            <div className="px-4 py-4 text-center">
              <FiBluetooth className="text-3xl text-white/20 mx-auto mb-2" />
              <div className="text-xs text-white/40">Bluetooth not supported in this browser</div>
            </div>
          ) : (
            <div className="px-4 space-y-3">
              {btDevices.length > 0 && (
                <div>
                  <div className="text-xs text-white/50 uppercase tracking-wider mb-2">Paired Devices</div>
                  {btDevices.map(dev => (
                    <div key={dev.id} className="flex items-center gap-3 p-2 rounded-xl bg-blue-500/20 border border-blue-500/30 mb-1">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiBluetooth className="text-white text-sm" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{dev.name}</div>
                        <div className="text-xs text-blue-400">Connected</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={handleBtScan}
                disabled={btScanning}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                {btScanning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-sm">Scanning…</span>
                  </>
                ) : (
                  <>
                    <FiBluetooth className="text-sm" />
                    <span className="text-sm">Scan for Devices</span>
                  </>
                )}
              </button>
              <div className="text-xs text-white/30 text-center">
                Opens browser&apos;s Bluetooth device picker
              </div>
            </div>
          )}
          <div className="h-px bg-white/10 mx-4 my-3"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-white/10 text-blue-400">Bluetooth Preferences…</button>
        </div>
      )}
      {activeMenu === 'volume' && (
        <div className="absolute top-7 right-[120px] w-64 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 py-3 text-white text-sm" onClick={(e) => e.stopPropagation()}>
          <div className="px-4 pb-2">
            <span className="font-semibold text-base">Sound</span>
          </div>
          <div className="h-px bg-white/10 mx-4 mb-3"></div>
          <div className="px-4 space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-xs text-white/50">Output Volume</div>
                <span className="text-xs text-white/70">{volume}%</span>
              </div>
              <div className="flex items-center gap-2">
                <FaVolumeUp className="text-white/40 text-xs flex-shrink-0" />
                <input
                  type="range" min={0} max={100} value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, white ${volume}%, rgba(255,255,255,0.2) ${volume}%)` }}
                />
                <FaVolumeUp className="text-white text-base flex-shrink-0" />
              </div>
            </div>
            <div className="h-px bg-white/10"></div>
            <div>
              <div className="text-xs text-white/50 mb-2">Output Device</div>
              {[
                { name: 'MacBook Pro Speakers', active: true },
                { name: 'AirPods Pro', active: false },
                { name: 'HDMI Output', active: false },
              ].map(dev => (
                <button key={dev.name} className="w-full flex items-center gap-2 py-1.5 hover:text-blue-400">
                  {dev.active ? <span className="text-blue-400">✓</span> : <span className="w-4"></span>}
                  <span className="text-sm">{dev.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="h-px bg-white/10 mx-4 my-2"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-white/10 text-blue-400">Sound Preferences…</button>
        </div>
      )}
      {activeMenu === 'battery' && (
        <div className="absolute top-7 right-[80px] w-64 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 py-3 text-white text-sm" onClick={(e) => e.stopPropagation()}>
          <div className="px-4 pb-2 flex items-center gap-3">
            <BsBatteryFull className="text-2xl text-green-400" />
            <div>
              <div className="font-semibold text-base">100%</div>
              <div className="text-xs text-green-400">Fully Charged</div>
            </div>
          </div>
          <div className="h-px bg-white/10 mx-4 mb-2"></div>
          <div className="px-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Power Adapter</span>
              <span className="text-green-400">Connected</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Condition</span>
              <span>Normal</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/50">Cycle Count</span>
              <span>42</span>
            </div>
          </div>
          <div className="h-px bg-white/10 mx-4 my-2"></div>
          <div className="px-4 py-1">
            <div className="text-xs text-white/50 mb-2">Recent Usage</div>
            <div className="flex items-end gap-1 h-8">
              {[60, 80, 70, 90, 85, 95, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-green-500/60 rounded-sm" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>
          <div className="h-px bg-white/10 mx-4 my-2"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-white/10 text-blue-400">Battery Preferences…</button>
        </div>
      )}
      {activeMenu === 'brightness' && (
        <div className="absolute top-7 right-[50px] w-64 bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 z-50 py-3 text-white text-sm" onClick={(e) => e.stopPropagation()}>
          <div className="px-4 pb-2">
            <span className="font-semibold text-base">Display</span>
          </div>
          <div className="h-px bg-white/10 mx-4 mb-3"></div>
          <div className="px-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-xs text-white/50">Brightness</div>
                <span className="text-xs text-white/70">{brightness}%</span>
              </div>
              <div className="flex items-center gap-2">
                <MdBrightness6 className="text-white/40 text-sm flex-shrink-0" />
                <input
                  type="range" min={10} max={100} value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, white ${brightness}%, rgba(255,255,255,0.2) ${brightness}%)` }}
                />
                <MdBrightness6 className="text-white text-lg flex-shrink-0" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">True Tone</span>
              <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Night Shift</span>
              <div className="w-10 h-5 bg-white/20 rounded-full relative cursor-pointer">
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow"></div>
              </div>
            </div>
          </div>
          <div className="h-px bg-white/10 mx-4 my-2"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-white/10 text-blue-400">Display Preferences…</button>
        </div>
      )}
      {activeMenu === 'controlcenter' && (
        <div className="absolute top-7 right-2 w-80 bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 z-50 p-3 text-white" onClick={(e) => e.stopPropagation()}>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button onClick={handleWifiToggle} className={`rounded-xl p-3 cursor-pointer text-left transition-colors ${wifiOn ? 'bg-blue-500/30 hover:bg-blue-500/40' : 'bg-white/10 hover:bg-white/20'}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${wifiOn ? 'bg-blue-500' : 'bg-white/20'}`}>
                  <FaWifi className="text-white text-xs" />
                </div>
                <span className="text-sm font-medium">Wi-Fi</span>
              </div>
              <div className="text-xs text-white/50">{wifiOn ? (connectedNetwork || 'On') : 'Off'}</div>
            </button>
            <div className="bg-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
                  <FiBluetooth className="text-white text-xs" />
                </div>
                <span className="text-sm font-medium">Bluetooth</span>
              </div>
              <div className="text-xs text-white/50">On · 3 devices</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
                  <FiSearch className="text-white text-xs" />
                </div>
                <span className="text-sm font-medium">AirDrop</span>
              </div>
              <div className="text-xs text-white/50">Contacts Only</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 cursor-pointer hover:bg-white/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center">
                  <FiBell className="text-white text-xs" />
                </div>
                <span className="text-sm font-medium">Focus</span>
              </div>
              <div className="text-xs text-white/50">Off</div>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 mb-2 space-y-3">
            <div className="flex items-center gap-2">
              <MdBrightness6 className="text-white/60 text-sm flex-shrink-0" />
              <input type="range" min={10} max={100} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))}
                className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, white ${brightness}%, rgba(255,255,255,0.2) ${brightness}%)` }} />
              <span className="text-xs text-white/50 w-8 text-right">{brightness}%</span>
            </div>
            <div className="flex items-center gap-2">
              <FaVolumeUp className="text-white/60 text-sm flex-shrink-0" />
              <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))}
                className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, white ${volume}%, rgba(255,255,255,0.2) ${volume}%)` }} />
              <span className="text-xs text-white/50 w-8 text-right">{volume}%</span>
            </div>
          </div>
          <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BsBatteryFull className="text-green-400 text-lg" />
              <span className="text-sm">Battery</span>
            </div>
            <span className="text-sm text-green-400 font-medium">100%</span>
          </div>
        </div>
      )}
      {contextMenu && (
        <div className="absolute w-56 bg-gray-800/95 backdrop-blur-xl rounded-lg shadow-2xl border border-white/10 z-50 py-2 text-white text-sm" style={{ top: contextMenu.y, left: contextMenu.x }} onClick={(e) => e.stopPropagation()}>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500" onClick={() => { if (contextMenu.target) handleFolderDoubleClick(contextMenu.target); setContextMenu(null); }}>Open</button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Get Info <span className="float-right text-white/50">⌘I</span></button>
          <div className="h-px bg-white/10 my-2"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Rename</button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Compress</button>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500">Duplicate</button>
          <div className="h-px bg-white/10 my-2"></div>
          <button className="w-full text-left px-4 py-2 hover:bg-blue-500 text-red-400">Move to Trash</button>
        </div>
      )}
      {spotlightOpen && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] bg-gray-800/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="p-4">
            <input type="text" placeholder="Spotlight Search" className="w-full bg-transparent text-white text-2xl outline-none placeholder-white/50" value={spotlightQuery} onChange={(e) => handleSpotlightSearch(e.target.value)} autoFocus />
          </div>
          {spotlightQuery && (
            <div className="border-t border-white/10 max-h-96 overflow-y-auto">
              {getSpotlightResults().map((result) => (
                <button key={result.id} className="w-full text-left px-4 py-3 hover:bg-blue-500 flex items-center gap-3 text-white" onClick={() => { handleFolderDoubleClick(result.id); setSpotlightOpen(false); setSpotlightQuery(''); }}>
                  <DockIcon gradient={result.gradient} size={36}><result.Icon /></DockIcon>
                  <div>
                    <div className="font-medium">{result.label}</div>
                    <div className="text-xs text-white/50">Application</div>
                  </div>
                </button>
              ))}
              {getSpotlightResults().length === 0 && <div className="px-4 py-8 text-center text-white/50">No results found</div>}
            </div>
          )}
        </div>
      )}
      {showNotificationCenter && (
        <div className="absolute top-7 right-4 w-80 h-[500px] bg-gray-800/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-semibold">Notification Center</h3>
          </div>
          <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-60px)]">
            <div className="text-center text-white/50 py-8">No new notifications</div>
          </div>
        </div>
      )}
      <div className="absolute top-7 left-0 right-0 bottom-20 z-10 p-4">
        {folders.map((folder) => (
          <div key={folder.id} className="absolute cursor-pointer group" style={folder.position} onClick={(e) => { e.stopPropagation(); handleFolderClick(folder.id); }} onDoubleClick={() => handleFolderDoubleClick(folder.id)} onContextMenu={(e) => handleContextMenu(e, folder.id)}>
            <div className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${selectedFolder === folder.id ? 'bg-white/20 backdrop-blur-sm ring-1 ring-white/40' : ''}`}>
              <div className="group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-150 drop-shadow-2xl">
                <DockIcon gradient={folder.gradient} size={64}>
                  <folder.Icon />
                </DockIcon>
              </div>
              <span className="text-xs font-medium text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] text-center max-w-[90px] truncate mt-1">{folder.label}</span>
            </div>
          </div>
        ))}
      </div>
      {openWindows.map((windowId, index) => {
        const isMinimized = minimizedWindows.includes(windowId);
        if (isMinimized) return null;
        
        return (
          <MacWindow 
            key={windowId} 
            title={`${folders.find(f => f.id === windowId)?.label || 'Portfolio'}`} 
            onClose={() => handleCloseWindow(windowId)}
            onMinimize={() => handleMinimizeWindow(windowId)}
            style={{ top: `${100 + index * 30}px`, left: `${300 + index * 30}px` }}
          >
            <div className="h-full overflow-y-auto bg-white dark:bg-gray-900 p-8">{renderSection(windowId)}</div>
          </MacWindow>
        );
      })}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl px-2 py-2 shadow-2xl border border-white/20">
          <div className="flex items-end gap-1">
            {dockApps.map((app) => {
              if (app.action === 'divider') return <div key={app.id} className="w-px h-10 bg-white/20 mx-1 self-center"></div>;
              const isOpen = openWindows.includes(app.id);
              const isMinimized = minimizedWindows.includes(app.id);
              return (
                <button key={app.id} onClick={() => handleDockClick(app)} onContextMenu={(e) => handleContextMenu(e, app.id)} className="relative group flex flex-col items-center pb-1" title={app.label}>
                  <div className={`hover:scale-125 hover:-translate-y-3 transition-all duration-150 drop-shadow-xl ${isMinimized ? 'opacity-60' : ''}`}>
                    <DockIcon gradient={app.gradient} size={52}>
                      <app.Icon />
                    </DockIcon>
                  </div>
                  {isOpen && (
                    <div className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isMinimized ? 'bg-yellow-400' : 'bg-white'}`}></div>
                  )}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 bg-gray-900/90 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">{app.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
