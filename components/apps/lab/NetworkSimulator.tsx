'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '@/lib/utils';
import { useOSStore } from '@/lib/store/os.store';
import type { NetworkNode, NetworkNodeType, PacketTrace } from '@/types';
import {
  Monitor,
  Router as RouterIcon,
  Layers,
  Server,
  Send,
  RotateCcw,
  Clock,
  Plus,
  Trash2,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders,
  Share2,
} from 'lucide-react';

interface ExtendedNode extends NetworkNode {
  ip: string;
  mac: string;
  packetsSent: number;
  packetsRecv: number;
}

const PRESET_TOPOLOGIES: Record<
  string,
  { name: string; description: string; nodes: ExtendedNode[]; edges: Array<{ from: string; to: string }> }
> = {
  standard: {
    name: 'Standard Edge-to-Cloud',
    description: 'Classic client-to-server route through switch and gateway router.',
    nodes: [
      { id: 'pc-1', type: 'PC', label: 'Client Node', x: 100, y: 100, ip: '192.168.1.105', mac: '52:54:00:12:34:56', packetsSent: 0, packetsRecv: 0 },
      { id: 'switch-1', type: 'SWITCH', label: 'Access Switch', x: 320, y: 100, ip: '192.168.1.2', mac: '00:1A:2B:3C:4D:5E', packetsSent: 0, packetsRecv: 0 },
      { id: 'router-1', type: 'ROUTER', label: 'BGP Gateway', x: 540, y: 100, ip: '10.0.0.1', mac: 'AA:BB:CC:DD:EE:FF', packetsSent: 0, packetsRecv: 0 },
      { id: 'server-1', type: 'SERVER', label: 'API Cluster', x: 760, y: 100, ip: '172.16.0.42', mac: 'EE:FF:00:11:22:33', packetsSent: 0, packetsRecv: 0 },
    ],
    edges: [
      { from: 'pc-1', to: 'switch-1' },
      { from: 'switch-1', to: 'router-1' },
      { from: 'router-1', to: 'server-1' },
    ],
  },
  webrtc: {
    name: 'SHOEL WebRTC P2P Mesh',
    description: 'Decentralized peer-to-peer audio/video mesh where every client routes directly to peers.',
    nodes: [
      { id: 'peer-a', type: 'PC', label: 'Peer A (Presenter)', x: 100, y: 100, ip: '10.200.1.10', mac: '02:00:00:00:00:01', packetsSent: 0, packetsRecv: 0 },
      { id: 'peer-b', type: 'PC', label: 'Peer B (Student)', x: 320, y: 100, ip: '10.200.1.11', mac: '02:00:00:00:00:02', packetsSent: 0, packetsRecv: 0 },
      { id: 'peer-c', type: 'PC', label: 'Peer C (Collaborator)', x: 540, y: 100, ip: '10.200.1.12', mac: '02:00:00:00:00:03', packetsSent: 0, packetsRecv: 0 },
      { id: 'stun-server', type: 'SERVER', label: 'STUN / Signaling', x: 760, y: 100, ip: '10.200.1.1', mac: '02:00:00:00:00:FF', packetsSent: 0, packetsRecv: 0 },
    ],
    edges: [
      { from: 'peer-a', to: 'peer-b' },
      { from: 'peer-b', to: 'peer-c' },
      { from: 'peer-a', to: 'peer-c' },
      { from: 'peer-a', to: 'stun-server' },
      { from: 'peer-c', to: 'stun-server' },
    ],
  },
  tubefetch: {
    name: 'TubeFetch Async Queue',
    description: 'FastAPI task queue distributing video downloads and FFmpeg audio conversion.',
    nodes: [
      { id: 'web-client', type: 'PC', label: 'User Browser', x: 100, y: 100, ip: '192.168.0.50', mac: '44:33:22:11:00:AA', packetsSent: 0, packetsRecv: 0 },
      { id: 'fastapi-gw', type: 'SERVER', label: 'FastAPI Gateway', x: 320, y: 100, ip: '10.0.10.1', mac: '12:34:56:78:90:AB', packetsSent: 0, packetsRecv: 0 },
      { id: 'task-queue', type: 'ROUTER', label: 'Task Broker / Queue', x: 540, y: 100, ip: '10.0.10.2', mac: '98:76:54:32:10:FE', packetsSent: 0, packetsRecv: 0 },
      { id: 'ffmpeg-worker', type: 'SERVER', label: 'FFmpeg Muxer Node', x: 760, y: 100, ip: '10.0.10.20', mac: 'BA:DC:FE:10:20:30', packetsSent: 0, packetsRecv: 0 },
    ],
    edges: [
      { from: 'web-client', to: 'fastapi-gw' },
      { from: 'fastapi-gw', to: 'task-queue' },
      { from: 'task-queue', to: 'ffmpeg-worker' },
    ],
  },
  clipper: {
    name: 'AI Video Clipper Pipeline',
    description: 'Multi-stage AI pipeline routing audio demuxing, faster-whisper transcribing, and Gemini scoring.',
    nodes: [
      { id: 'source-video', type: 'PC', label: 'Video Source Ingest', x: 100, y: 100, ip: '172.20.1.5', mac: '00:A1:B2:C3:D4:E5', packetsSent: 0, packetsRecv: 0 },
      { id: 'whisper-node', type: 'SERVER', label: 'Whisper ASR Node', x: 320, y: 100, ip: '172.20.1.10', mac: '11:22:33:44:55:66', packetsSent: 0, packetsRecv: 0 },
      { id: 'gemini-ai', type: 'ROUTER', label: 'Gemini LLM Scoring', x: 540, y: 100, ip: '172.20.1.20', mac: '77:88:99:AA:BB:CC', packetsSent: 0, packetsRecv: 0 },
      { id: 'opencv-renderer', type: 'SERVER', label: 'OpenCV Clip Cutter', x: 760, y: 100, ip: '172.20.1.30', mac: 'DD:EE:FF:00:11:22', packetsSent: 0, packetsRecv: 0 },
    ],
    edges: [
      { from: 'source-video', to: 'whisper-node' },
      { from: 'whisper-node', to: 'gemini-ai' },
      { from: 'gemini-ai', to: 'opencv-renderer' },
    ],
  },
};

export const NetworkSimulator: React.FC = () => {
  const [currentPreset, setCurrentPreset] = useState<string>('standard');
  const [nodes, setNodes] = useState<ExtendedNode[]>(PRESET_TOPOLOGIES.standard.nodes);
  const [edges, setEdges] = useState<Array<{ from: string; to: string }>>(PRESET_TOPOLOGIES.standard.edges);
  const [sourceNodeId, setSourceNodeId] = useState<string>('pc-1');
  const [destNodeId, setDestNodeId] = useState<string>('server-1');

  const [inspectedNodeId, setInspectedNodeId] = useState<string | null>(null);

  const [activePacket, setActivePacket] = useState<{
    currentHopIndex: number;
    path: string[];
    packetNumber?: number;
  } | null>(null);

  const [traceLog, setTraceLog] = useState<PacketTrace[]>([]);
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [isStressTesting, setIsStressTesting] = useState<boolean>(false);

  const { discoverEasterEgg } = useOSStore();
  const packetCountRef = useRef<number>(0);

  const findPath = (start: string, target: string): string[] | null => {
    if (start === target) return [start];
    const queue: Array<{ node: string; path: string[] }> = [{ node: start, path: [start] }];
    const visited = new Set<string>([start]);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const neighbors: string[] = [];

      edges.forEach((e) => {
        if (e.from === current.node && !visited.has(e.to)) neighbors.push(e.to);
        if (e.to === current.node && !visited.has(e.from)) neighbors.push(e.from);
      });

      for (const next of neighbors) {
        if (next === target) {
          return [...current.path, next];
        }
        visited.add(next);
        queue.push({ node: next, path: [...current.path, next] });
      }
    }
    return null;
  };

  const handleSendPacket = () => {
    if (isTransmitting) return;

    sounds.playPacketSound();
    packetCountRef.current += 1;
    if (packetCountRef.current >= 5) {
      discoverEasterEgg('packetStorm');
    }

    const path = findPath(sourceNodeId, destNodeId);

    if (!path || path.length < 2) {
      sounds.playClick(400);
      setTraceLog((prev) => [
        {
          source: sourceNodeId,
          destination: destNodeId,
          hops: [],
          latency: 0,
          status: 'failed',
        },
        ...prev.slice(0, 9),
      ]);
      return;
    }

    setIsTransmitting(true);
    setActivePacket({ currentHopIndex: 0, path });

    // Update node packet counts
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === sourceNodeId) return { ...n, packetsSent: n.packetsSent + 1 };
        if (n.id === destNodeId) return { ...n, packetsRecv: n.packetsRecv + 1 };
        return n;
      })
    );

    let hop = 0;
    const totalHops = path.length - 1;
    const stepInterval = setInterval(() => {
      hop += 1;
      sounds.playClick(800 + hop * 80);

      if (hop <= totalHops) {
        setActivePacket({ currentHopIndex: hop, path });
      } else {
        clearInterval(stepInterval);
        setIsTransmitting(false);
        setActivePacket(null);
        sounds.playClick(1200);

        const calculatedLatency = (path.length - 1) * 8 + Math.floor(Math.random() * 4);
        setTraceLog((prev) => [
          {
            source: sourceNodeId,
            destination: destNodeId,
            hops: path,
            latency: calculatedLatency,
            status: 'delivered',
          },
          ...prev.slice(0, 9),
        ]);
      }
    }, 450);
  };

  const handleRunStressTest = async () => {
    if (isStressTesting || isTransmitting) return;
    setIsStressTesting(true);
    sounds.playClick(1100);

    const path = findPath(sourceNodeId, destNodeId) || [sourceNodeId, destNodeId];

    for (let i = 1; i <= 5; i++) {
      sounds.playPacketSound();
      await new Promise((r) => setTimeout(r, 220));
      const lat = (path.length - 1) * 7 + Math.floor(Math.random() * 6);
      setTraceLog((prev) => [
        {
          source: sourceNodeId,
          destination: destNodeId,
          hops: path,
          latency: lat,
          status: 'delivered',
        },
        ...prev.slice(0, 9),
      ]);
    }

    discoverEasterEgg('packetStorm');
    setIsStressTesting(false);
    sounds.playClick(1300);
  };

  const handleSelectPreset = (presetKey: string) => {
    sounds.playClick(800);
    const preset = PRESET_TOPOLOGIES[presetKey];
    if (!preset) return;
    setCurrentPreset(presetKey);
    setNodes(preset.nodes);
    setEdges(preset.edges);
    setSourceNodeId(preset.nodes[0]?.id || '');
    setDestNodeId(preset.nodes[preset.nodes.length - 1]?.id || '');
    setActivePacket(null);
    setInspectedNodeId(null);
  };

  const addNode = (type: NetworkNodeType) => {
    sounds.playClick(900);
    const newId = `${type.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const newNode: ExtendedNode = {
      id: newId,
      type,
      label: `Custom ${type}`,
      x: 200,
      y: 200,
      ip: `192.168.10.${Math.floor(10 + Math.random() * 200)}`,
      mac: `00:50:56:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}:${Math.floor(10 + Math.random() * 89)}`,
      packetsSent: 0,
      packetsRecv: 0,
    };

    setNodes((prev) => [...prev, newNode]);
    if (nodes.length > 0) {
      const nearest = nodes[nodes.length - 1];
      setEdges((prev) => [...prev, { from: nearest.id, to: newId }]);
    }
  };

  const removeNode = (nodeId: string) => {
    sounds.playClick(600);
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setEdges((prev) => prev.filter((e) => e.from !== nodeId && e.to !== nodeId));
    if (sourceNodeId === nodeId) {
      const remaining = nodes.filter((n) => n.id !== nodeId);
      setSourceNodeId(remaining[0]?.id || '');
    }
    if (destNodeId === nodeId) {
      const remaining = nodes.filter((n) => n.id !== nodeId);
      setDestNodeId(remaining[remaining.length - 1]?.id || '');
    }
    if (inspectedNodeId === nodeId) setInspectedNodeId(null);
  };

  const resetTopology = () => {
    handleSelectPreset('standard');
    setTraceLog([]);
  };

  const getNodeIcon = (type: NetworkNodeType) => {
    switch (type) {
      case 'PC':
        return Monitor;
      case 'SWITCH':
        return Layers;
      case 'ROUTER':
        return RouterIcon;
      case 'SERVER':
        return Server;
    }
  };

  const inspectedNode = nodes.find((n) => n.id === inspectedNodeId);

  return (
    <div className="flex-1 w-full flex flex-col bg-[#0a0c14] text-white select-text p-6 sm:p-8 md:p-10 max-w-6xl mx-auto space-y-6 overflow-y-auto">
      {/* Top Architecture Presets Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono-code font-bold">
            <Share2 className="w-4 h-4" />
            <span>TOPOLOGY ARCHITECTURE PRESETS</span>
          </div>
          <p className="text-xs text-white/60 font-sans">
            {PRESET_TOPOLOGIES[currentPreset]?.description}
          </p>
        </div>

        {/* Preset Selector Buttons */}
        <div className="flex flex-wrap gap-2 bg-[#0d101d] border border-white/[0.1] p-1.5 rounded-2xl">
          {Object.entries(PRESET_TOPOLOGIES).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handleSelectPreset(key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono-code transition-all ${
                currentPreset === key
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/30 scale-[1.02] border border-emerald-400'
                  : 'bg-[#151928] text-white/60 hover:text-white border border-white/[0.08] hover:border-white/[0.2]'
              }`}
            >
              {preset.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Simulation Controls Toolbar */}
      <div className="p-5 rounded-2xl bg-[#121522] border border-white/[0.08] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-lg">
        {/* Source and Destination Pickers */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-[#181d2e] px-3.5 py-2 rounded-xl border border-white/[0.08]">
            <span className="text-white/40 text-xs font-bold font-mono-code">SRC:</span>
            <select
              value={sourceNodeId}
              onChange={(e) => setSourceNodeId(e.target.value)}
              className="bg-transparent text-blue-400 font-bold focus:outline-none cursor-pointer text-xs sm:text-sm font-mono-code"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id} className="bg-[#181d2e] text-white">
                  {n.label} ({n.type})
                </option>
              ))}
            </select>
          </div>

          <span className="text-white/40 font-bold text-sm">→</span>

          <div className="flex items-center space-x-2 bg-[#181d2e] px-3.5 py-2 rounded-xl border border-white/[0.08]">
            <span className="text-white/40 text-xs font-bold font-mono-code">DST:</span>
            <select
              value={destNodeId}
              onChange={(e) => setDestNodeId(e.target.value)}
              className="bg-transparent text-emerald-400 font-bold focus:outline-none cursor-pointer text-xs sm:text-sm font-mono-code"
            >
              {nodes.map((n) => (
                <option key={n.id} value={n.id} className="bg-[#181d2e] text-white">
                  {n.label} ({n.type})
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons: Dispatch & Stress Test */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSendPacket}
              disabled={isTransmitting || isStressTesting || sourceNodeId === destNodeId}
              className={`px-4 py-2.5 rounded-xl font-bold font-mono-code text-xs flex items-center space-x-2 transition-all ${
                isTransmitting
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 cursor-wait'
                  : sourceNodeId === destNodeId
                  ? 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/30 active:scale-95'
              }`}
            >
              <Send className={`w-3.5 h-3.5 ${isTransmitting ? 'animate-bounce' : ''}`} />
              <span>{isTransmitting ? 'ROUTING...' : 'SEND PACKET'}</span>
            </button>

            <button
              onClick={handleRunStressTest}
              disabled={isTransmitting || isStressTesting || sourceNodeId === destNodeId}
              className="px-3.5 py-2.5 rounded-xl font-bold font-mono-code text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center space-x-1.5 transition-all active:scale-95"
              title="Flood Route with 5 Rapid Packets"
            >
              <Zap className={`w-3.5 h-3.5 ${isStressTesting ? 'animate-spin' : ''}`} />
              <span>{isStressTesting ? 'BURSTING...' : 'BURST (5x)'}</span>
            </button>
          </div>
        </div>

        {/* Add Nodes & Reset */}
        <div className="flex items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-white/[0.06]">
          <span className="text-xs text-white/40 font-mono-code hidden sm:inline mr-1">+ ADD:</span>
          {(['PC', 'SWITCH', 'ROUTER', 'SERVER'] as NetworkNodeType[]).map((type) => (
            <button
              key={type}
              onClick={() => addNode(type)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono-code bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white border border-white/[0.08] transition-colors"
            >
              {type}
            </button>
          ))}
          <button
            onClick={resetTopology}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors ml-1"
            title="Reset to Default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Transmission Stage Banner */}
      {activePacket && (
        <div className="p-4 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs sm:text-sm font-bold flex items-center space-x-3 shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-ping" />
          <span>
            PACKET IN FLIGHT → CURRENT HOP: &quot;{activePacket.path[activePacket.currentHopIndex]}&quot; (STAGE {activePacket.currentHopIndex + 1}/{activePacket.path.length})
          </span>
        </div>
      )}

      {/* Node Topology Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {nodes.map((node) => {
          const Icon = getNodeIcon(node.type);
          const isSource = node.id === sourceNodeId;
          const isDest = node.id === destNodeId;
          const isPacketHere =
            activePacket && activePacket.path[activePacket.currentHopIndex] === node.id;
          const isInspected = inspectedNodeId === node.id;

          return (
            <motion.div
              key={node.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                sounds.playClick(750);
                setInspectedNodeId(node.id);
              }}
              className={`p-5 rounded-2xl border flex flex-col justify-between min-h-[190px] shadow-xl transition-all relative cursor-pointer ${
                isPacketHere
                  ? 'bg-emerald-950/80 border-emerald-400 ring-4 ring-emerald-400/40 scale-105 shadow-emerald-500/20'
                  : isInspected
                  ? 'bg-[#181d2e] border-purple-500/80 ring-2 ring-purple-500/40'
                  : isSource
                  ? 'bg-blue-950/50 border-blue-500 ring-2 ring-blue-500/30'
                  : isDest
                  ? 'bg-emerald-950/40 border-emerald-500/50'
                  : 'bg-[#121522] border-white/10 hover:border-white/20'
              }`}
            >
              {/* Card Top Row: Role & Tag */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold font-mono-code px-2 py-0.5 rounded bg-white/[0.04] text-white/50 uppercase">
                  {node.type}
                </span>

                <div className="flex items-center space-x-1">
                  {isSource && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-500 text-white text-[9px] font-bold font-mono-code">
                      SRC
                    </span>
                  )}
                  {isDest && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-black text-[9px] font-bold font-mono-code">
                      DST
                    </span>
                  )}
                  {nodes.length > 2 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNode(node.id);
                      }}
                      className="text-white/20 hover:text-red-400 p-1 transition-colors"
                      title="Delete Node"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center my-2">
                <Icon
                  className={`w-5 h-5 ${
                    isPacketHere
                      ? 'text-emerald-400 animate-pulse'
                      : isSource
                      ? 'text-blue-400'
                      : isDest
                      ? 'text-emerald-400'
                      : 'text-white/70'
                  }`}
                />
              </div>

              {/* Title & Info */}
              <div className="space-y-1">
                <div className="font-bold text-sm text-white tracking-wide truncate">
                  {node.label}
                </div>
                <div className="flex items-center justify-between text-[10px] text-white/40 font-mono-code">
                  <span>{node.ip}</span>
                  <span className="text-emerald-400">Tx:{node.packetsSent} Rx:{node.packetsRecv}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Node Deep Inspector (When Clicked) */}
      <AnimatePresence>
        {inspectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-6 rounded-2xl bg-[#141828] border border-purple-500/40 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold font-mono-code text-white">
                  NODE HARDWARE & INTERFACE INSPECTOR: {inspectedNode.label}
                </span>
              </div>
              <button
                onClick={() => setInspectedNodeId(null)}
                className="text-xs text-white/40 hover:text-white font-mono-code"
              >
                CLOSE [✕]
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono-code">
              <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                <div className="text-white/40 text-[10px]">IPV4 ADDRESS</div>
                <div className="text-blue-400 font-bold">{inspectedNode.ip}</div>
              </div>
              <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                <div className="text-white/40 text-[10px]">MAC LAYER 2</div>
                <div className="text-purple-400 font-bold">{inspectedNode.mac}</div>
              </div>
              <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                <div className="text-white/40 text-[10px]">CONNECTED PEERS</div>
                <div className="text-white font-bold">
                  {edges.filter((e) => e.from === inspectedNode.id || e.to === inspectedNode.id).length} Active Links
                </div>
              </div>
              <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                <div className="text-white/40 text-[10px]">LINK STATUS</div>
                <div className="text-emerald-400 font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>1000 Mbps Full-Duplex</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => {
                  sounds.playClick(800);
                  setSourceNodeId(inspectedNode.id);
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-mono-code font-bold transition-colors"
              >
                SET AS SOURCE (SRC)
              </button>
              <button
                onClick={() => {
                  sounds.playClick(800);
                  setDestNodeId(inspectedNode.id);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-mono-code font-bold transition-colors"
              >
                SET AS DESTINATION (DST)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Telemetry Trace Log */}
      {traceLog.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#121522] border border-white/[0.08] space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-white/50 uppercase tracking-wider font-mono-code">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>PACKET ROUTING TELEMETRY LOG</span>
            </div>
            <button
              onClick={() => setTraceLog([])}
              className="text-[10px] text-white/40 hover:text-white font-mono-code"
            >
              CLEAR LOG
            </button>
          </div>

          <div className="space-y-2">
            {traceLog.map((trace, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center space-x-3 font-mono-code">
                  <span className="font-bold text-white">
                    {trace.source} → {trace.destination}
                  </span>
                  <span className="text-white/40 text-[11px]">
                    ({trace.hops.join(' → ')})
                  </span>
                </div>

                <div className="flex items-center space-x-3 font-mono-code">
                  <span className="text-blue-400 font-bold">{trace.latency}ms Latency</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-md font-bold uppercase text-[10px] ${
                      trace.status === 'delivered'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {trace.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
