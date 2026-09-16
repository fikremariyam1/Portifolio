'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Project, ArchNode } from '@/types';
import { sounds } from '@/lib/utils';
import {
  Server,
  Database,
  Cpu,
  Radio,
  ExternalLink,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  Code2,
  X,
  Maximize2,
  Minimize2,
  CheckCircle2,
} from 'lucide-react';

interface ArchitectureDiagramProps {
  project: Project;
}

const nodeTypeColors: Record<
  ArchNode['type'],
  { border: string; bg: string; text: string; ring: string; icon: React.ElementType }
> = {
  frontend: {
    border: 'border-blue-500/40',
    bg: 'bg-blue-950/40',
    text: 'text-blue-400',
    ring: 'ring-blue-400/30',
    icon: Code2,
  },
  backend: {
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-950/40',
    text: 'text-emerald-400',
    ring: 'ring-emerald-400/30',
    icon: Server,
  },
  api: {
    border: 'border-cyan-500/40',
    bg: 'bg-cyan-950/40',
    text: 'text-cyan-400',
    ring: 'ring-cyan-400/30',
    icon: Server,
  },
  database: {
    border: 'border-amber-500/40',
    bg: 'bg-amber-950/40',
    text: 'text-amber-400',
    ring: 'ring-amber-400/30',
    icon: Database,
  },
  auth: {
    border: 'border-rose-500/40',
    bg: 'bg-rose-950/40',
    text: 'text-rose-400',
    ring: 'ring-rose-400/30',
    icon: Layers,
  },
  ai: {
    border: 'border-purple-500/40',
    bg: 'bg-purple-950/40',
    text: 'text-purple-400',
    ring: 'ring-purple-400/30',
    icon: Sparkles,
  },
  webrtc: {
    border: 'border-teal-500/40',
    bg: 'bg-teal-950/40',
    text: 'text-teal-400',
    ring: 'ring-teal-400/30',
    icon: Radio,
  },
  external: {
    border: 'border-stone-500/40',
    bg: 'bg-stone-900/50',
    text: 'text-stone-300',
    ring: 'ring-stone-400/30',
    icon: ExternalLink,
  },
  processing: {
    border: 'border-orange-500/40',
    bg: 'bg-orange-950/40',
    text: 'text-orange-400',
    ring: 'ring-orange-400/30',
    icon: Cpu,
  },
};

const getPipelineStages = (projectId: string) => {
  switch (projectId) {
    case 'ai-video-clipper':
      return ['VIDEO INPUT', 'AUDIO EXTRACTION', 'TRANSCRIPTION', 'AI ANALYSIS', 'CLIP ENGINE', 'CAPTIONS & EXPORT'];
    case 'shoel':
      return ['REACT CLIENT', 'FIREBASE AUTH', 'REALTIME FIRESTORE', 'WEBRTC P2P MESH', 'AI STUDY ASSISTANT'];
    case 'tubefetch':
      return ['CLIENT REQUEST', 'FASTAPI ROUTER', 'ASYNC JOB QUEUE', 'YT-DLP DOWNLOAD', 'FFMPEG TRANSCODER', 'MEDIA OUTPUT'];
    default:
      return ['INPUT', 'PROCESSING', 'PERSISTENCE', 'OUTPUT'];
  }
};

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ project }) => {
  const [selectedNode, setSelectedNode] = useState<ArchNode | null>(null);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const { nodes, edges } = project.architecture;

  useEffect(() => {
    setSelectedNode(null);
    setActiveStepIndex(-1);
    setSimulating(false);
  }, [project.id]);

  const handleRunSimulation = () => {
    if (simulating) return;
    sounds.playPacketSound();
    setSimulating(true);
    setActiveStepIndex(0);
    setSelectedNode(nodes[0]);

    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < nodes.length) {
        sounds.playClick(600 + step * 90);
        setActiveStepIndex(step);
        setSelectedNode(nodes[step]);
      } else {
        clearInterval(interval);
        setSimulating(false);
        sounds.playBootChord();
      }
    }, 950);
  };

  const connectedEdgeIds = edges.filter(
    (e) => selectedNode && (e.from === selectedNode.id || e.to === selectedNode.id)
  );
  const connectedNodeIds = new Set(
    connectedEdgeIds.flatMap((e) => [e.from, e.to])
  );

  return (
    <div
      className={`flex flex-col bg-[#07070b] border border-white/[0.08] rounded-2xl overflow-hidden font-mono-code transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-4 z-50 shadow-2xl ring-1 ring-blue-500/40'
          : 'relative w-full min-h-[520px] shadow-xl'
      }`}
    >
      {/* Top Diagram Toolbar */}
      <div className="px-6 py-4 bg-[#0e0e16] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse-dot" />
          <span className="text-sm font-bold text-white tracking-wide">
            {project.name} ARCHITECTURE GRAPH
          </span>
          <span className="text-xs text-white/40 hidden sm:inline">
            // {nodes.length} System Nodes · {edges.length} Data Pipelines
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunSimulation}
            disabled={simulating}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
              simulating
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25 active:scale-95'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : 'fill-white'}`} />
            <span>{simulating ? 'TRACING PIPELINE FLOW...' : 'SIMULATE DATA FLOW'}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white border border-white/[0.08] transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Visualizer'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Diagram Canvas */}
      <div className="flex-1 bg-grid-pattern relative p-6 sm:p-10 flex flex-col justify-between overflow-auto min-h-[440px]">
        {/* End-to-End Visual Dataflow Pipeline Banner */}
        <div className="mb-6 p-4 rounded-xl bg-[#0d101a] border border-white/[0.08] shadow-md">
          <div className="text-[11px] text-white/50 font-bold uppercase tracking-wider mb-2.5 flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span>END-TO-END DATA FLOW PIPELINE:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono-code">
            {getPipelineStages(project.id).map((stage, idx, arr) => (
              <React.Fragment key={stage}>
                <span className="px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1] text-white font-bold whitespace-nowrap">
                  {stage}
                </span>
                {idx < arr.length - 1 && (
                  <span className="text-blue-400 font-bold px-0.5 select-none">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Active Stage Banner during simulation */}
        {simulating && activeStepIndex >= 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 px-4 py-2 rounded-xl bg-blue-950/90 border border-blue-500/40 text-blue-300 text-xs flex items-center space-x-2.5 shadow-xl backdrop-blur-md w-fit"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            <span className="font-bold">
              STAGE {activeStepIndex + 1}/{nodes.length}: {nodes[activeStepIndex]?.label}
            </span>
          </motion.div>
        )}

        {/* Nodes Grid / Flow */}
        <div className="my-auto py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 max-w-5xl mx-auto">
            {nodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              const isConnected = connectedNodeIds.has(node.id);
              const isCurrentSimStep = activeStepIndex === index;
              const colorConfig = nodeTypeColors[node.type] || nodeTypeColors.processing;
              const Icon = colorConfig.icon;

              return (
                <motion.div
                  key={node.id}
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    sounds.playClick(750 + index * 50);
                    setSelectedNode(node);
                  }}
                  className={`cursor-pointer p-5 rounded-2xl border transition-all flex flex-col justify-between min-w-[170px] sm:min-w-[200px] max-w-[240px] shadow-2xl relative select-none ${
                    isSelected
                      ? `${colorConfig.bg} ${colorConfig.border} ring-2 ${colorConfig.ring} scale-105 shadow-blue-500/10`
                      : isConnected
                      ? `${colorConfig.bg} ${colorConfig.border} opacity-100`
                      : 'bg-[#11111a]/90 border-white/10 opacity-75 hover:opacity-100 hover:border-white/25'
                  } ${isCurrentSimStep ? 'ring-4 ring-emerald-400 scale-110 shadow-emerald-500/20' : ''}`}
                >
                  {/* Top node bar */}
                  <div className="flex items-center justify-between space-x-2 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${colorConfig.text}`} />
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${colorConfig.text}`}>
                      {node.type}
                    </span>
                  </div>

                  {/* Title */}
                  <div className="font-bold text-sm text-white mb-2 tracking-wide">
                    {node.label}
                  </div>

                  {/* Tech stack tags */}
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-white/[0.06]">
                    {node.technologies.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-white/60 border border-white/[0.05]"
                      >
                        {t}
                      </span>
                    ))}
                    {node.technologies.length > 2 && (
                      <span className="text-[10px] text-white/30 px-1 py-0.5">
                        +{node.technologies.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Active Simulation Step Pin */}
                  {isCurrentSimStep && (
                    <div className="absolute -top-2.5 -right-2.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-extrabold shadow-lg">
                      ACTIVE
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Data Pipeline Legend / Flow Ribbon */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center space-x-3 overflow-x-auto text-xs text-white/60">
          <span className="text-white/40 text-xs font-semibold whitespace-nowrap">
            EXECUTION PIPELINE:
          </span>
          {edges.map((edge, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-2 whitespace-nowrap px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]"
            >
              <span className="text-white font-medium">{edge.from}</span>
              <span className="text-blue-400 font-bold">→</span>
              <span className="text-white font-medium">{edge.to}</span>
              {edge.label && (
                <span className="text-[10px] text-white/40 italic">({edge.label})</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Slide-Up Node Inspector Drawer when a Node is clicked */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="bg-[#0f0f18] border-t border-white/15 p-6 shadow-2xl relative z-30"
          >
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-2 text-xs text-blue-400">
                  <Info className="w-3.5 h-3.5" />
                  <span className="font-semibold uppercase tracking-wider">
                    {selectedNode.type} COMPONENT INSPECTOR
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide">
                  {selectedNode.label}
                </h3>
                <p className="text-xs sm:text-sm text-white/80 font-sans leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {/* Technologies */}
              <div className="space-y-2 shrink-0 md:min-w-[260px]">
                <div className="text-[11px] text-white/40 font-semibold tracking-wider uppercase">
                  TECHNOLOGY STACK
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg text-xs bg-blue-500/10 text-blue-300 border border-blue-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Close Drawer Button */}
              <button
                onClick={() => setSelectedNode(null)}
                className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white transition-colors"
                title="Close Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
