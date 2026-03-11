'use client';

import { ReactNode } from 'react';

interface MacWindowProps {
  children: ReactNode;
  title?: string;
}

export default function MacWindow({ children, title = 'Portfolio' }: MacWindowProps) {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-7xl h-[90vh] bg-white/95 dark:bg-gray-900/95 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl border border-gray-200/20">
        {/* macOS Title Bar */}
        <div className="h-12 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4">
          {/* Traffic Lights */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer"></div>
          </div>
          {/* Title */}
          <div className="flex-1 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </div>
        </div>
        
        {/* Content Area */}
        <div className="h-[calc(100%-3rem)] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
