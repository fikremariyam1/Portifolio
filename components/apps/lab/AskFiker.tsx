'use client';

import React, { useState, useRef, useEffect } from 'react';
import { sounds } from '@/lib/utils';
import type { ChatMessage } from '@/types';
import {
  Sparkles,
  Send,
  User,
  Bot,
  RotateCcw,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Code2,
  Cpu,
  Layers,
  Phone,
} from 'lucide-react';

const TOPIC_CHIPS = [
  { label: 'SHOEL (WebRTC)', query: 'Explain SHOEL architecture, WebRTC mesh, and sync features.' },
  { label: 'TubeFetch (FastAPI)', query: 'How does TubeFetch process asynchronous video downloads?' },
  { label: 'AI Video Clipper', query: 'What is the pipeline for AI Video Clipper with Whisper & Gemini?' },
  { label: 'Full Tech Stack', query: 'What are Fiker’s strongest programming languages and frameworks?' },
  { label: 'Contact Info', query: 'How can I contact and hire Fikremariyam?' },
  { label: 'System Easter Eggs', query: 'What secret easter eggs are hidden in FIKREMARIYAM OS?' },
];

export const AskFiker: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am FIKER OS AI, grounded in Fikremariyam’s real software architecture, production projects (SHOEL, TubeFetch, AI Video Clipper), technical skill matrix, and contact channels.\n\nAsk any question below or select a quick topic to inspect systems details.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const text = (queryText || input).trim();
    if (!text || loading) return;

    sounds.playClick(900);
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
      });

      const data = await res.json();
      sounds.playPacketSound();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || 'No response available.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Fiker is a Computer Science graduate and full-stack developer proficient in Next.js, React, Python, FastAPI, WebRTC, Firebase, SQLite, FFmpeg, OpenCV, and Gemini AI integrations.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    sounds.playClick(1000);
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#•`-]/g, ' ');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex-1 w-full flex flex-col bg-[#0a0c14] text-white select-text">
      {/* Top Banner */}
      <div className="h-12 px-6 bg-[#121522] border-b border-white/[0.08] flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2 text-xs font-mono-code">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-white">ASK FIKER // GROUNDED SYSTEM INTELLIGENCE</span>
        </div>
        <div className="flex items-center space-x-3">
          {isSpeaking && (
            <button
              onClick={() => {
                window.speechSynthesis?.cancel();
                setIsSpeaking(false);
              }}
              className="text-xs font-mono-code text-emerald-400 flex items-center space-x-1 animate-pulse"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>STOP SPEECH</span>
            </button>
          )}
          <button
            onClick={() => {
              sounds.playClick(600);
              window.speechSynthesis?.cancel();
              setIsSpeaking(false);
              setMessages([messages[0]]);
            }}
            className="text-xs font-mono-code text-white/40 hover:text-white flex items-center space-x-1.5 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESET CHAT</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-5xl mx-auto w-full">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3.5 text-xs sm:text-sm leading-relaxed ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-5 rounded-2xl max-w-[88%] sm:max-w-[80%] font-sans relative group ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white shadow-lg rounded-tr-none'
                  : 'bg-[#121522] text-white/90 border border-white/[0.08] rounded-tl-none shadow-md'
              }`}
            >
              <div className="flex items-center justify-between font-mono-code text-[10px] text-white/40 mb-2 font-bold">
                <span>{msg.role === 'user' ? 'VISITOR' : 'FIKER OS AI'}</span>
                {msg.role === 'assistant' && (
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleSpeak(msg.content)}
                      className="text-white/50 hover:text-emerald-400 p-1 transition-colors"
                      title="Read Aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="text-white/50 hover:text-white p-1 transition-colors"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white/80 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-3.5 text-xs sm:text-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-[#121522] border border-white/[0.08] text-white/70 flex items-center space-x-3 font-mono-code">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>CONSULTING FIKER OS SYSTEM GRAPH & KNOWLEDGE BASE...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Topic Chips */}
      <div className="px-6 py-2.5 bg-[#0e101b] border-t border-white/[0.06] flex items-center space-x-2 overflow-x-auto shrink-0">
        <span className="text-xs font-mono-code text-white/40 whitespace-nowrap font-bold">TOPICS:</span>
        {TOPIC_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.query)}
            className="text-xs font-mono-code px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-emerald-950/40 hover:text-emerald-300 text-white/70 border border-white/[0.08] hover:border-emerald-500/40 whitespace-nowrap transition-colors"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 sm:p-5 bg-[#121522] border-t border-white/[0.08] shrink-0">
        <div className="max-w-5xl mx-auto flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask anything about Fiker's architecture, projects, skills, or background..."
            className="flex-1 bg-[#181d2e] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 font-sans"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold font-mono-code text-xs flex items-center space-x-2 transition-all shadow-lg shadow-emerald-600/25"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">TRANSMIT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
