import { create } from 'zustand';
import type { AppId } from '@/types';
import { sounds } from '@/lib/utils';

export interface AppWindowConfig {
  id: AppId;
  title: string;
  defaultSize: { width: number; height: number };
  defaultPos: { x: number; y: number };
  minSize: { width: number; height: number };
}

export const APP_CONFIGS: Record<AppId, AppWindowConfig> = {
  projects: {
    id: 'projects',
    title: 'PROJECTS // EXPLORER',
    defaultSize: { width: 1200, height: 760 },
    defaultPos: { x: 40, y: 50 },
    minSize: { width: 600, height: 500 },
  },
  about: {
    id: 'about',
    title: 'IDENTITY // ABOUT',
    defaultSize: { width: 1040, height: 720 },
    defaultPos: { x: 80, y: 60 },
    minSize: { width: 540, height: 440 },
  },
  lab: {
    id: 'lab',
    title: 'FIKER LAB // EXPERIMENTAL SYSTEMS',
    defaultSize: { width: 1180, height: 750 },
    defaultPos: { x: 60, y: 55 },
    minSize: { width: 600, height: 500 },
  },
  skills: {
    id: 'skills',
    title: 'CAPABILITY MATRIX // SKILLS GRAPH',
    defaultSize: { width: 1080, height: 720 },
    defaultPos: { x: 70, y: 65 },
    minSize: { width: 560, height: 460 },
  },
  creative: {
    id: 'creative',
    title: 'DEVELOPED GAMES // ARCADE & MOTION',
    defaultSize: { width: 1160, height: 740 },
    defaultPos: { x: 50, y: 55 },
    minSize: { width: 580, height: 480 },
  },
  contact: {
    id: 'contact',
    title: 'ESTABLISH CONNECTION // TRANSMIT',
    defaultSize: { width: 880, height: 640 },
    defaultPos: { x: 120, y: 70 },
    minSize: { width: 480, height: 420 },
  },
  terminal: {
    id: 'terminal',
    title: 'TERMINAL // FIKER-OS SHELL',
    defaultSize: { width: 900, height: 580 },
    defaultPos: { x: 90, y: 80 },
    minSize: { width: 480, height: 360 },
  },
  secret: {
    id: 'secret',
    title: 'ROOT OVERRIDE // SYSTEM UNLOCKED',
    defaultSize: { width: 780, height: 540 },
    defaultPos: { x: 140, y: 90 },
    minSize: { width: 440, height: 380 },
  },
};

export interface WindowInstance {
  id: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

export interface EasterEggState {
  terminalSudo: boolean;
  konamiCode: boolean;
  packetStorm: boolean;
  systemInspect: boolean;
  dockTripleClick: boolean;
}

interface OSState {
  booted: boolean;
  setBooted: (booted: boolean) => void;

  windows: Record<AppId, WindowInstance>;
  activeAppId: AppId | null;
  topZIndex: number;

  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  toggleMaximizeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void;
  updatePosition: (id: AppId, pos: { x: number; y: number }) => void;
  updateSize: (id: AppId, size: { width: number; height: number }) => void;

  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;

  soundEnabled: boolean;
  toggleSound: () => void;

  activeProjectId: string | null;
  setActiveProjectId: (projectId: string | null) => void;

  easterEggs: EasterEggState;
  discoverEasterEgg: (egg: keyof EasterEggState) => void;
  allEasterEggsUnlocked: boolean;

  selectedSkillId: string | null;
  setSelectedSkillId: (skillId: string | null) => void;

  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
}

const initialWindows = (Object.keys(APP_CONFIGS) as AppId[]).reduce((acc, appId) => {
  const config = APP_CONFIGS[appId];
  acc[appId] = {
    id: appId,
    title: config.title,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    position: { ...config.defaultPos },
    size: { ...config.defaultSize },
    zIndex: 10,
  };
  return acc;
}, {} as Record<AppId, WindowInstance>);

export const useOSStore = create<OSState>((set, get) => ({
  booted: false,
  setBooted: (booted) => {
    if (booted && typeof window !== 'undefined') {
      localStorage.setItem('fiker_os_booted', 'true');
    }
    set({ booted });
  },

  windows: initialWindows,
  activeAppId: null,
  topZIndex: 20,

  openApp: (id) => {
    sounds.playWindowOpen();
    const state = get();
    const currentWin = state.windows[id];
    const newZ = state.topZIndex + 1;

    set({
      windows: {
        ...state.windows,
        [id]: {
          ...currentWin,
          isOpen: true,
          isMinimized: false,
          isMaximized: state.isMobile ? true : currentWin.isMaximized,
          zIndex: newZ,
        },
      },
      activeAppId: id,
      topZIndex: newZ,
    });
  },

  closeApp: (id) => {
    sounds.playClick(600);
    const state = get();
    const currentWin = state.windows[id];

    let nextActive: AppId | null = null;
    let maxZ = -1;
    (Object.keys(state.windows) as AppId[]).forEach((key) => {
      if (key !== id && state.windows[key].isOpen && !state.windows[key].isMinimized) {
        if (state.windows[key].zIndex > maxZ) {
          maxZ = state.windows[key].zIndex;
          nextActive = key;
        }
      }
    });

    set({
      windows: {
        ...state.windows,
        [id]: {
          ...currentWin,
          isOpen: false,
          isMinimized: false,
        },
      },
      activeAppId: nextActive,
    });
  },

  minimizeApp: (id) => {
    sounds.playClick(450);
    const state = get();
    const currentWin = state.windows[id];

    let nextActive: AppId | null = null;
    let maxZ = -1;
    (Object.keys(state.windows) as AppId[]).forEach((key) => {
      if (key !== id && state.windows[key].isOpen && !state.windows[key].isMinimized) {
        if (state.windows[key].zIndex > maxZ) {
          maxZ = state.windows[key].zIndex;
          nextActive = key;
        }
      }
    });

    set({
      windows: {
        ...state.windows,
        [id]: {
          ...currentWin,
          isMinimized: true,
        },
      },
      activeAppId: nextActive,
    });
  },

  toggleMaximizeApp: (id) => {
    sounds.playClick(750);
    const state = get();
    const currentWin = state.windows[id];
    set({
      windows: {
        ...state.windows,
        [id]: {
          ...currentWin,
          isMaximized: !currentWin.isMaximized,
        },
      },
      activeAppId: id,
    });
  },

  focusApp: (id) => {
    const state = get();
    const currentWin = state.windows[id];
    if (!currentWin.isOpen) return;

    if (state.activeAppId === id && !currentWin.isMinimized) return;

    const newZ = state.topZIndex + 1;
    set({
      windows: {
        ...state.windows,
        [id]: {
          ...currentWin,
          isMinimized: false,
          zIndex: newZ,
        },
      },
      activeAppId: id,
      topZIndex: newZ,
    });
  },

  updatePosition: (id, pos) => {
    const state = get();
    set({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          position: pos,
        },
      },
    });
  },

  updateSize: (id, size) => {
    const state = get();
    set({
      windows: {
        ...state.windows,
        [id]: {
          ...state.windows[id],
          size,
        },
      },
    });
  },

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => {
    if (open) sounds.playClick(900);
    set({ commandPaletteOpen: open });
  },
  toggleCommandPalette: () => {
    const open = !get().commandPaletteOpen;
    if (open) sounds.playClick(900);
    set({ commandPaletteOpen: open });
  },

  soundEnabled: true,
  toggleSound: () => {
    const next = !get().soundEnabled;
    sounds.setEnabled(next);
    set({ soundEnabled: next });
  },

  activeProjectId: 'shoel',
  setActiveProjectId: (projectId) => set({ activeProjectId: projectId }),

  easterEggs: {
    terminalSudo: false,
    konamiCode: false,
    packetStorm: false,
    systemInspect: false,
    dockTripleClick: false,
  },
  allEasterEggsUnlocked: false,
  discoverEasterEgg: (egg) => {
    const state = get();
    if (state.easterEggs[egg]) return;

    const updated = {
      ...state.easterEggs,
      [egg]: true,
    };
    const totalFound = Object.values(updated).filter(Boolean).length;
    const allUnlocked = totalFound === Object.keys(updated).length;

    sounds.playPacketSound();

    if (allUnlocked) {
      setTimeout(() => {
        get().openApp('secret');
      }, 500);
    }

    set({
      easterEggs: updated,
      allEasterEggsUnlocked: allUnlocked,
    });
  },

  selectedSkillId: null,
  setSelectedSkillId: (skillId) => set({ selectedSkillId: skillId }),

  isMobile: false,
  setIsMobile: (isMobile) => set({ isMobile }),
}));
