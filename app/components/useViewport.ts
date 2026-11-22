'use client';
import { useEffect, useState } from 'react';

/** Below this width the desktop switches to its phone layout. */
const PHONE_MAX = 640;

interface Viewport {
  width: number;
  height: number;
  /** Primary input is touch (phones, tablets) — open items with a single tap. */
  touch: boolean;
  phone: boolean;
}

// Matches the server render (desktop) so hydration stays stable; real values arrive after mount.
const DEFAULT: Viewport = { width: 1440, height: 900, touch: false, phone: false };

function read(): Viewport {
  const width = window.innerWidth;
  return {
    width,
    height: window.innerHeight,
    touch: window.matchMedia('(pointer: coarse)').matches,
    phone: width < PHONE_MAX,
  };
}

/**
 * Current viewport size.
 * @param clientOnly pass `true` in components that never render on the server (e.g. windows
 *   opened after load) to get real values on the very first render, with no layout flash.
 */
export function useViewport(clientOnly = false): Viewport {
  const [vp, setVp] = useState<Viewport>(() => (clientOnly && typeof window !== 'undefined' ? read() : DEFAULT));

  useEffect(() => {
    const update = () => setVp(read());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return vp;
}
