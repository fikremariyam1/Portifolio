'use client';

import React, { useState } from 'react';
import { sounds } from '@/lib/utils';
import { NetworkSimulator } from './NetworkSimulator';
import { AskFiker } from './AskFiker';
import { SystemMonitor } from './SystemMonitor';
import { FlaskConical, Network, Bot, Activity } from 'lucide-react';

type LabTab = 'network' | 'ask' | 'monitor';

export const LabApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LabTab>('network');

  const tabs: Array<{ id: LabTab; label: string; icon: React.ElementType }> = [
    {
      id: 'network',
      label: '1. Network Topology Simulator',
      icon: Network,
    },
    {
      id: 'ask',
      label: '2. Ask Fiker AI',
      icon: Bot,
    },
    {
      id: 'monitor',
      label: '3. System Telemetry',
      icon: Activity,
    },
  ];

  return (
    <div className="flex-1 w-full flex flex-col bg-[#0a0c14] text-white select-text">
      {/* Row 1: Lab Top Header & Navigation Tabs */}
      <div className="py-3 px-6 sm:px-8 bg-[#10131f] border-b border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-wide">FIKER LAB</span>
            <span className="text-[10px] text-white/40 font-mono-code">SYSTEM SIMULATORS & AI EXPERIMENTS</span>
          </div>
        </div>

        {/* Tab Navigation Buttons (No Gradients) */}
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
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
                    ? 'bg-emerald-600 text-white border border-emerald-500 shadow-md scale-[1.02]'
                    : 'bg-[#121420] text-white/70 hover:text-white hover:bg-[#1a1d2e] border border-white/[0.12] active:scale-95'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content View */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">
        {activeTab === 'network' && <NetworkSimulator />}
        {activeTab === 'ask' && <AskFiker />}
        {activeTab === 'monitor' && <SystemMonitor />}
      </div>
    </div>
  );
};
