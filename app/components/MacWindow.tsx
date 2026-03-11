'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';

interface MacWindowProps {
  children: ReactNode;
  title?: string;
  onClose?: () => void;
  onMinimize?: () => void;
  style?: React.CSSProperties;
}

export default function MacWindow({ children, title = 'Portfolio', onClose, onMinimize, style }: MacWindowProps) {
  const [position, setPosition] = useState(style || { top: '100px', left: '300px' });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousPosition, setPreviousPosition] = useState(style || { top: '100px', left: '300px' });
  const [previousSize, setPreviousSize] = useState({ width: '900px', height: '600px' });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowRef.current && !isMaximized) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  const handleMinimize = () => {
    if (onMinimize) {
      onMinimize();
    }
  };

  const handleMaximize = () => {
    if (!isMaximized) {
      // Save current position and size
      setPreviousPosition(position);
      setPreviousSize({ 
        width: windowRef.current?.style.width || '900px', 
        height: windowRef.current?.style.height || '600px' 
      });
      // Maximize
      setPosition({ top: '28px', left: '0px' });
      setIsMaximized(true);
    } else {
      // Restore
      setPosition(previousPosition);
      setIsMaximized(false);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        setPosition({
          top: `${e.clientY - dragOffset.y}px`,
          left: `${e.clientX - dragOffset.x}px`,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isMaximized]);

  return (
    <div
      ref={windowRef}
      className={`fixed bg-white/95 dark:bg-gray-900/95 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl border border-gray-200/20 z-40 transition-all duration-300 ${
        isMaximized ? 'w-full h-[calc(100vh-28px)] rounded-none' : 'w-[900px] h-[600px] animate-scale-in'
      }`}
      style={position}
    >
      {/* macOS Title Bar */}
      <div
        className="h-10 bg-gradient-to-b from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-300 dark:border-gray-600 flex items-center px-4 cursor-move group"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleMaximize}
      >
        {/* Traffic Lights */}
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); if (onClose) onClose(); }}
            className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF3B30] cursor-pointer transition-colors shadow-sm relative group/close"
            title="Close"
          >
            <span className="absolute inset-0 flex items-center justify-center text-[8px] text-black/60 opacity-0 group-hover/close:opacity-100">✕</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleMinimize(); }}
            className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FF9500] cursor-pointer transition-colors shadow-sm relative group/minimize"
            title="Minimize"
          >
            <span className="absolute inset-0 flex items-center justify-center text-[8px] text-black/60 opacity-0 group-hover/minimize:opacity-100">−</span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleMaximize(); }}
            className="w-3 h-3 rounded-full bg-[#28C840] hover:bg-[#00C957] cursor-pointer transition-colors shadow-sm relative group/maximize"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            <span className="absolute inset-0 flex items-center justify-center text-[8px] text-black/60 opacity-0 group-hover/maximize:opacity-100">
              {isMaximized ? '⤢' : '⤢'}
            </span>
          </button>
        </div>
        {/* Title */}
        <div className="flex-1 text-center text-sm font-medium text-gray-700 dark:text-gray-300 select-none">
          {title}
        </div>
        {/* Spacer for symmetry */}
        <div className="w-16"></div>
      </div>

      {/* Content Area */}
      <div className="h-[calc(100%-2.5rem)] overflow-hidden">
        {children}
      </div>
    </div>
  );
}
