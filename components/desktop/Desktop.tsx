'use client';

import React, { useEffect, useRef } from 'react';
import { useOSStore } from '@/lib/store/os.store';
import { Taskbar } from './Taskbar';
import { Dock } from './Dock';
import { WindowManager } from './WindowManager';
import { CommandPalette } from '@/components/command-palette/CommandPalette';
import { sounds } from '@/lib/utils';

export const Desktop: React.FC = () => {
  const {
    openApp,
    toggleCommandPalette,
    setIsMobile,
    discoverEasterEgg,
  } = useOSStore();

  const konamiRef = useRef<string[]>([]);
  const KONAMI_CODE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }

      konamiRef.current.push(e.key);
      if (konamiRef.current.length > KONAMI_CODE.length) {
        konamiRef.current.shift();
      }

      if (
        konamiRef.current.length === KONAMI_CODE.length &&
        konamiRef.current.every((k, i) => k.toLowerCase() === KONAMI_CODE[i].toLowerCase())
      ) {
        discoverEasterEgg('konamiCode');
        sounds.playBootChord();
        openApp('secret');
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);

    // Default open the about app on initial desktop mount
    const timer = setTimeout(() => {
      openApp('about');
    }, 250);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('keydown', handleGlobalKeyDown);
      clearTimeout(timer);
    };
  }, [openApp, toggleCommandPalette, setIsMobile, discoverEasterEgg]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#07080c] select-none">
      {/* Background Ambience & Engineering Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-16 right-16 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top System Bar */}
      <Taskbar />

      {/* Windows Layer */}
      <WindowManager />

      {/* Bottom Application Dock */}
      <Dock />

      {/* Global Command Palette */}
      <CommandPalette />
    </div>
  );
};
