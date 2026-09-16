'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projects } from '@/lib/data/projects';
import type { Project, ProjectCategory } from '@/types';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { sounds } from '@/lib/utils';
import {
  FolderKanban,
  ArrowRight,
  ArrowLeft,
  GitBranch,
  Activity,
  Layers,
  Code2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

type DetailTab = 'architecture' | 'engineering' | 'technologies' | 'challenges';

export const ProjectsApp: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>('architecture');
  const [filterCategory, setFilterCategory] = useState<'ALL' | ProjectCategory>('ALL');

  const filteredProjects =
    filterCategory === 'ALL'
      ? projects
      : projects.filter((p) => p.category === filterCategory);

  const handleOpenProject = (project: Project) => {
    sounds.playWindowOpen();
    setSelectedProject(project);
    setActiveTab('architecture');
  };

  const handleBackToProjects = () => {
    sounds.playClick(650);
    setSelectedProject(null);
  };

  return (
    <div className="flex-1 w-full flex flex-col bg-[#090b10] text-white select-text">
      <AnimatePresence mode="wait">
        {!selectedProject ? (
          /* =========================================================================
             STAGE 1: IMMERSIVE PROJECTS CATALOG (NEAT, SPACIOUS & RICH)
             ========================================================================= */
          <motion.div
            key="browser"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8"
          >
            {/* Catalog Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 font-mono-code">
                  <FolderKanban className="w-4 h-4" />
                  <span className="tracking-widest uppercase">
                    03 ENGINEERED SYSTEMS
                  </span>
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  PROJECTS
                </h1>
                <p className="text-sm sm:text-base text-white/70 max-w-2xl leading-relaxed font-sans">
                  Production applications, asynchronous media processing pipelines, and real-time collaboration platforms built with modern software architecture.
                </p>
              </div>

              {/* Category Filter Buttons (No Gradients) */}
              <div className="flex flex-wrap gap-2 pt-2">
                {(['ALL', 'PRODUCTION', 'ENGINEERING'] as const).map((cat) => {
                  const isSelected = filterCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        sounds.playClick(800);
                        setFilterCategory(cat);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-code transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white border border-blue-500 shadow-md scale-[1.02]'
                          : 'bg-[#121420] text-white/70 hover:text-white hover:bg-[#1a1d2e] border border-white/[0.12] active:scale-95'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Projects Grid: Dominant, Spacious, High-Affordance Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProjects.map((proj) => (
                <motion.div
                  key={proj.id}
                  whileHover={{ y: -6 }}
                  onClick={() => handleOpenProject(proj)}
                  className="p-8 rounded-2xl bg-[#101220] border border-white/[0.1] hover:border-blue-500/60 hover:bg-[#141728] transition-all cursor-pointer flex flex-col justify-between space-y-6 group shadow-xl hover:shadow-2xl"
                >
                  <div className="space-y-4">
                    {/* Header: Type Badge & Year */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold px-3 py-1 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/30 uppercase tracking-wider font-mono-code">
                        {proj.id === 'ai-video-clipper'
                          ? 'AI MEDIA PROCESSING'
                          : proj.id === 'shoel'
                          ? 'REAL-TIME COLLABORATIVE PLATFORM'
                          : 'ASYNCHRONOUS MEDIA ENGINE'}
                      </span>
                      <span className="text-xs text-white/40 font-mono-code">{proj.year}</span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-blue-300 transition-colors tracking-tight">
                      {proj.name}
                    </h2>

                    {/* Clean One-Sentence Human Description */}
                    <p className="text-sm text-white/80 leading-relaxed font-sans">
                      {proj.id === 'ai-video-clipper'
                        ? 'Automatically analyzes video, detects important moments, and generates clips with captions.'
                        : proj.id === 'shoel'
                        ? 'Real-time student collaboration and study platform with peer networking, study rooms, and interactive tools.'
                        : 'High-performance video transcoding engine with asynchronous job queues, FFmpeg processing, and status polling.'}
                    </p>
                  </div>

                  <div className="space-y-5 pt-5 border-t border-white/[0.08]">
                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2.5 py-1 rounded-md bg-white/[0.05] text-white/80 border border-white/[0.08] font-mono-code font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                      {proj.technologies.length > 4 && (
                        <span className="text-xs px-2 py-1 text-white/40 font-mono-code font-medium">
                          +{proj.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Action Button: Clear OPEN PROJECT */}
                    <div className="pt-1">
                      <div className="w-full py-3 px-4 rounded-xl bg-blue-600 group-hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm font-mono-code flex items-center justify-between transition-all shadow-lg shadow-blue-600/25">
                        <span>OPEN PROJECT</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* =========================================================================
             STAGE 2: FULL-SCREEN PROJECT ENVIRONMENT (PROGRESSIVE DISCLOSURE)
             ========================================================================= */
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8"
          >
            {/* Top Navigation Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
              <button
                onClick={handleBackToProjects}
                className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.08] flex items-center space-x-2 text-xs font-bold font-mono-code transition-colors self-start cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← BACK TO ALL PROJECTS</span>
              </button>

              <div className="flex items-center space-x-3">
                <span className="text-xs px-3 py-1 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/30 font-mono-code font-bold uppercase tracking-wider">
                  {selectedProject.category} // {selectedProject.year}
                </span>
              </div>
            </div>

            {/* Project Hero Title & Overview */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-blue-400 font-mono-code uppercase tracking-widest">
                SYSTEM DEEP DIVE
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {selectedProject.name}
              </h1>
              <p className="text-base sm:text-lg text-white/80 font-sans max-w-3xl leading-relaxed">
                {selectedProject.overview}
              </p>
            </div>

            {/* Progressive Disclosure Section Tabs (Clean Solid Buttons) */}
            <div className="flex flex-wrap gap-2 pt-2">
              {[
                { id: 'architecture' as DetailTab, label: 'ARCHITECTURE', icon: Layers },
                { id: 'engineering' as DetailTab, label: 'ENGINEERING DECISIONS', icon: GitBranch },
                { id: 'technologies' as DetailTab, label: 'TECHNOLOGIES', icon: Code2 },
                { id: 'challenges' as DetailTab, label: 'CHALLENGES SOLVED', icon: Activity },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sounds.playClick(850);
                      setActiveTab(tab.id);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-code flex items-center space-x-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border border-blue-500 shadow-md scale-[1.02]'
                        : 'bg-[#121420] text-white/70 hover:text-white hover:bg-[#1a1d2e] border border-white/[0.12] active:scale-95'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: System Architecture Visualizer */}
            {activeTab === 'architecture' && (
              <div className="w-full">
                <ArchitectureDiagram project={selectedProject} />
              </div>
            )}

            {/* Tab 2: Engineering Decisions */}
            {activeTab === 'engineering' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Problem */}
                  <div className="p-7 rounded-2xl bg-red-950/15 border border-red-500/25 space-y-3">
                    <div className="flex items-center space-x-2 text-red-400 font-bold text-sm font-mono-code">
                      <AlertCircle className="w-4 h-4" />
                      <span>THE PROBLEM</span>
                    </div>
                    <p className="text-sm text-white/80 font-sans leading-relaxed">
                      {selectedProject.problem}
                    </p>
                  </div>

                  {/* Solution */}
                  <div className="p-7 rounded-2xl bg-emerald-950/15 border border-emerald-500/25 space-y-3">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm font-mono-code">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>THE ENGINEERED SOLUTION</span>
                    </div>
                    <p className="text-sm text-white/80 font-sans leading-relaxed">
                      {selectedProject.solution}
                    </p>
                  </div>
                </div>

                {/* Key Decisions */}
                <div className="p-8 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-5">
                  <h3 className="text-sm font-bold text-blue-400 tracking-wider font-mono-code">
                    ARCHITECTURAL DECISIONS & RATIONALE
                  </h3>
                  <div className="space-y-3 font-sans text-sm text-white/85">
                    {selectedProject.engineeringDecisions.map((decision, idx) => (
                      <div key={idx} className="flex items-start space-x-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <span className="text-blue-400 font-mono-code font-bold text-sm">0{idx + 1}.</span>
                        <p className="leading-relaxed">{decision}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Technologies & Stack */}
            {activeTab === 'technologies' && (
              <div className="p-8 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    INTEGRATED SYSTEM STACK
                  </h3>
                  <p className="text-xs text-white/60 font-sans">
                    Core libraries, frameworks, protocols, and platforms powering this system.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                  {selectedProject.technologies.map((tech) => (
                    <div
                      key={tech}
                      className="p-4 rounded-xl bg-white/[0.03] text-white border border-white/[0.08] text-xs sm:text-sm font-semibold flex items-center space-x-2.5 font-mono-code"
                    >
                      <Code2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Solved Technical Challenges */}
            {activeTab === 'challenges' && (
              <div className="p-8 rounded-2xl bg-[#111420] border border-white/[0.08] space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-amber-400 tracking-wide font-mono-code">
                    SOLVED TECHNICAL CHALLENGES
                  </h3>
                  <p className="text-xs text-white/60 font-sans">
                    Real engineering bottlenecks and how they were overcome during implementation.
                  </p>
                </div>

                <div className="space-y-4 font-sans text-sm text-white/85">
                  {selectedProject.challenges.map((challenge, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-xl bg-amber-950/15 border border-amber-500/20 flex items-start space-x-3.5"
                    >
                      <Activity className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">{challenge}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
