'use client';

import React, { useState, useRef, useEffect } from 'react';
import { terminalData } from '@/lib/data/portfolio';
import { useOSStore } from '@/lib/store/os.store';
import { sounds } from '@/lib/utils';
import type { AppId } from '@/types';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string;
}

export const TerminalApp: React.FC = () => {
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'system',
      content: 'FIKREMARIYAM OS [Version 1.0.0]\n(c) 2026 Fikremariyam Tadesse. All systems operational.\nType "help" to view available commands.\n',
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { openApp, discoverEasterEgg } = useOSStore();

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const raw = cmdStr.trim();
    if (!raw) return;

    sounds.playClick(900);
    const parts = raw.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    // Add to command history
    setCommandHistory((prev) => [raw, ...prev]);
    setHistoryIndex(-1);

    const inputLine: TerminalLine = {
      id: Date.now().toString(),
      type: 'input',
      content: raw,
    };

    let responseLine: TerminalLine | null = null;

    switch (cmd) {
      case 'help':
        responseLine = {
          id: (Date.now() + 1).toString(),
          type: 'output',
          content: `AVAILABLE COMMANDS:
  whoami       Display developer profile identity
  about        Summary of background & focus
  projects     List core engineered systems
  skills       List technology capabilities
  experience   Display chronological trajectory
  contact      Display direct communication protocols
  system       Display OS runtime telemetry
  lab          Open interactive Fiker Lab
  open <app>   Launch window: projects, about, lab, skills, creative, contact
  clear        Clear terminal scrollback
  sudo <cmd>   Execute privileged command
  neofetch     Display system neofetch card`,
        };
        break;

      case 'whoami':
        responseLine = {
          id: (Date.now() + 1).toString(),
          type: 'output',
          content: terminalData.whoami,
        };
        break;

      case 'about':
        responseLine = {
          id: (Date.now() + 1).toString(),
          type: 'output',
          content: terminalData.about,
        };
        break;

      case 'projects':
        responseLine = {
          id: (Date.now() + 1).toString(),
          type: 'output',
          content: terminalData.projects,
        };
        break;

      case 'skills':
        responseLine = {
          id: (Date.now() + 1).toString(),
          type: 'output',
          content: terminalData.skills,
        };
        break;

      case 'experience':
        responseLine = {
          id: (Date.now() + 1).toString(),
          type: 'output',
          content: terminalData.experience,
        };
        break;

      case 'contact':
        responseLine = {
          id: (Date.now() + 1).toString(),
          type: 'output',
          content: terminalData.contact,
        };
        break;

      case 'system':
        responseLine = {
          id: (Date.now() + 1).toString(),
          type: 'output',
          content: terminalData.system,
        };
        break;

      case 'lab':
        openApp('lab');
        responseLine = {
          id: (Date.now() + 1).toString(),
          type: 'system',
          content: 'Launching FIKER LAB window...',
        };
        break;

      case 'open':
        if (['projects', 'about', 'lab', 'skills', 'creative', 'contact', 'terminal'].includes(arg)) {
          openApp(arg as AppId);
          responseLine = {
            id: (Date.now() + 1).toString(),
            type: 'system',
            content: `Launched app: ${arg.toUpperCase()}`,
          };
        } else {
          responseLine = {
            id: (Date.now() + 1).toString(),
            type: 'error',
            content: `Unknown app "${arg}". Valid apps: projects, about, lab, skills, creative, contact`,
          };
        }
        break;

      case 'sudo':
        discoverEasterEgg('terminalSudo');
        sounds.playPacketSound();
        responseLine = {
          id: (Date.now() + 1).toString(),
          type: 'system',
          content: `[ROOT ACCESS GRANTED]
Welcome, Administrator. Secret Easter Egg #1 unlocked!`,
        };
        break;

      case 'neofetch':
        responseLine = {
          id: (Date.now() + 1).toString(),
          type: 'output',
          content: `   ____ _ _                   OS: FIKREMARIYAM OS 1.0.0
  |  __| (_) | _____ _ __     HOST: Portfolio Engine
  | |_ | | | |/ / _ \\ '__|    UPTIME: Active
  |  _|| | |   <  __/ |       SHELL: bash-like virtual
  |_|  |_|_|_|\\_\\___|_|       CORE: Full-Stack / AI / Systems
                              UI: React 19 + Next.js + Tailwind`,
        };
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        responseLine = {
          id: (Date.now() + 1).toString(),
          type: 'error',
          content: `Command not found: "${raw}". Type "help" for a list of valid commands.`,
        };
        break;
    }

    setHistory((prev) => [...prev, inputLine, responseLine!]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    sounds.playKey();
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const nextIdx = historyIndex + 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex flex-col h-full bg-[#08080c] text-white/90 font-mono-code p-6 sm:p-8 text-xs select-text overflow-y-auto cursor-text leading-relaxed"
    >
      {/* Scrollback History */}
      <div className="space-y-2 mb-2">
        {history.map((line) => (
          <div key={line.id}>
            {line.type === 'input' && (
              <div className="flex items-center space-x-2 text-white/90">
                <span className="text-emerald-400 font-bold">fiker@os</span>
                <span className="text-white/40">:</span>
                <span className="text-blue-400">~</span>
                <span className="text-white/40">$</span>
                <span className="font-semibold">{line.content}</span>
              </div>
            )}
            {line.type === 'output' && (
              <pre className="text-white/80 whitespace-pre-wrap pl-2 font-mono-code">
                {line.content}
              </pre>
            )}
            {line.type === 'system' && (
              <pre className="text-blue-300/90 whitespace-pre-wrap pl-2 font-mono-code">
                {line.content}
              </pre>
            )}
            {line.type === 'error' && (
              <pre className="text-red-400 whitespace-pre-wrap pl-2 font-mono-code">
                {line.content}
              </pre>
            )}
          </div>
        ))}
      </div>

      {/* Active Input Line */}
      <div className="flex items-center space-x-2 text-white">
        <span className="text-emerald-400 font-bold">fiker@os</span>
        <span className="text-white/40">:</span>
        <span className="text-blue-400">~</span>
        <span className="text-white/40">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 bg-transparent border-none outline-none text-white font-mono-code caret-emerald-400"
        />
      </div>

      <div ref={terminalEndRef} />
    </div>
  );
};
