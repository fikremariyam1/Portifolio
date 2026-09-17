'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { identity, timeline } from '@/lib/data/portfolio';
import { sounds } from '@/lib/utils';
import { useOSStore } from '@/lib/store/os.store';
import {
  User,
  Calendar,
  ShieldCheck,
  Sparkles,
  GraduationCap,
  MapPin,
  CheckCircle2,
  Code2,
  Cpu,
  Bot,
  Palette,
  Briefcase,
  ArrowRight,
  Compass,
} from 'lucide-react';

type TabType = 'overview' | 'pillars' | 'experience' | 'philosophy';

export const AboutApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedPillar, setSelectedPillar] = useState<string>('SOFTWARE');
  const { openApp } = useOSStore();

  const domainData: Record<
    string,
    { title: string; icon: React.ElementType; description: string; tech: string[]; highlight: string }
  > = {
    SOFTWARE: {
      title: 'Full-Stack Software Engineering',
      icon: Code2,
      description:
        'Designing end-to-end full-stack applications with robust architectures, strong typing, clean component boundaries, and reactive interfaces.',
      tech: ['React 19', 'Next.js 15', 'TypeScript', 'Tailwind CSS', 'Node.js'],
      highlight: 'Production-ready web applications with zero-lag user experiences.',
    },
    SYSTEMS: {
      title: 'Systems & Backend Architecture',
      icon: Cpu,
      description:
        'Constructing resilient backend pipelines, asynchronous job workers, WebRTC peer meshes, and high-performance media transcoding workflows.',
      tech: ['Python', 'FastAPI', 'FFmpeg', 'WebRTC', 'SQLite / PostgreSQL'],
      highlight: 'Asynchronous task queues and real-time streaming engines.',
    },
    AI: {
      title: 'Applied AI & Intelligent Pipelines',
      icon: Bot,
      description:
        'Integrating state-of-the-art foundation models, semantic analysis, speech transcription, and computer vision into actionable product workflows.',
      tech: ['Gemini API', 'faster-whisper', 'OpenCV', 'Prompt Architecture', 'Vector Search'],
      highlight: 'Context-grounded AI tools that automate complex multimedia tasks.',
    },
    CREATIVE: {
      title: 'Creative Technology & Motion',
      icon: Palette,
      description:
        'Blending software engineering with motion graphics, video storytelling, and editorial precision to create visually compelling digital experiences.',
      tech: ['Motion Graphics', 'UI/UX Interaction', 'Framer Motion', 'Visual Storytelling'],
      highlight: 'Cinematic visual flair grounded in engineering discipline.',
    },
    ENTREPRENEURSHIP: {
      title: 'Product Mindset & Execution',
      icon: Briefcase,
      description:
        'Identifying unsolved problems, defining product roadmaps, and executing full product lifecycles from architecture to deployment and iteration.',
      tech: ['Product Design', 'Rapid Prototyping', 'System Optimization', 'User Empathy'],
      highlight: 'Shipping functional, complete products that deliver tangible utility.',
    },
  };

  return (
    <div className="flex-1 w-full flex flex-col bg-[#08090f] text-white select-text overflow-hidden">
      {/* Navigation Sub-Header */}
      <div className="px-6 py-4 bg-[#0a0c16] border-b border-white/[0.12] flex items-center justify-between gap-4 shrink-0 overflow-x-auto shadow-lg shadow-black/30">
        <div className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-2xl bg-[#111424] border border-white/[0.1]">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'pillars', label: 'Disciplines & Pillars', icon: Compass },
            { id: 'experience', label: 'Journey & Timeline', icon: Calendar },
            { id: 'philosophy', label: 'Philosophy', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sounds.playClick(900);
                  setActiveTab(tab.id as TabType);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/35 border border-blue-400 ring-2 ring-blue-500/20 scale-[1.02]'
                    : 'bg-[#161a2c] hover:bg-[#1f243c] text-white/80 hover:text-white border border-white/[0.08] hover:border-white/[0.2]'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => openApp('contact')}
          className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono-code font-bold transition-all shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
          <span>ESTABLISH CONTACT</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-10">
              {/* SECTION 01: DEVELOPER IDENTITY (HERO) */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-1">
                  <span className="px-2.5 py-1 rounded-md bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold text-xs font-mono-code shadow-sm">
                    01
                  </span>
                  <span className="text-xs sm:text-sm font-bold font-mono-code uppercase tracking-widest text-white/90">
                    PROFILE & IDENTITY
                  </span>
                </div>

                <div className="p-7 sm:p-9 rounded-2xl bg-[#0e1220] border border-blue-500/30 shadow-2xl relative overflow-hidden">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    {/* Portrait Avatar & Status Badge */}
                    <div className="shrink-0 flex flex-col items-center group">
                      <div className="w-40 h-52 sm:w-48 sm:h-60 rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-[#141828] relative flex items-end justify-center">
                        <Image
                          src={identity.avatar || '/developer.png'}
                          alt={identity.name}
                          fill
                          sizes="(max-width: 768px) 160px, 192px"
                          className="object-contain object-bottom transition-transform duration-500 group-hover:scale-105"
                          priority
                        />
                        <div className="absolute bottom-2.5 z-10 bg-[#090b14]/85 backdrop-blur-md border border-emerald-500/50 text-emerald-400 text-[10px] sm:text-[11px] font-mono-code font-bold px-3 py-1 sm:px-3.5 sm:py-1 rounded-full flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shadow-xl">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
                          <span>AVAILABLE FOR WORK</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio & Intro */}
                    <div className="flex-1 space-y-4 text-center md:text-left">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <span className="text-xs font-mono-code px-3 py-1 rounded-md bg-blue-500/15 text-blue-400 border border-blue-500/30 font-bold uppercase tracking-wider">
                          CS GRADUATE
                        </span>
                        <span className="text-xs font-mono-code px-3 py-1 rounded-md bg-purple-500/15 text-purple-400 border border-purple-500/30 font-bold uppercase tracking-wider">
                          FULL-STACK & SYSTEMS
                        </span>
                        <span className="text-xs font-mono-code px-3 py-1 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider">
                          APPLIED AI
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                          {identity.name}
                        </h1>
                        <p className="text-sm sm:text-base font-bold text-blue-400 font-mono-code">
                          {identity.tagline}
                        </p>
                      </div>

                      <p className="text-sm sm:text-base text-white/80 font-sans leading-relaxed pt-1">
                        {identity.summary}
                      </p>

                      {/* Quick Exploration Pills */}
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                        <button
                          onClick={() => openApp('projects')}
                          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white border border-blue-400 font-mono-code font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>Projects Catalog →</span>
                        </button>
                        <button
                          onClick={() => openApp('skills')}
                          className="px-4 py-2.5 rounded-xl bg-[#161a2e] hover:bg-[#202642] text-white/90 hover:text-white border border-white/20 font-mono-code font-bold text-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
                        >
                          <Cpu className="w-3.5 h-3.5 text-purple-400" />
                          <span>Skills Matrix →</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 02: KEY CREDENTIALS & BACKGROUND (SEMANTICALLY COLOR-CODED) */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-1">
                  <span className="px-2.5 py-1 rounded-md bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-xs font-mono-code shadow-sm">
                    02
                  </span>
                  <span className="text-xs sm:text-sm font-bold font-mono-code uppercase tracking-widest text-white/90">
                    KEY CREDENTIALS & CAPABILITIES
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Card A: Academic */}
                  <div className="p-6 rounded-2xl bg-[#0b0e1a] border border-blue-500/25 space-y-3 shadow-xl hover:border-blue-500/50 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] font-mono-code text-blue-400 font-bold uppercase">
                        ACADEMIC DEGREE
                      </div>
                      <div className="text-base font-extrabold text-white">Computer Science Graduate</div>
                    </div>
                    <p className="text-xs sm:text-sm text-white/65 font-sans leading-relaxed">
                      Algorithms, data structures, distributed system architectures, and computer networking fundamentals.
                    </p>
                  </div>

                  {/* Card B: Location */}
                  <div className="p-6 rounded-2xl bg-[#100c1e] border border-purple-500/25 space-y-3 shadow-xl hover:border-purple-500/50 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] font-mono-code text-purple-400 font-bold uppercase">
                        LOCATION & SCOPE
                      </div>
                      <div className="text-base font-extrabold text-white">{identity.location}</div>
                    </div>
                    <p className="text-xs sm:text-sm text-white/65 font-sans leading-relaxed">
                      Open to global remote software engineering positions, contractor work, and product engineering teams.
                    </p>
                  </div>

                  {/* Card C: Specialization */}
                  <div className="p-6 rounded-2xl bg-[#091316] border border-emerald-500/25 space-y-3 shadow-xl hover:border-emerald-500/50 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-[11px] font-mono-code text-emerald-400 font-bold uppercase">
                        PRIMARY SPECIALIZATION
                      </div>
                      <div className="text-base font-extrabold text-white">Full-Stack & Applied AI</div>
                    </div>
                    <p className="text-xs sm:text-sm text-white/65 font-sans leading-relaxed">
                      Constructing resilient web architectures, asynchronous job queues, and AI-augmented media workflows.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 03: CORE ENGINEERING DISCIPLINES */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-1">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs font-mono-code shadow-sm">
                    03
                  </span>
                  <span className="text-xs sm:text-sm font-bold font-mono-code uppercase tracking-widest text-white/90">
                    CORE DOMAINS & ROLES
                  </span>
                </div>

                <div className="p-6 sm:p-7 rounded-2xl bg-[#0d101b] border border-white/[0.1] shadow-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {identity.roles.map((role) => (
                      <div
                        key={role}
                        className="p-3.5 rounded-xl bg-[#141828] hover:bg-[#1a2036] text-white font-mono-code font-bold text-xs border border-white/15 transition-colors flex items-center gap-3"
                      >
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shrink-0" />
                        <span>{role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 04: NEXT STEP (SYSTEMS SHOWCASE CTA) */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 pb-1">
                  <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs font-mono-code shadow-sm">
                    04
                  </span>
                  <span className="text-xs sm:text-sm font-bold font-mono-code uppercase tracking-widest text-white/90">
                    EXPLORE SYSTEMS & ARCHITECTURES
                  </span>
                </div>

                <div className="p-8 rounded-2xl bg-[#0b1328] border border-blue-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <h3 className="text-base sm:text-lg font-black text-white font-mono-code">
                      INSPECT LIVE ARCHITECTURE DATAFLOWS
                    </h3>
                    <p className="text-xs sm:text-sm text-white/70 font-sans max-w-xl">
                      Experience interactive architecture diagrams, state machines, and technical decisions for production apps and backend engines.
                    </p>
                  </div>
                  <button
                    onClick={() => openApp('projects')}
                    className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white border border-blue-400 font-bold font-mono-code text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-blue-600/30 transition-all shrink-0 cursor-pointer active:scale-95"
                  >
                    <span>OPEN PROJECTS APP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DISCIPLINES & PILLARS */}
          {activeTab === 'pillars' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white font-mono-code">
                  CORE DISCIPLINES & EXPERTISE
                </h2>
                <p className="text-xs text-white/60 font-sans">
                  Click on any pillar to view detailed capability breakdowns and technical stack.
                </p>
              </div>

              {/* Pillar Selector Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {identity.domains.map((domain) => {
                  const data = domainData[domain];
                  const Icon = data.icon;
                  const isSelected = selectedPillar === domain;

                  return (
                    <button
                      key={domain}
                      onClick={() => {
                        sounds.playClick(900);
                        setSelectedPillar(domain);
                      }}
                      className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-600/30 scale-[1.02]'
                          : 'bg-[#111422] border-white/[0.08] text-white/70 hover:bg-[#161a2c] hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div>
                        <div className="text-[10px] font-mono-code opacity-60 uppercase">
                          PILLAR
                        </div>
                        <div className="text-xs sm:text-sm font-bold tracking-wide">
                          {domain}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Pillar Detailed View */}
              {domainData[selectedPillar] && (
                <div className="p-6 sm:p-8 rounded-2xl bg-[#111422] border border-white/[0.08] space-y-5 shadow-xl">
                  <div className="flex items-center space-x-3 pb-4 border-b border-white/[0.08]">
                    <span className="text-xs font-mono-code font-bold px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/40">
                      [{selectedPillar}]
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {domainData[selectedPillar].title}
                    </h3>
                  </div>

                  <p className="text-sm text-white/85 font-sans leading-relaxed">
                    {domainData[selectedPillar].description}
                  </p>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                    <div className="text-xs font-mono-code text-blue-400 font-bold">
                      KEY VALUE & HIGHLIGHT
                    </div>
                    <div className="text-xs text-white/80 font-sans">
                      {domainData[selectedPillar].highlight}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-mono-code text-white/50 font-bold uppercase">
                      ASSOCIATED TECHNOLOGIES & TOOLS
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {domainData[selectedPillar].tech.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-3 py-1 rounded-lg bg-white/[0.05] text-white border border-white/[0.08] font-mono-code"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TIMELINE & EXPERIENCE */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white font-mono-code">
                  CHRONOLOGICAL JOURNEY (2022 — PRESENT)
                </h2>
                <p className="text-xs text-white/60 font-sans">
                  From Computer Science foundations to shipping production-level systems and AI integrations.
                </p>
              </div>

              <div className="space-y-4">
                {timeline.map((entry) => (
                  <div
                    key={entry.year}
                    className="p-5 sm:p-6 rounded-2xl bg-[#111422] border border-white/[0.08] hover:border-white/[0.16] transition-all space-y-3 shadow-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold font-mono-code px-3 py-1 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/40">
                        {entry.year}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {entry.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-white/75 font-sans leading-relaxed">
                      {entry.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {entry.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/[0.04] text-white/60 border border-white/[0.06] font-mono-code"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PHILOSOPHY */}
          {activeTab === 'philosophy' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white font-mono-code">
                  ENGINEERING PRINCIPLES
                </h2>
                <p className="text-xs text-white/60 font-sans">
                  The foundational tenets guiding code architecture, user experience, and systems delivery.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-[#101322] border border-blue-500/30 space-y-4 shadow-xl">
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-400 font-mono-code">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="tracking-widest uppercase">THE CORE BELIEF</span>
                </div>
                <blockquote className="text-base sm:text-lg text-white/90 font-sans italic leading-relaxed">
                  &quot;Real software engineering combines architectural rigor with thoughtful user experience. The best systems are those where complex data pipelines operate invisibly behind clean, effortless interfaces.&quot;
                </blockquote>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-[#111422] border border-white/10 space-y-3 shadow-lg">
                  <div className="flex items-center gap-2.5 text-xs font-mono-code text-blue-400 font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-300">01</span>
                    <span className="tracking-wider">ARCHITECTURAL RIGOR</span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
                    Prioritize strong types, clear data boundaries, atomic state transactions, and graceful error recovery over quick hacks.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#111422] border border-white/10 space-y-3 shadow-lg">
                  <div className="flex items-center gap-2.5 text-xs font-mono-code text-purple-400 font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300">02</span>
                    <span className="tracking-wider">ASYNCHRONOUS PIPELINES</span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
                    Offload heavy computing, media transcoding, and AI evaluations to dedicated background workers without blocking client responsiveness.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#111422] border border-white/10 space-y-3 shadow-lg">
                  <div className="flex items-center gap-2.5 text-xs font-mono-code text-emerald-400 font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">03</span>
                    <span className="tracking-wider">GROUNDED AI SYSTEMS</span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
                    Integrate AI where it adds measurable leverage — transcription, summarization, and automation — anchored with strict validation.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#111422] border border-white/10 space-y-3 shadow-lg">
                  <div className="flex items-center gap-2.5 text-xs font-mono-code text-amber-400 font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300">04</span>
                    <span className="tracking-wider">CRAFTSMANSHIP & POLISH</span>
                  </div>
                  <p className="text-xs sm:text-sm text-white/70 font-sans leading-relaxed">
                    Software should feel tactile, fast, and pleasant. Sound effects, feedback animations, and dark minimalist aesthetics elevate utility.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
