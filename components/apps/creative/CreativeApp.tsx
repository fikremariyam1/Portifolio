'use client';

import React, { useState } from 'react';
import { sounds } from '@/lib/utils';
import { Film, Play, Sparkles, Gamepad2, Trophy, Eye, Video, Palette, Clapperboard, X, Flame } from 'lucide-react';
import { SnakeGame } from './games/SnakeGame';
import { SpaceInvadersGame } from './games/SpaceInvadersGame';
import { BrickBreakerGame } from './games/BrickBreakerGame';

interface CreativeWork {
  id: string;
  title: string;
  category: string;
  tools: string[];
  description: string;
}

const CREATIVE_WORKS: CreativeWork[] = [
  {
    id: 'work-1',
    title: 'Cinematic Product Teaser & Motion Reel',
    category: 'Motion Graphics',
    tools: ['After Effects', 'Premiere Pro', 'Blender'],
    description: 'Dynamic 3D animations, title sequences, and sound design tailored for modern software and tech products.',
  },
  {
    id: 'work-2',
    title: 'Brand Identity & Visual Storytelling',
    category: 'Brand Design',
    tools: ['Photoshop', 'Illustrator', 'Figma'],
    description: 'Complete visual branding systems, typography hierarchy, and creative direction for modern brands.',
  },
  {
    id: 'work-3',
    title: 'Commercial Short-Form Video Editing',
    category: 'Video Editing',
    tools: ['Premiere Pro', 'DaVinci Resolve'],
    description: 'High-energy pacing, sound effects, motion overlays, and color grading for viral social media content.',
  },
  {
    id: 'work-4',
    title: 'Interactive UI Motion & Concept Design',
    category: 'UI Motion',
    tools: ['Framer Motion', 'React', 'CSS Keyframes'],
    description: 'Fluid user interface transitions, micro-interactions, and spatial animation for web applications.',
  },
];

type MainTab = 'arcade' | 'creative';
type GameType = 'snake' | 'space' | 'brick';

export const CreativeApp: React.FC = () => {
  // Games first by default!
  const [mainTab, setMainTab] = useState<MainTab>('arcade');
  const [selectedGame, setSelectedGame] = useState<GameType>('snake');
  const [activePreview, setActivePreview] = useState<CreativeWork | null>(null);

  return (
    <div className="flex-1 w-full flex flex-col bg-[#08080c] text-white select-text overflow-y-auto">
      {/* Top Header & Prominent Mode Buttons */}
      <div className="py-4 px-6 sm:px-10 bg-[#10121d] border-b border-white/[0.1] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 shadow-md">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-md">
            {mainTab === 'arcade' ? <Gamepad2 className="w-5 h-5" /> : <Clapperboard className="w-5 h-5" />}
          </div>
          <div className="space-y-0.5">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
              {mainTab === 'arcade' ? 'Developed Games & Cyber Arcade' : 'Motion Design & Video Reel'}
            </h1>
            <p className="text-xs text-white/60 font-sans">
              {mainTab === 'arcade'
                ? 'Play 3 built-in games directly in your browser'
                : 'Cinematic trailers, motion graphics & video editing portfolio'}
            </p>
          </div>
        </div>

        {/* Big, Obvious, Visible Action Buttons — Games FIRST */}
        <div className="flex items-center gap-2.5 bg-[#0a0c16] border border-white/[0.15] p-2 rounded-2xl shadow-xl">
          <button
            onClick={() => {
              sounds.playClick(850);
              setMainTab('arcade');
            }}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              mainTab === 'arcade'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 ring-2 ring-purple-400 scale-[1.03] border border-purple-400'
                : 'bg-[#161a2c] text-white/70 hover:text-white hover:bg-[#1f243d] border border-white/[0.1]'
            }`}
          >
            <Gamepad2 className={`w-4 h-4 ${mainTab === 'arcade' ? 'text-white' : 'text-purple-400'}`} />
            <span>Play Games (3)</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick(850);
              setMainTab('creative');
            }}
            className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              mainTab === 'creative'
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/40 ring-2 ring-amber-300 scale-[1.03] border border-amber-300'
                : 'bg-[#161a2c] text-white/70 hover:text-white hover:bg-[#1f243d] border border-white/[0.1]'
            }`}
          >
            <Film className={`w-4 h-4 ${mainTab === 'creative' ? 'text-black' : 'text-amber-400'}`} />
            <span>Video & Motion Design</span>
          </button>
        </div>
      </div>

      {/* Main Tab 1: Play Games (FIRST) */}
      {mainTab === 'arcade' && (
        <div className="p-6 sm:p-8 max-w-6xl mx-auto w-full flex flex-col lg:flex-row items-start gap-8">
          {/* Left Column: Game Selector & Controls Guide */}
          <div className="w-full lg:w-[340px] shrink-0 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs font-mono-code text-purple-400 font-bold uppercase tracking-wider">
                <Gamepad2 className="w-4 h-4" />
                <span>CYBER ARCADE CABINET</span>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Select a Game
              </h2>
            </div>

            {/* 3 Rich Interactive Game Cards */}
            <div className="space-y-3">
              {/* Game 1: Snake */}
              <button
                onClick={() => {
                  sounds.playClick(900);
                  setSelectedGame('snake');
                }}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center space-x-4 shadow-lg ${
                  selectedGame === 'snake'
                    ? 'bg-[#1a1430] border-purple-400 ring-2 ring-purple-400/40 shadow-purple-900/30 scale-[1.02]'
                    : 'bg-[#101220] hover:bg-[#15192c] border-white/[0.1]'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-2xl shrink-0">
                  🐍
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="text-sm font-bold text-white flex items-center justify-between">
                    <span>1. Neon Cyber Snake</span>
                    {selectedGame === 'snake' && (
                      <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-purple-500/30 text-purple-300 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/60 font-sans">
                    Classic retro snake with green data nodes & speed boosts.
                  </p>
                </div>
              </button>

              {/* Game 2: Space Invaders */}
              <button
                onClick={() => {
                  sounds.playClick(900);
                  setSelectedGame('space');
                }}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center space-x-4 shadow-lg ${
                  selectedGame === 'space'
                    ? 'bg-[#0f1f2e] border-cyan-400 ring-2 ring-cyan-400/40 shadow-cyan-900/30 scale-[1.02]'
                    : 'bg-[#101220] hover:bg-[#15192c] border-white/[0.1]'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-2xl shrink-0">
                  🚀
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="text-sm font-bold text-white flex items-center justify-between">
                    <span>2. Space Invaders</span>
                    {selectedGame === 'space' && (
                      <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-500/30 text-cyan-300 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/60 font-sans">
                    Defend the system from waves of invading code bugs.
                  </p>
                </div>
              </button>

              {/* Game 3: Brick Breaker */}
              <button
                onClick={() => {
                  sounds.playClick(900);
                  setSelectedGame('brick');
                }}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center space-x-4 shadow-lg ${
                  selectedGame === 'brick'
                    ? 'bg-[#261c10] border-amber-400 ring-2 ring-amber-400/40 shadow-amber-900/30 scale-[1.02]'
                    : 'bg-[#101220] hover:bg-[#15192c] border-white/[0.1]'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shrink-0">
                  🧱
                </div>
                <div className="space-y-0.5 flex-1">
                  <div className="text-sm font-bold text-white flex items-center justify-between">
                    <span>3. Cyber Brick Breaker</span>
                    {selectedGame === 'brick' && (
                      <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-amber-500/30 text-amber-300 font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/60 font-sans">
                    Demolish neon memory blocks with paddle physics.
                  </p>
                </div>
              </button>
            </div>

            {/* Quick Tips & Mechanics Box */}
            <div className="p-4 rounded-2xl bg-[#101220] border border-white/[0.08] space-y-2">
              <div className="text-[11px] font-mono-code text-white/50 font-bold uppercase tracking-wider">
                INPUT MECHANICS
              </div>
              <div className="text-xs text-white/70 font-sans leading-relaxed space-y-1">
                <div>• Keyboard Arrow Keys or WASD supported</div>
                <div>• Responsive touch controls enabled on mobile</div>
                <div>• High scores saved automatically in memory</div>
              </div>
            </div>
          </div>

          {/* Right Column: Arcade Stage Cabinet */}
          <div className="flex-1 w-full flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-[#0b0d18] border border-white/[0.12] shadow-2xl relative overflow-hidden">
            {selectedGame === 'snake' && <SnakeGame />}
            {selectedGame === 'space' && <SpaceInvadersGame />}
            {selectedGame === 'brick' && <BrickBreakerGame />}
          </div>
        </div>
      )}

      {/* Main Tab 2: Creative & Motion Showcase */}
      {mainTab === 'creative' && (
        <div className="p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-10">
          {/* Friendly Hero Banner */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#101322] border border-white/[0.12] text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>CREATIVE STORYTELLER & VIDEO EDITOR</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug font-sans">
              Code + Visual Design + Motion = High-Impact Content
            </h2>

            <p className="text-sm sm:text-base text-white/80 font-sans max-w-2xl mx-auto leading-relaxed">
              Beyond software engineering, I craft cinematic product trailers, dynamic motion graphics, and engaging short-form video edits with intentional pacing and sound design.
            </p>

            {/* Jump back to Games CTA */}
            <div className="pt-2">
              <button
                onClick={() => {
                  sounds.playClick(900);
                  setMainTab('arcade');
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 font-bold text-xs sm:text-sm inline-flex items-center space-x-2 transition-all shadow-lg hover:scale-105"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>← Back to the 3 Playable Games</span>
              </button>
            </div>
          </div>

          {/* Video & Portfolio Cards Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider font-mono-code">
                FEATURED CREATIVE DISCIPLINES & REELS
              </h3>
              <span className="text-xs text-white/40 font-sans">Click any card to inspect details</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CREATIVE_WORKS.map((work) => (
                <div
                  key={work.id}
                  onClick={() => {
                    sounds.playClick(850);
                    setActivePreview(work);
                  }}
                  className="p-6 rounded-2xl bg-[#111422] border border-white/[0.1] hover:border-amber-500/50 hover:bg-[#161a2e] transition-all space-y-4 cursor-pointer group shadow-xl hover:shadow-2xl"
                >
                  {/* Thumbnail Container */}
                  <div
                    className="w-full aspect-video rounded-xl bg-[#151a2c] border border-white/[0.08] flex flex-col items-center justify-center space-y-3 relative overflow-hidden group-hover:scale-[1.01] transition-all"
                  >
                    <div className="w-14 h-14 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-black ml-0.5" />
                    </div>
                    <span className="text-xs font-bold text-white/90 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                      Click to View Preview
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors font-sans">
                        {work.title}
                      </h4>
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {work.category}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-white/75 font-sans leading-relaxed">
                      {work.description}
                    </p>

                    {/* Tools badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {work.tools.map((tool) => (
                        <span
                          key={tool}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-white/60 border border-white/[0.06]"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal / Lightbox for Video Preview */}
      {activePreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121524] border border-white/[0.15] rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {activePreview.category} Preview
                </span>
                <h3 className="text-xl font-extrabold text-white font-sans">
                  {activePreview.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePreview(null)}
                className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="w-full aspect-video rounded-2xl bg-[#151a2c] border border-white/10 flex flex-col items-center justify-center space-y-4 text-center p-6"
            >
              <div className="w-16 h-16 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-2xl">
                <Play className="w-7 h-7 fill-black ml-1" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-white">High-Definition Motion Showcase</div>
                <div className="text-xs text-white/60 font-sans">Edited and produced by Fikremariyam Tadesse</div>
              </div>
            </div>

            <p className="text-sm text-white/80 font-sans leading-relaxed">
              {activePreview.description}
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActivePreview(null)}
                className="px-6 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] text-white font-bold text-xs font-sans transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
