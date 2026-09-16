'use client';

import React, { useState, useEffect } from 'react';
import { useOSStore, APP_CONFIGS } from '@/lib/store/os.store';
import { formatTime, formatDate, sounds } from '@/lib/utils';
import { Volume2, VolumeX, Command, Terminal, Sparkles, Activity } from 'lucide-react';
import type { AppId } from '@/types';

export const Taskbar: React.FC = () => {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  const {
    activeAppId,
    toggleCommandPalette,
    soundEnabled,
    toggleSound,
    openApp,
    discoverEasterEgg,
    easterEggs,
    windows,
    focusApp,
  } = useOSStore();

  useEffect(() => {
    setTime(formatTime());
    setDate(formatDate());
    const interval = setInterval(() => {
      setTime(formatTime());
      setDate(formatDate());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const totalEggs = Object.keys(easterEggs).length;
  const foundEggs = Object.values(easterEggs).filter(Boolean).length;

  return (
    <header className="h-12 w-full bg-[#0c0e14]/95 backdrop-blur-xl border-b border-white/[0.08] flex items-center justify-between px-4 sm:px-6 select-none z-[950] fixed top-0 left-0 right-0 shadow-lg shadow-black/20">
      {/* Left: Branding & Active App Context */}
      <div className="flex items-center space-x-2 sm:space-x-3 text-xs font-mono-code">
        <button
          onClick={() => {
            sounds.playClick(950);
            toggleCommandPalette();
          }}
          className="flex items-center space-x-2 px-2.5 py-1 rounded-lg hover:bg-white/[0.08] text-white transition-all cursor-pointer"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-dot" />
          <span className="font-extrabold tracking-wider text-xs sm:text-sm text-white">FIKER OS</span>
        </button>

        <span className="text-white/30">/</span>

        {/* Clean Active Application Context */}
        <div className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-xs font-bold text-white/90 uppercase tracking-wide">
          {activeAppId ? APP_CONFIGS[activeAppId].title.split('//')[0].trim() : 'PROJECTS'}
        </div>
      </div>

      {/* Right: Actions, Utilities, Audio, Time */}
      <div className="flex items-center space-x-2 sm:space-x-3 text-xs">
        {/* Secrets badge */}
        {foundEggs > 0 && (
          <button
            onClick={() => {
              discoverEasterEgg('systemInspect');
              openApp('terminal');
            }}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-400 text-xs font-mono-code transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{foundEggs}/{totalEggs} SECRETS</span>
          </button>
        )}

        {/* Command Center Button */}
        <button
          onClick={toggleCommandPalette}
          className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/[0.08] font-mono-code text-xs transition-colors"
          title="Command Palette (Cmd+K / Ctrl+K)"
        >
          <Command className="w-3.5 h-3.5 text-white/50" />
          <span>CMD+K</span>
        </button>

        {/* Audio Toggle Button */}
        <button
          onClick={toggleSound}
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/[0.08] transition-colors flex items-center space-x-1"
          title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-blue-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-white/40" />
          )}
        </button>

        {/* Date & Time Widget */}
        <div className="flex items-center space-x-2.5 pl-3 sm:pl-4 border-l border-white/[0.1] text-white font-mono-code">
          <span className="hidden lg:inline text-xs text-white/50">{date}</span>
          <span className="font-bold text-xs sm:text-sm tracking-wide text-white/95 px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.06]">
            {time}
          </span>
        </div>
      </div>
    </header>
  );
};
