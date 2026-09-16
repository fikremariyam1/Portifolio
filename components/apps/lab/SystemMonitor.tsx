'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useOSStore, APP_CONFIGS } from '@/lib/store/os.store';
import { sounds } from '@/lib/utils';
import type { AppId } from '@/types';
import {
  Activity,
  Cpu,
  Clock,
  Layers,
  Server,
  Sparkles,
  Zap,
  Volume2,
  Play,
  Square,
  CheckCircle2,
  HardDrive,
  Globe,
  Radio,
} from 'lucide-react';

export const SystemMonitor: React.FC = () => {
  const { windows, activeAppId, openApp, closeApp } = useOSStore();

  const [fps, setFps] = useState<number>(60);
  const [domCount, setDomCount] = useState<number>(0);
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(0);
  const [screenRes, setScreenRes] = useState<string>('1920x1080');
  const [memoryHeap, setMemoryHeap] = useState<string>('N/A');

  const [cpuLoad, setCpuLoad] = useState<number>(14);
  const [networkRequests, setNetworkRequests] = useState<number>(18);
  const [clusterLatency, setClusterLatency] = useState<number>(19);
  const [cpuHistory, setCpuHistory] = useState<number[]>([12, 14, 13, 16, 15, 14, 18, 14, 15, 12, 16, 14]);

  // Live Benchmark state
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [benchmarkScore, setBenchmarkScore] = useState<number | null>(null);
  const [benchmarkOps, setBenchmarkOps] = useState<number | null>(null);

  // Audio tone generator diagnostic
  const [isPlayingTone, setIsPlayingTone] = useState<boolean>(false);
  const [toneFreq, setToneFreq] = useState<number>(440);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenRes(`${window.innerWidth}x${window.innerHeight}`);
      setDomCount(document.querySelectorAll('*').length);

      const perf = window.performance as unknown as {
        memory?: { usedJSHeapSize: number; totalJSHeapSize: number };
      };
      if (perf.memory) {
        setMemoryHeap(`${Math.round(perf.memory.usedJSHeapSize / (1024 * 1024))} MB`);
      }
    }

    let lastTime = performance.now();
    let frameCount = 0;
    let animId: number;

    const calcFps = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(calcFps);
    };
    animId = requestAnimationFrame(calcFps);

    const timer = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
      const nextCpu = Math.floor(10 + Math.random() * 14);
      setCpuLoad(nextCpu);
      setCpuHistory((prev) => [...prev.slice(1), nextCpu]);
      setClusterLatency(Math.floor(14 + Math.random() * 8));
      setNetworkRequests((prev) => prev + (Math.random() > 0.6 ? 1 : 0));
    }, 1000);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(timer);
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const formatUptime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const runBenchmark = async () => {
    if (isBenchmarking) return;
    setIsBenchmarking(true);
    setBenchmarkScore(null);
    sounds.playClick(1000);

    await new Promise((r) => setTimeout(r, 100));

    const start = performance.now();
    let count = 0;
    // 5 million math operations test
    for (let i = 0; i < 5000000; i++) {
      count += Math.sqrt(i) * Math.sin(i);
    }
    const elapsed = performance.now() - start;

    const mops = Math.round((5000000 / (elapsed / 1000)) / 1000000);
    const score = Math.max(100, Math.round(100000 / elapsed));

    setBenchmarkOps(mops);
    setBenchmarkScore(score);
    setIsBenchmarking(false);
    sounds.playClick(1400);
  };

  const toggleTone = (freq = 440) => {
    if (isPlayingTone) {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
        oscRef.current = null;
      }
      setIsPlayingTone(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = audioCtxRef.current || new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        oscRef.current = osc;
        setToneFreq(freq);
        setIsPlayingTone(true);
      } catch {
        setIsPlayingTone(false);
      }
    }
  };

  const openAppsList = (Object.keys(windows) as AppId[]).filter((id) => windows[id].isOpen);

  return (
    <div className="flex-1 w-full flex flex-col bg-[#0a0c14] text-white select-text p-6 sm:p-8 md:p-10 max-w-6xl mx-auto space-y-8 overflow-y-auto">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center space-x-3 text-xs font-mono-code font-bold">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="text-white text-sm">SYSTEM TELEMETRY & RUNTIME DIAGNOSTICS</span>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono-code bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
          <span className="text-emerald-400 font-bold">KERNEL & THREADS ACTIVE</span>
        </div>
      </div>

      {/* Section 1: Live Hardware & Browser Metrics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono-code">
          <span className="font-bold text-emerald-400 uppercase tracking-wider">1. HARDWARE & CLIENT RUNTIME METRICS</span>
          <span className="text-[10px] bg-emerald-500/15 text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-500/30 font-bold">
            LIVE SENSORS
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#121522] border border-white/[0.08] space-y-1.5 shadow-md">
            <div className="text-xs text-white/50 flex items-center justify-between font-mono-code">
              <span>RENDER FPS</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono-code">{fps}</div>
            <div className="text-[10px] text-white/40 font-mono-code">VSync Target: 60 FPS</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121522] border border-white/[0.08] space-y-1.5 shadow-md">
            <div className="text-xs text-white/50 flex items-center justify-between font-mono-code">
              <span>SESSION UPTIME</span>
              <Clock className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-mono-code">{formatUptime(uptimeSeconds)}</div>
            <div className="text-[10px] text-white/40 font-mono-code">Current OS Runtime</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121522] border border-white/[0.08] space-y-1.5 shadow-md">
            <div className="text-xs text-white/50 flex items-center justify-between font-mono-code">
              <span>DOM REACT NODES</span>
              <Layers className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-purple-400 font-mono-code">{domCount}</div>
            <div className="text-[10px] text-white/40 font-mono-code">Screen: {screenRes}</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121522] border border-white/[0.08] space-y-1.5 shadow-md">
            <div className="text-xs text-white/50 flex items-center justify-between font-mono-code">
              <span>JS HEAP MEMORY</span>
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono-code">{memoryHeap}</div>
            <div className="text-[10px] text-white/40 font-mono-code">V8 Engine Allocated</div>
          </div>
        </div>
      </div>

      {/* Section 2: Interactive Real-Time JavaScript Benchmark */}
      <div className="p-6 rounded-2xl bg-[#121522] border border-white/[0.08] space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono-code font-bold text-white">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>CLIENT COMPUTATIONAL BENCHMARK (5M FLOPS TEST)</span>
            </div>
            <p className="text-xs text-white/60 font-sans">
              Executes 5,000,000 trigonometric and algebraic math operations on your browser engine to measure execution throughput.
            </p>
          </div>

          <button
            onClick={runBenchmark}
            disabled={isBenchmarking}
            className={`px-4 py-2.5 rounded-xl font-mono-code text-xs font-bold flex items-center space-x-2 transition-all shrink-0 ${
              isBenchmarking
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-wait animate-pulse'
                : 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/25 active:scale-95'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isBenchmarking ? 'BENCHMARKING...' : 'RUN BENCHMARK'}</span>
          </button>
        </div>

        {benchmarkScore !== null && benchmarkOps !== null && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <span className="text-xs font-mono-code text-white/70">COMPUTATION SPEED:</span>
              <span className="text-sm font-bold font-mono-code text-amber-400">{benchmarkOps} Million Ops/Sec</span>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
              <span className="text-xs font-mono-code text-white/70">BENCHMARK SCORE:</span>
              <span className="text-sm font-bold font-mono-code text-emerald-400">{benchmarkScore} PTS (OPTIMIZED)</span>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Active OS Process Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono-code">
          <span className="font-bold text-white/70 uppercase tracking-wider">3. ACTIVE OS PROCESSES & INSTANCES</span>
          <span className="text-xs text-blue-400 font-mono-code font-bold">
            {openAppsList.length} APPS RUNNING
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono-code bg-[#121522] rounded-2xl border border-white/[0.08] overflow-hidden">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-white/40 text-left">
                <th className="p-3.5 pl-5">PROCESS ID</th>
                <th className="p-3.5">APPLICATION</th>
                <th className="p-3.5">STATUS</th>
                <th className="p-3.5">Z-INDEX</th>
                <th className="p-3.5 pr-5 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {(Object.keys(APP_CONFIGS) as AppId[]).map((appId) => {
                const config = APP_CONFIGS[appId];
                const win = windows[appId];
                const isOpen = win.isOpen && !win.isMinimized;
                const isFocused = activeAppId === appId && isOpen;

                return (
                  <tr key={appId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3.5 pl-5 text-white/50">{appId}.exe</td>
                    <td className="p-3.5 font-bold text-white flex items-center space-x-2">
                      <span className="truncate">{config.title.split('//')[0]}</span>
                      {isFocused && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[9px]">FOCUSED</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isOpen
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : win.isMinimized
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-white/[0.04] text-white/30'
                        }`}
                      >
                        {isOpen ? 'RUNNING' : win.isMinimized ? 'MINIMIZED' : 'IDLE'}
                      </span>
                    </td>
                    <td className="p-3.5 text-white/40">Z:{win.zIndex}</td>
                    <td className="p-3.5 pr-5 text-right">
                      {isOpen ? (
                        <button
                          onClick={() => closeApp(appId)}
                          className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white transition-colors text-[10px] font-bold"
                        >
                          TERMINATE
                        </button>
                      ) : (
                        <button
                          onClick={() => openApp(appId)}
                          className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white transition-colors text-[10px] font-bold"
                        >
                          LAUNCH
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 4: Web Audio Oscillator Synthesizer Diagnostic */}
      <div className="p-6 rounded-2xl bg-[#121522] border border-white/[0.08] space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono-code font-bold text-white">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>WEB AUDIO HARMONIC SYNTHESIZER DIAGNOSTIC</span>
            </div>
            <p className="text-xs text-white/60 font-sans">
              Test browser audio pipeline using real-time Web Audio API sine wave oscillator at concert pitch frequencies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[432, 440, 880].map((f) => (
              <button
                key={f}
                onClick={() => toggleTone(f)}
                className={`px-3 py-2 rounded-xl font-mono-code text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  isPlayingTone && toneFreq === f
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-500/40'
                    : 'bg-[#181d2e] text-white/70 hover:text-white border border-white/[0.08]'
                }`}
              >
                {isPlayingTone && toneFreq === f ? (
                  <Square className="w-3 h-3" />
                ) : (
                  <Play className="w-3 h-3 text-emerald-400" />
                )}
                <span>{f} Hz</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
