'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { contactLinks, identity } from '@/lib/data/portfolio';
import { sounds } from '@/lib/utils';
import {
  Radio,
  Send,
  CheckCircle2,
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  Mail,
  MessageSquare,
  Phone,
} from 'lucide-react';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

const getChannelIcon = (iconName: string) => {
  switch (iconName) {
    case 'mail':
      return <Mail className="w-4 h-4 text-blue-400" />;
    case 'github':
      return <GithubIcon className="w-4 h-4 text-purple-400" />;
    case 'telegram':
      return <Send className="w-4 h-4 text-cyan-400" />;
    case 'whatsapp':
      return <MessageSquare className="w-4 h-4 text-emerald-400" />;
    case 'phone':
      return <Phone className="w-4 h-4 text-amber-400" />;
    default:
      return <Radio className="w-4 h-4 text-blue-400" />;
  }
};

export const ContactApp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'transmitting' | 'success' | 'error'>('idle');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    sounds.playClick(900);
    setStatus('transmitting');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        sounds.playPacketSound();
        setStatus('success');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const handleCopy = (text: string, label: string) => {
    sounds.playClick(1000);
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#08080c] text-white font-mono-code select-text overflow-y-auto">
      <div className="p-6 sm:p-10 max-w-5xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/[0.08]">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs text-cyan-400">
              <Radio className="w-4 h-4 animate-pulse" />
              <span className="tracking-widest font-semibold uppercase">
                COMMUNICATION CHANNEL
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              ESTABLISH CONNECTION
            </h1>
            <p className="text-xs sm:text-sm text-white/70 font-sans max-w-xl leading-relaxed">
              Open to full-stack engineering opportunities, AI systems, and creative collaborations.
            </p>
          </div>

          <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-[#101018] border border-white/[0.08] shrink-0 self-start sm:self-center shadow-lg">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-[#161a2c] flex items-end justify-center">
              <Image
                src={identity.avatar || '/developer.png'}
                alt={identity.name}
                fill
                sizes="48px"
                className="object-contain object-bottom"
              />
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-white font-mono-code">{identity.name.split(' ')[0]} (Fiker)</div>
              <div className="text-[10px] text-emerald-400 font-mono-code flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                <span>DIRECT REACH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Channel Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold text-white/50 tracking-wider uppercase">
              DIRECT COMMUNICATION ENDPOINTS
            </div>
            <span className="text-[10px] text-cyan-400/80 font-mono-code">
              CLICK TO OPEN // OR COPY DIRECTLY
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {contactLinks.map((link) => {
              const isCopied = copiedLink === link.label;
              return (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.playClick(900)}
                  className="w-full text-left p-4 rounded-xl bg-[#101018] border border-white/[0.08] hover:border-cyan-500/50 hover:bg-[#141422] transition-all flex items-center justify-between shadow-lg group relative overflow-hidden"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1 mr-3">
                    <div className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 shrink-0 transition-colors">
                      {getChannelIcon(link.icon)}
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] text-white/40 block font-bold tracking-wider uppercase">
                          {link.label}
                        </span>
                        <ExternalLink className="w-2.5 h-2.5 text-white/30 group-hover:text-cyan-400 transition-colors" />
                      </div>
                      <span className="text-xs font-bold text-white group-hover:text-cyan-300 truncate block transition-colors">
                        {link.value}
                      </span>
                    </div>
                  </div>

                  {/* Dedicated Prominent Copy Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCopy(link.value, link.label);
                    }}
                    className={`shrink-0 flex items-center space-x-1.5 px-3 py-2 rounded-lg border text-xs font-mono-code font-bold transition-all shadow-sm ${
                      isCopied
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.3)]'
                        : 'bg-white/[0.06] hover:bg-cyan-500/20 border-white/[0.12] hover:border-cyan-500/50 text-white/90 hover:text-white active:scale-95'
                    }`}
                    title={`Copy ${link.label} to clipboard`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px]">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">COPY</span>
                      </>
                    )}
                  </button>
                </a>
              );
            })}
          </div>
        </div>

        {/* Secure Form */}
        <div className="p-8 rounded-2xl bg-[#101018] border border-white/[0.08] space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <h2 className="text-sm font-bold text-white tracking-wide">
              TRANSMIT MESSAGE PAYLOAD
            </h2>
            <span className="text-[10px] text-cyan-400">STATUS: READY</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono-code text-white/60 block font-semibold">
                  NAME / IDENTIFIER
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-[#181824] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono-code text-white/60 block font-semibold">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full bg-[#181824] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono-code text-white/60 block font-semibold">
                MESSAGE PAYLOAD
              </label>
              <textarea
                rows={5}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message, project collaboration, or engineering inquiry..."
                className="w-full bg-[#181824] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
              />
            </div>

            {status === 'success' && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center space-x-3 font-mono-code">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>PACKET DELIVERED: Message sent successfully. Thank you!</span>
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs sm:text-sm flex items-center space-x-3 font-mono-code">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>TRANSMISSION FAILED: Please reach out directly via email.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'transmitting'}
              className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-mono-code font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-xl shadow-cyan-600/25 active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>
                {status === 'transmitting' ? 'TRANSMITTING PACKET...' : 'ESTABLISH CONNECTION'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
