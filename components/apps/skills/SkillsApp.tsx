'use client';

import React, { useState } from 'react';
import { skills, skillCategories } from '@/lib/data/skills';
import { projects } from '@/lib/data/projects';
import { useOSStore } from '@/lib/store/os.store';
import { sounds } from '@/lib/utils';
import type { SkillCategory, SkillNode } from '@/types';
import {
  Network,
  FolderKanban,
  GitFork,
  ArrowUpRight,
  Cpu,
  Layers,
  Server,
  Layout,
  Sparkles,
} from 'lucide-react';

const getCategoryIcon = (cat: SkillCategory) => {
  switch (cat) {
    case 'FULL STACK':
      return <Layers className="w-3.5 h-3.5" />;
    case 'BACKEND':
      return <Server className="w-3.5 h-3.5" />;
    case 'FRONTEND':
      return <Layout className="w-3.5 h-3.5" />;
    case 'AI':
      return <Sparkles className="w-3.5 h-3.5" />;
    case 'SYSTEMS':
      return <Cpu className="w-3.5 h-3.5" />;
    case 'NETWORKING':
      return <Network className="w-3.5 h-3.5" />;
    default:
      return <Layers className="w-3.5 h-3.5" />;
  }
};

export const SkillsApp: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory>('FULL STACK');
  const [selectedSkill, setSelectedSkill] = useState<SkillNode>(skills[0]);
  const { openApp, setActiveProjectId } = useOSStore();

  const filteredSkills = skills.filter((s) => s.category === selectedCategory);

  const connectedSkillObjects = skills.filter((s) =>
    selectedSkill.connectedTo.includes(s.id)
  );

  const usedInProjects = projects.filter((p) =>
    selectedSkill.usedIn.includes(p.id)
  );

  return (
    <div className="flex flex-col h-full bg-[#08080c] text-white font-mono-code select-text overflow-y-auto">
      {/* Header */}
      <div className="p-6 sm:p-10 max-w-6xl mx-auto w-full space-y-6">
        <div className="space-y-2 pb-4 border-b border-white/[0.08]">
          <div className="flex items-center space-x-2 text-xs text-purple-400">
            <Network className="w-4 h-4" />
            <span className="tracking-widest font-semibold uppercase">
              CAPABILITY MATRIX
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            SKILLS GRAPH
          </h1>
          <p className="text-xs sm:text-sm text-white/70 font-sans max-w-2xl leading-relaxed">
            Engineered technologies contextualized with real systems, production pipelines, and architecture relationships.
          </p>
        </div>

        {/* Clean, Solid Category Buttons (No Gradients) */}
        <div className="flex flex-wrap gap-2 pt-1 pb-2">
          {skillCategories.slice(0, 6).map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  sounds.playClick(800);
                  setSelectedCategory(cat);
                  const first = skills.find((s) => s.category === cat);
                  if (first) setSelectedSkill(first);
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold font-mono-code transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-600 text-white border border-purple-500 shadow-md scale-[1.02]'
                    : 'bg-[#121420] text-white/70 hover:text-white hover:bg-[#1a1d2e] border border-white/[0.12] active:scale-95'
                }`}
              >
                <span className={isSelected ? 'text-white' : 'text-purple-400'}>
                  {getCategoryIcon(cat)}
                </span>
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Skill Nodes in selected category */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
              {selectedCategory} TECHNOLOGIES ({filteredSkills.length})
            </div>

            <div className="space-y-2.5">
              {filteredSkills.map((skill) => {
                const isSelected = selectedSkill.id === skill.id;
                return (
                  <div
                    key={skill.id}
                    onClick={() => {
                      sounds.playClick(900);
                      setSelectedSkill(skill);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500/60 shadow-xl ring-2 ring-purple-500/30'
                        : 'bg-[#101018] hover:bg-[#151522] border-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-bold text-white tracking-wide">
                        {skill.name}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md uppercase font-bold ${
                          skill.confidence === 'proficient'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {skill.confidence}
                      </span>
                    </div>

                    <p className="text-xs text-white/70 font-sans leading-relaxed line-clamp-2">
                      {skill.context}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep Relationship & Project Inspector */}
          <div className="lg:col-span-7 space-y-6 bg-[#101018] p-6 sm:p-8 rounded-2xl border border-white/[0.08]">
            <div className="space-y-3 pb-6 border-b border-white/[0.08]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400">
                  {selectedSkill.category} COMPONENT
                </span>
                <span className="text-xs text-emerald-400 uppercase font-semibold">
                  CONFIDENCE: {selectedSkill.confidence}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {selectedSkill.name}
              </h2>
              <p className="text-xs sm:text-sm text-white/80 font-sans leading-relaxed">
                {selectedSkill.context}
              </p>
            </div>

            {/* Proven Projects */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-white/50 tracking-wider">
                <FolderKanban className="w-4 h-4 text-blue-400" />
                <span>INTEGRATED IN PRODUCTION SYSTEMS</span>
              </div>

              {usedInProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {usedInProjects.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/40 transition-all space-y-2 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-white/40 uppercase">{p.category}</span>
                      </div>
                      <p className="text-xs text-white/60 font-sans line-clamp-2">
                        {p.tagline}
                      </p>
                      <button
                        onClick={() => {
                          sounds.playClick(900);
                          setActiveProjectId(p.id);
                          openApp('projects');
                        }}
                        className="text-xs text-blue-400 font-bold flex items-center space-x-1 pt-1"
                      >
                        <span>VIEW ARCHITECTURE</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-white/40 italic">
                  Used across experimental systems and full-stack toolchains.
                </div>
              )}
            </div>

            {/* Connected Stack */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2 text-xs font-bold text-white/50 tracking-wider">
                <GitFork className="w-4 h-4 text-purple-400" />
                <span>CONNECTED TECHNOLOGIES IN SYSTEM GRAPH</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {connectedSkillObjects.map((conn) => (
                  <button
                    key={conn.id}
                    onClick={() => {
                      sounds.playClick(850);
                      setSelectedSkill(conn);
                      setSelectedCategory(conn.category);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-purple-950/50 text-xs text-white/80 hover:text-purple-300 border border-white/[0.08] hover:border-purple-500/40 transition-all font-medium"
                  >
                    {conn.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
