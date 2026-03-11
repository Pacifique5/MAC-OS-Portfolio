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
  { id: 'finder', icon: '🔍', label: 'Finder' },
  { id: 'about', icon: '👤', label: 'About Me' },
  { id: 'projects', icon: '💼', label: 'Projects' },
  { id: 'skills', icon: '⚡', label: 'Skills' },
  { id: 'experience', icon: '🎓', label: 'Experience' },
  { id: 'testimonials', icon: '💬', label: 'Testimonials' },
  { id: 'contact', icon: '📧', label: 'Contact' },
  { id: 'divider', icon: '', label: '' },
  { id: 'trash', icon: '🗑️', label: 'Trash' },
];

export default function Home() {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      const date = now.toLocaleDateString('en-US', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
      setCurrentTime(`${date} ${time}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleFolderClick = (folderId: string) => {
    setSelectedFolder(folderId);
  };

  const handleFolderDoubleClick = (folderId: string) => {
    if (!openWindows.includes(folderId)) {
      setOpenWindows([...openWindows, folderId]);
    }
  };

  const handleCloseWindow = (folderId: string) => {
    setOpenWindows(openWindows.filter(id => id !== folderId));
  };

  const handleDockClick = (appId: string) => {
    if (['about', 'projects', 'skills', 'experience', 'testimonials', 'contact'].includes(appId)) {
      if (!openWindows.includes(appId)) {
        setOpenWindows([...openWindows, appId]);
      }
    }
  };

  const renderSection = (section: string) => {
    switch (section) {
      case 'about':
        return <About />;
      case 'projects':
        return <Projects />;
      case 'skills':
        return <Skills />;
      case 'experience':
        return <Experience />;
      case 'testimonials':
        return <Testimonials />;
      case 'contact':
        return <Contact />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden select-none">
      {/* macOS Desktop Background - Default Big Sur style */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700/30 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-700/30 via-transparent to-transparent"></div>
      </div>

      {/* macOS Menu Bar */}
      <div className="absolute top-0 left-0 right-0 h-7 bg-black/30 backdrop-blur-2xl border-b border-white/10 z-50 flex items-center justify-between px-4 text-white text-sm">
        <div className="flex items-center gap-6">
          <div className="font-bold">🍎</div>
          <div className="font-semibold">Finder</div>
          <div className="text-white/80 hover:text-white cursor-pointer">File</div>
          <div className="text-white/80 hover:text-white cursor-pointer">Edit</div>
          <div className="text-white/80 hover:text-white cursor-pointer">View</div>
          <div className="text-white/80 hover:text-white cursor-pointer">Go</div>
          <div className="text-white/80 hover:text-white cursor-pointer">Window</div>
          <div className="text-white/80 hover:text-white cursor-pointer">Help</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-white/80">🔋</div>
          <div className="text-white/80">📶</div>
          <div className="text-white/80">🔍</div>
          <div className="text-xs font-medium">{currentTime}</div>
        </div>
      </div>

      {/* Desktop Icons/Folders */}
      <div className="absolute top-7 left-0 right-0 bottom-20 z-10 p-4">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="absolute cursor-pointer group"
            style={folder.position}
            onClick={() => handleFolderClick(folder.id)}
            onDoubleClick={() => handleFolderDoubleClick(folder.id)}
          >
            <div className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
              selectedFolder === folder.id ? 'bg-blue-500/40 backdrop-blur-sm' : ''
            }`}>
              {/* Folder Icon */}
              <div className="relative w-16 h-16 group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-lg">
                  <defs>
                    <linearGradient id={`folder-${folder.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#5DADE2" />
                      <stop offset="100%" stopColor="#3498DB" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 4 12 L 4 52 C 4 54 6 56 8 56 L 56 56 C 58 56 60 54 60 52 L 60 20 C 60 18 58 16 56 16 L 28 16 L 24 12 Z"
                    fill={`url(#folder-${folder.id})`}
                  />
                  <path
                    d="M 4 12 L 24 12 L 28 16 L 60 16 L 60 20 L 4 20 Z"
                    fill="#5DADE2"
                    opacity="0.8"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl pt-2">
                  {folder.icon}
                </div>
              </div>
              {/* Folder Label */}
              <span className="text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-center max-w-[90px] truncate">
                {folder.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Open Windows */}
      {openWindows.map((windowId, index) => (
        <MacWindow
          key={windowId}
          title={`${folders.find(f => f.id === windowId)?.label || 'Portfolio'}`}
          onClose={() => handleCloseWindow(windowId)}
          style={{
            top: `${100 + index * 30}px`,
            left: `${300 + index * 30}px`,
          }}
        >
          <div className="h-full overflow-y-auto bg-white dark:bg-gray-900 p-8">
            {renderSection(windowId)}
          </div>
        </MacWindow>
      ))}

      {/* macOS Dock */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-white/10 backdrop-blur-2xl rounded-2xl px-2 py-2 shadow-2xl border border-white/20">
          <div className="flex items-end gap-1">
            {dockApps.map((app) => {
              if (app.id === 'divider') {
                return <div key="divider" className="w-px h-12 bg-white/30 mx-1"></div>;
              }
              return (
                <button
                  key={app.id}
                  onClick={() => handleDockClick(app.id)}
                  className="relative group"
                  title={app.label}
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-white/20 to-white/5 backdrop-blur-sm shadow-lg hover:scale-125 hover:-translate-y-2 transition-all duration-200 flex items-center justify-center text-3xl border border-white/20">
                    {app.icon}
                  </div>
                  {openWindows.includes(app.id) && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
