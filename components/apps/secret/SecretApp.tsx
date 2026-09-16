'use client';

import React from 'react';
import { useOSStore } from '@/lib/store/os.store';
import { sounds } from '@/lib/utils';
import { Sparkles, Trophy, ShieldCheck, CheckCircle2, Terminal } from 'lucide-react';

export const SecretApp: React.FC = () => {
  const { easterEggs } = useOSStore();

  const eggsList = [
    { key: 'terminalSudo', name: 'Terminal Superuser', desc: 'Executed "sudo" command in the CLI shell' },
    { key: 'konamiCode', name: 'Konami Code', desc: 'Entered the classic gaming sequence (↑ ↑ ↓ ↓ ← → ← → B A)' },
    { key: 'packetStorm', name: 'Network Flooder', desc: 'Dispatched 5+ packets through the network simulator' },
    { key: 'systemInspect', name: 'Secrets Inspector', desc: 'Triggered system telemetry inspection' },
    { key: 'dockTripleClick', name: 'Rapid Dock Reflexes', desc: 'Triple-clicked application dock' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#08080a] text-white font-mono-code p-6 sm:p-10 overflow-y-auto select-text">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Title */}
      <div className="p-6 rounded-xl bg-[#171210] border border-amber-500/40 text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>MISSION COMPLETE // ACCESS GRANTED</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide">
          ROOT ACCESS UNLOCKED
        </h2>
        <p className="text-xs text-white/70 font-sans max-w-md mx-auto leading-relaxed">
          You explored all secret corners of FIKREMARIYAM OS! Thank you for taking the time to test, inspect, and experience this portfolio.
        </p>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-white/50 tracking-wider">
          EASTER EGG EXPLORATION LOG
        </div>

        <div className="space-y-2">
          {eggsList.map((item) => {
            const isUnlocked = easterEggs[item.key as keyof typeof easterEggs];
            return (
              <div
                key={item.key}
                className={`p-3.5 rounded-lg border flex items-center justify-between text-xs transition-all ${
                  isUnlocked
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                    : 'bg-white/[0.02] border-white/[0.06] text-white/40'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      isUnlocked ? 'text-amber-400' : 'text-white/20'
                    }`}
                  />
                  <div>
                    <div className="font-bold text-white/90">{item.name}</div>
                    <div className="text-[11px] text-white/50 font-sans">{item.desc}</div>
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    isUnlocked
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-white/[0.05] text-white/30'
                  }`}
                >
                  {isUnlocked ? 'DISCOVERED' : 'LOCKED'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
};
