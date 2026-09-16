'use client';

import React, { useState, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { useOSStore, APP_CONFIGS } from '@/lib/store/os.store';
import type { AppId } from '@/types';
import { Minus, X, Maximize2, Minimize2 } from 'lucide-react';

interface WindowProps {
  id: AppId;
  title: string;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ id, title, children }) => {
  const {
    windows,
    activeAppId,
    closeApp,
    minimizeApp,
    toggleMaximizeApp,
    focusApp,
    isMobile,
  } = useOSStore();

  const dragControls = useDragControls();

  const windowState = windows[id];
  const isActive = activeAppId === id && !windowState.isMinimized;
  const isMaximized = windowState.isMaximized || isMobile;

  const [windowBounds, setWindowBounds] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowBounds({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!windowState.isOpen || windowState.isMinimized) {
    return null;
  }

  // Standardized, uniform window dimensions across all apps with proper clearance above bottom dock
  const targetWidth = Math.min(1180, Math.max(760, windowBounds.width - 64));
  const targetHeight = Math.min(700, Math.max(460, windowBounds.height - 150));
  
  const centeredX = Math.max(16, (windowBounds.width - targetWidth) / 2);
  const centeredY = 56;

  const stylePos = isMaximized
    ? {
        top: 48,
        left: 0,
        right: 0,
        bottom: isMobile ? 0 : 80,
        width: '100vw',
        height: isMobile ? 'calc(100vh - 48px)' : 'calc(100vh - 128px)',
      }
    : {
        top: centeredY,
        left: centeredX,
        width: targetWidth,
        height: targetHeight,
      };

  return (
    <motion.div
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.06}
      dragConstraints={{
        top: -centeredY + 48,
        left: -centeredX + 16,
        right: Math.max(50, windowBounds.width - centeredX - 120),
        bottom: Math.max(50, windowBounds.height - centeredY - 90),
      }}
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 8 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      onPointerDown={() => focusApp(id)}
      style={{
        position: 'fixed',
        ...stylePos,
        zIndex: windowState.zIndex,
      }}
      className={`flex flex-col overflow-hidden select-text bg-[#0c0e17] ${
        isMaximized
          ? 'rounded-none border-x-0 border-t-0'
          : 'rounded-2xl border border-white/[0.12] shadow-2xl'
      } ${
        isActive
          ? 'ring-1 ring-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]'
          : 'opacity-95 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.7)]'
      }`}
    >
      {/* Window Titlebar */}
      <div
        onPointerDown={(e) => {
          focusApp(id);
          if (!isMaximized) {
            dragControls.start(e);
          }
        }}
        onDoubleClick={() => !isMobile && toggleMaximizeApp(id)}
        className={`h-11 px-4 flex items-center justify-between border-b border-white/[0.08] select-none cursor-grab active:cursor-grabbing shrink-0 touch-none ${
          isActive ? 'bg-[#151824]' : 'bg-[#10121c]'
        }`}
      >
        {/* Left: Traffic Lights */}
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeApp(id);
            }}
            title="Close Window (X)"
            aria-label="Close window"
            className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:brightness-125 flex items-center justify-center group transition-all active:scale-90 shadow-sm border border-red-400/40"
          >
            <X className="w-2 h-2 text-black/80 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              minimizeApp(id);
            }}
            title="Minimize Window (_)"
            aria-label="Minimize window"
            className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:brightness-125 flex items-center justify-center group transition-all active:scale-90 shadow-sm border border-amber-400/40"
          >
            <Minus className="w-2 h-2 text-black/80 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isMobile) toggleMaximizeApp(id);
            }}
            title={isMaximized ? "Restore Window Size" : "Maximize / Fullscreen (+)"}
            aria-label="Toggle maximize"
            className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:brightness-125 flex items-center justify-center group transition-all active:scale-90 shadow-sm border border-emerald-400/40"
          >
            {isMaximized ? (
              <Minimize2 className="w-2 h-2 text-black/80 opacity-0 group-hover:opacity-100 transition-opacity" />
            ) : (
              <Maximize2 className="w-2 h-2 text-black/80 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        </div>

        {/* Center: Window Title */}
        <div className="flex items-center space-x-2 text-center text-xs font-mono-code tracking-wider text-white pointer-events-none truncate max-w-[50%]">
          <span className="truncate font-bold">{title}</span>
        </div>

        {/* Right: Expand / Window View Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMaximizeApp(id);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-mono-code font-bold bg-[#1a1d30] hover:bg-[#252a45] text-white border border-white/20 hover:border-cyan-400/60 transition-all flex items-center space-x-1.5 shadow-md active:scale-95 cursor-pointer"
            title={isMaximized ? "Restore to windowed mode" : "Expand to fullscreen"}
          >
            {isMaximized ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline text-[11px] text-amber-300">WINDOW VIEW</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline text-[11px] text-cyan-300">EXPAND VIEW</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto bg-[#0a0c14] relative">
        {children}
      </div>
    </motion.div>
  );
};
