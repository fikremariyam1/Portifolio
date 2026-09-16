'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/lib/store/os.store';
import { sounds } from '@/lib/utils';
import type { AppId } from '@/types';
import {
  FolderKanban,
  User,
  FlaskConical,
  Network,
  Gamepad2,
  Radio,
  Terminal,
  Sparkles,
} from 'lucide-react';

interface DockItemDef {
  id: AppId;
  label: string;
  icon: React.ElementType;
}

const DOCK_ITEMS: DockItemDef[] = [
  { id: 'about', label: 'ABOUT', icon: User },
  { id: 'projects', label: 'PROJECTS', icon: FolderKanban },
  { id: 'skills', label: 'SKILLS', icon: Network },
  { id: 'lab', label: 'LAB', icon: FlaskConical },
  { id: 'creative', label: 'GAMES', icon: Gamepad2 },
  { id: 'contact', label: 'CONTACT', icon: Radio },
  { id: 'terminal', label: 'TERMINAL', icon: Terminal },
];

export const Dock: React.FC = () => {
  const {
    windows,
    openApp,
    focusApp,
    minimizeApp,
    activeAppId,
    discoverEasterEgg,
    allEasterEggsUnlocked,
  } = useOSStore();

  const [hoveredApp, setHoveredApp] = useState<AppId | null>(null);
  const clickCountRef = useRef<number>(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleDockItemClick = (id: AppId) => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      if (clickCountRef.current >= 3) {
        discoverEasterEgg('dockTripleClick');
      }
      clickCountRef.current = 0;
    }, 450);

    const win = windows[id];
    if (!win.isOpen) {
      openApp(id);
    } else if (win.isMinimized) {
      focusApp(id);
    } else if (activeAppId === id) {
      minimizeApp(id);
    } else {
      focusApp(id);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[900] select-none">
      <motion.nav
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="glass-panel-elevated px-4 py-3 rounded-2xl flex items-center gap-3 sm:gap-3.5 border border-white/10 shadow-2xl"
      >
        {DOCK_ITEMS.map((item) => {
          const Icon = item.icon;
          const win = windows[item.id];
          const isOpen = win?.isOpen;
          const isActive = activeAppId === item.id && isOpen && !win.isMinimized;

          return (
            <div
              key={item.id}
              className="relative flex flex-col items-center"
              onMouseEnter={() => {
                setHoveredApp(item.id);
                sounds.playClick(1100);
              }}
              onMouseLeave={() => setHoveredApp(null)}
            >
              {/* Tooltip purely on hover */}
              <AnimatePresence>
                {hoveredApp === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.94 }}
                    animate={{ opacity: 1, y: -10, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute -top-9 px-3 py-1 bg-[#161622]/95 text-white text-xs font-mono-code rounded-lg shadow-xl border border-white/15 whitespace-nowrap pointer-events-none z-50"
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* App Button */}
              <motion.button
                whileHover={{ scale: 1.18, y: -4 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => handleDockItemClick(item.id)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all shadow-md relative ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/25'
                    : 'bg-[#14141d]/90 hover:bg-[#1a1a28] text-white/70 hover:text-white border-white/[0.08]'
                }`}
              >
                <Icon className="w-5 h-5" />

                {/* Subtle running dot */}
                {isOpen && (
                  <div
                    className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-blue-400 shadow-sm shadow-blue-400' : 'bg-white/40'
                    }`}
                  />
                )}
              </motion.button>
            </div>
          );
        })}

        {/* Easter Egg Root Unlock Icon */}
        {allEasterEggsUnlocked && (
          <div
            className="relative flex flex-col items-center border-l border-white/10 pl-2.5 ml-1"
            onMouseEnter={() => setHoveredApp('secret')}
            onMouseLeave={() => setHoveredApp(null)}
          >
            <AnimatePresence>
              {hoveredApp === 'secret' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: -10 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute -top-9 px-3 py-1 bg-amber-950/95 text-amber-200 text-xs font-mono-code rounded-lg shadow-xl border border-amber-500/30 whitespace-nowrap pointer-events-none z-50"
                >
                  ROOT UNLOCKED
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.18, y: -4 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleDockItemClick('secret')}
              className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-600/30 border border-amber-500/50 text-amber-400 shadow-lg shadow-amber-500/10"
            >
              <Sparkles className="w-5 h-5 animate-pulse" />
            </motion.button>
          </div>
        )}
      </motion.nav>
    </div>
  );
};
