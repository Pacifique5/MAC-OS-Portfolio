'use client';

import { useState } from 'react';

interface FolderNavProps {
  onNavigate: (section: string) => void;
  activeSection: string;
}

const folders = [
  { id: 'about', label: 'About', icon: '👤' },
  { id: 'projects', label: 'Projects', icon: '💼' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'experience', label: 'Experience', icon: '🎓' },
  { id: 'testimonials', label: 'Testimonials', icon: '💬' },
  { id: 'contact', label: 'Contact', icon: '📧' },
];

export default function FolderNav({ onNavigate, activeSection }: FolderNavProps) {
  return (
    <div className="h-full bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 w-48 p-4">
      <div className="space-y-2">
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onNavigate(folder.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeSection === folder.id
                ? 'bg-blue-500 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
          >
            <span className="text-2xl">{folder.icon}</span>
            <span className="text-sm font-medium">{folder.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
