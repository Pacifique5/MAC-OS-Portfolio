'use client';
import { useState, useEffect } from 'react';
import MacWindow from './components/MacWindow';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Experience from './components/sections/Experience';
import Testimonials from './components/sections/Testimonials';
import Contact from './components/sections/Contact';
const folders = [
  { id: 'about', label: 'About Me', icon: '👤', position: { top: '80px', left: '30px' } },
  { id: 'projects', label: 'Projects', icon: '💼', position: { top: '80px', left: '150px' } },
  { id: 'skills', label: 'Skills', icon: '⚡', position: { top: '230px', left: '30px' } },
  { id: 'experience', label: 'Experience', icon: '🎓', position: { top: '230px', left: '150px' } },
  { id: 'testimonials', label: 'Testimonials', icon: '💬', position: { top: '380px', left: '30px' } },
  { id: 'contact', label: 'Contact', icon: '📧', position: { top: '380px', left: '150px' } },
];
const dockApps = [
  { id: 'finder', icon: '🔍', label: 'Finder', color: 'from-blue-400 to-blue-600' },
  { id: 'about', icon: '👤', label: 'About Me', color: 'from-purple-400 to-purple-600' },
  { id: 'projects', icon: '💼', label: 'Projects', color: 'from-orange-400 to-orange-600' },
  { id: 'skills', icon: '⚡', label: 'Skills', color: 'from-yellow-400 to-yellow-600' },
  { id: 'experience', icon: '🎓', label: 'Experience', color: 'from-green-400 to-green-600' },
  { id: 'testimonials', icon: '💬', label: 'Testimonials', color: 'from-pink-400 to-pink-600' },
  { id: 'contact', icon: '📧', label: 'Contact', color: 'from-red-400 to-red-600' },
  { id: 'divider', icon: '', label: '', color: '' },
  { id: 'trash', icon: '🗑️', label: 'Trash', color: 'from-gray-400 to-gray-600' },
];
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

  const handleDockClick = (appId: string) => {
    if (['about', 'projects', 'skills', 'experience', 'testimonials', 'contact'].includes(appId)) {
      if (minimizedWindows.includes(appId)) {
        // Restore minimized window
        handleRestoreWindow(appId);
      } else if (!openWindows.includes(appId)) {
        // Open new window
        setOpenWindows([...openWindows, appId]);
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
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700/30 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-700/30 via-transparent to-transparent"></div>
      </div>
      <div className="absolute top-0 left-0 right-0 h-7 bg-black/30 backdrop-blur-2xl border-b border-white/10 z-50 flex items-center justify-between px-4 text-white text-sm">
        <div className="flex items-center gap-6">
          <button className="font-bold hover:bg-white/10 px-2 py-1 rounded" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'apple' ? null : 'apple'); }}>🍎</button>
          <button className="font-semibold hover:bg-white/10 px-2 py-1 rounded" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'finder' ? null : 'finder'); }}>Finder</button>
          <button className="text-white/80 hover:bg-white/10 px-2 py-1 rounded" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'file' ? null : 'file'); }}>File</button>
          <button className="text-white/80 hover:bg-white/10 px-2 py-1 rounded" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'edit' ? null : 'edit'); }}>Edit</button>
          <button className="text-white/80 hover:bg-white/10 px-2 py-1 rounded" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'view' ? null : 'view'); }}>View</button>
          <button className="text-white/80 hover:bg-white/10 px-2 py-1 rounded" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'go' ? null : 'go'); }}>Go</button>
          <button className="text-white/80 hover:bg-white/10 px-2 py-1 rounded" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'window' ? null : 'window'); }}>Window</button>
          <button className="text-white/80 hover:bg-white/10 px-2 py-1 rounded" onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'help' ? null : 'help'); }}>Help</button>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-white/80 hover:bg-white/10 px-2 py-1 rounded">🔋</button>
          <button className="text-white/80 hover:bg-white/10 px-2 py-1 rounded">📶</button>
          <button className="text-white/80 hover:bg-white/10 px-2 py-1 rounded" onClick={(e) => { e.stopPropagation(); setSpotlightOpen(true); }}>🔍</button>
          <button className="text-white/80 hover:bg-white/10 px-2 py-1 rounded" onClick={(e) => { e.stopPropagation(); setShowNotificationCenter(!showNotificationCenter); }}>🔔</button>
          <div className="text-xs font-medium">{currentTime}</div>
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
                  <span className="text-2xl">{result.icon}</span>
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
            <div className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${selectedFolder === folder.id ? 'bg-blue-500/40 backdrop-blur-sm' : ''}`}>
              <div className="relative w-16 h-16 group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-lg">
                  <defs>
                    <linearGradient id={`folder-${folder.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#5DADE2" />
                      <stop offset="100%" stopColor="#3498DB" />
                    </linearGradient>
                  </defs>
                  <path d="M 4 12 L 4 52 C 4 54 6 56 8 56 L 56 56 C 58 56 60 54 60 52 L 60 20 C 60 18 58 16 56 16 L 28 16 L 24 12 Z" fill={`url(#folder-${folder.id})`} />
                  <path d="M 4 12 L 24 12 L 28 16 L 60 16 L 60 20 L 4 20 Z" fill="#5DADE2" opacity="0.8" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl pt-2">{folder.icon}</div>
              </div>
              <span className="text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-center max-w-[90px] truncate">{folder.label}</span>
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
              if (app.id === 'divider') return <div key="divider" className="w-px h-12 bg-white/30 mx-1"></div>;
              const isOpen = openWindows.includes(app.id);
              const isMinimized = minimizedWindows.includes(app.id);
              
              return (
                <button key={app.id} onClick={() => handleDockClick(app.id)} onContextMenu={(e) => handleContextMenu(e, app.id)} className="relative group" title={app.label}>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-b ${app.color} backdrop-blur-sm shadow-lg hover:scale-125 hover:-translate-y-2 transition-all duration-200 flex items-center justify-center text-3xl border border-white/20 ${isMinimized ? 'opacity-60' : ''}`}>{app.icon}</div>
                  {isOpen && <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isMinimized ? 'bg-yellow-400' : 'bg-white'}`}></div>}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">{app.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
