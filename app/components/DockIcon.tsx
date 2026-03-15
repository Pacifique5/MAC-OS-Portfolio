'use client';

import { ReactNode } from 'react';

interface DockIconProps {
  gradient: string[];
  children: ReactNode;
  size?: number;
}

export default function DockIcon({ gradient, children, size = 56 }: DockIconProps) {
  const [from, , to] = gradient;
  return (
    <div
      style={{
        width: size,
        height: size,
        background: `linear-gradient(145deg, ${from}, ${to})`,
        borderRadius: '22%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25)',
      }}
    >
      {/* top gloss */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.28), rgba(255,255,255,0))',
        borderRadius: '22% 22% 0 0',
        pointerEvents: 'none',
      }} />
      {/* icon */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.round(size * 0.52),
        lineHeight: 1,
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
      }}>
        {children}
      </div>
    </div>
  );
}
