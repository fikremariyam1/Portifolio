'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { sounds } from '@/lib/utils';
import { useOSStore } from '@/lib/store/os.store';
import { ArrowRight, FolderKanban } from 'lucide-react';

export const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { setBooted, openApp } = useOSStore();

  const handleEnterSystem = () => {
    sounds.playBootChord();
    setBooted(true);
    onComplete();
  };

  const handleDirectOpen = (appId: 'projects' | 'about' | 'lab') => {
    sounds.playBootChord();
    setBooted(true);
    onComplete();
    setTimeout(() => {
      openApp(appId);
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06070a] text-white font-mono-code flex flex-col justify-between p-6 sm:p-12 select-none overflow-y-auto">
      {/* Subtle Engineering Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      {/* Top Header / Status Line */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse-dot" />
          <span className="text-xs font-bold text-white tracking-widest uppercase">
            FIKER OS
          </span>
          <span className="text-white/30 hidden sm:inline">/</span>
          <span className="text-xs text-white/50 hidden sm:inline tracking-wider">
            PERSONAL DEVELOPMENT ENVIRONMENT
          </span>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-white/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>SYSTEM READY</span>
        </div>
      </div>

      {/* Center Welcome Container (Instant 3-Second Comprehension) */}
      <div className="relative z-10 max-w-3xl mx-auto w-full py-10 sm:py-16 my-auto space-y-10">
        {/* Main Identity & Role Block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="space-y-6"
        >
          {/* OS Environment Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#101322] border border-white/[0.12] text-white/70 text-xs font-bold">
            <span className="text-blue-400">FIKER OS</span>
            <span className="text-white/30">·</span>
            <span>v1.0.0</span>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]">
              FIKREMARIYAM<br />
              <span className="text-white/90">TADESSE</span>
            </h1>
          </div>

          {/* Role & Pillars */}
          <div className="space-y-2 pt-1">
            <div className="text-sm sm:text-base font-extrabold text-blue-400 tracking-wider uppercase">
              SOFTWARE DEVELOPER
            </div>
            <div className="text-xs sm:text-sm text-white/60 font-mono-code font-medium">
              FULL-STACK · AI · SYSTEMS
            </div>
          </div>

          {/* Core Purpose Statement */}
          <p className="text-lg sm:text-2xl text-white font-sans font-medium max-w-2xl leading-relaxed pt-2 border-l-2 border-blue-500 pl-4 sm:pl-6">
            &quot;I build software, systems and digital experiences.&quot;
          </p>
        </motion.div>

        {/* Primary Action & Shortcuts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
          className="space-y-6 pt-2"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Primary ENTER SYSTEM Button */}
            <button
              onClick={handleEnterSystem}
              autoFocus
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm sm:text-base tracking-wider flex items-center justify-center space-x-3 transition-all shadow-xl shadow-blue-600/30 active:scale-[0.98] cursor-pointer group border border-blue-400"
            >
              <span>[ ENTER SYSTEM ]</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Direct jump shortcuts */}
            <button
              onClick={() => handleDirectOpen('about')}
              className="px-5 py-4 rounded-xl bg-[#121420] hover:bg-[#1a1d2e] text-white/90 hover:text-white font-bold text-xs sm:text-sm border border-white/[0.15] hover:border-blue-500/60 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>ABOUT FIKER →</span>
            </button>

            <button
              onClick={() => handleDirectOpen('projects')}
              className="px-5 py-4 rounded-xl bg-[#121420] hover:bg-[#1a1d2e] text-white/80 hover:text-white font-bold text-xs sm:text-sm border border-white/[0.12] hover:border-blue-500/50 flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <FolderKanban className="w-4 h-4 text-blue-400" />
              <span>PROJECTS (03)</span>
            </button>
          </div>

          {/* Subtle Technical Summary */}
          <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/50">
            <div className="flex items-center space-x-2 font-bold text-white/80">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>03 ENGINEERED SYSTEMS</span>
            </div>
            <div className="text-white/40 tracking-wider">
              AI · WEB · REAL-TIME · SYSTEMS
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/[0.08] pt-4 text-[11px] text-white/40">
        <div>FIKREMARIYAM &quot;FIKER&quot; TADESSE · PORTFOLIO OS</div>
        <div className="hidden sm:block">CLICK ENTER TO EXPLORE INTERACTIVE WORKSPACE</div>
      </div>
    </div>
  );
};
