'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/lib/store/os.store';
import { sounds } from '@/lib/utils';
import type { AppId } from '@/types';
import {
  Search,
  FolderKanban,
  User,
  FlaskConical,
  Network,
  Film,
  Radio,
  Terminal,
  Volume2,
  VolumeX,
  Sparkles,
  Command as CommandIcon,
  X,
  Play,
} from 'lucide-react';

interface PaletteAction {
  id: string;
  label: string;
  category: string;
  icon: React.ElementType;
  shortcut?: string;
  perform: () => void;
}

export const CommandPalette: React.FC = () => {
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    openApp,
    soundEnabled,
    toggleSound,
    discoverEasterEgg,
  } = useOSStore();

  const [query, setQuery] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  const actions: PaletteAction[] = [
    {
      id: 'open-projects',
      label: 'Open Projects Explorer',
      category: 'NAVIGATION',
      icon: FolderKanban,
      shortcut: 'P',
      perform: () => openApp('projects'),
    },
    {
      id: 'open-about',
      label: 'Open About & Timeline',
      category: 'NAVIGATION',
      icon: User,
      shortcut: 'A',
      perform: () => openApp('about'),
    },
    {
      id: 'open-lab',
      label: 'Open Fiker Lab (Simulator & AI)',
      category: 'NAVIGATION',
      icon: FlaskConical,
      shortcut: 'L',
      perform: () => openApp('lab'),
    },
    {
      id: 'open-skills',
      label: 'Open Capability Matrix',
      category: 'NAVIGATION',
      icon: Network,
      shortcut: 'S',
      perform: () => openApp('skills'),
    },
    {
      id: 'open-creative',
      label: 'Open Creative & Motion Reel',
      category: 'NAVIGATION',
      icon: Film,
      shortcut: 'C',
      perform: () => openApp('creative'),
    },
    {
      id: 'open-contact',
      label: 'Establish Connection (Contact)',
      category: 'NAVIGATION',
      icon: Radio,
      shortcut: 'M',
      perform: () => openApp('contact'),
    },
    {
      id: 'open-terminal',
      label: 'Launch Terminal Shell',
      category: 'SYSTEM',
      icon: Terminal,
      shortcut: 'T',
      perform: () => openApp('terminal'),
    },
    {
      id: 'toggle-audio',
      label: soundEnabled ? 'Mute System Audio' : 'Unmute System Audio',
      category: 'PREFERENCES',
      icon: soundEnabled ? VolumeX : Volume2,
      perform: () => toggleSound(),
    },
    {
      id: 'inspect-secrets',
      label: 'Inspect System Secrets & Easter Eggs',
      category: 'EASTER EGGS',
      icon: Sparkles,
      perform: () => {
        discoverEasterEgg('systemInspect');
        openApp('terminal');
      },
    },
  ];

  const filteredActions = actions.filter((act) =>
    act.label.toLowerCase().includes(query.toLowerCase()) ||
    act.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      sounds.playClick(900);
      setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      sounds.playClick(900);
      setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === 'Enter') {
      if (filteredActions[selectedIndex]) {
        sounds.playClick(1000);
        filteredActions[selectedIndex].perform();
        setCommandPaletteOpen(false);
      }
    }
  };

  if (!commandPaletteOpen) return null;

  return (
    <div
      onClick={() => setCommandPaletteOpen(false)}
      className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-md flex items-start justify-center pt-20 p-4 font-mono-code select-none"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-xl bg-[#111118]/95 border border-white/15 rounded-2xl shadow-2xl overflow-hidden glass-panel-elevated"
      >
        {/* Search Input Box */}
        <div className="p-3.5 border-b border-white/[0.08] flex items-center space-x-3">
          <Search className="w-4 h-4 text-white/40" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search systems..."
            className="flex-1 bg-transparent text-white text-xs placeholder-white/30 focus:outline-none font-sans"
          />
          <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40 text-[10px] border border-white/[0.08]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filteredActions.length > 0 ? (
            filteredActions.map((action, idx) => {
              const Icon = action.icon;
              const isSelected = selectedIndex === idx;
              return (
                <div
                  key={action.id}
                  onClick={() => {
                    sounds.playClick(1000);
                    action.perform();
                    setCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-2.5 rounded-xl flex items-center justify-between text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-600/30 text-white border border-blue-500/40 shadow-sm'
                      : 'text-white/70 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-white/40'}`} />
                    <span className="font-medium font-sans">{action.label}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[9px] text-white/30 uppercase">{action.category}</span>
                    {action.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] text-white/40 text-[10px]">
                        {action.shortcut}
                      </kbd>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-white/40">
              No matching commands found.
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#0d0d14] border-t border-white/[0.06] flex items-center justify-between text-[10px] text-white/40">
          <span>Navigate: ↑ ↓ · Select: ↵ · Close: ESC</span>
          <span className="text-blue-400 font-mono-code">FIKREMARIYAM OS COMMAND CENTER</span>
        </div>
      </motion.div>
    </div>
  );
};
