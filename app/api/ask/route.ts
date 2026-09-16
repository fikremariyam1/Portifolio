import { NextRequest, NextResponse } from 'next/server';
import { projects } from '@/lib/data/projects';
import { skills } from '@/lib/data/skills';
import { identity, timeline } from '@/lib/data/portfolio';

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question parameter is required.' },
        { status: 400 }
      );
    }

    const q = question.toLowerCase();
    const apiKey = process.env.GEMINI_API_KEY;

    // If Gemini API Key is configured in environment, call Google Gemini
    if (apiKey) {
      try {
        const systemPrompt = `You are FIKER OS AI, the personal portfolio assistant for Fikremariyam "Fiker" Tadesse.
Here is the strict factual background data on Fiker:
- Identity: ${identity.name} ("${identity.nickname}"), Computer Science graduate, Full-Stack Developer, Systems Builder, AI Developer, Creative Technologist.
- Projects:
  1. SHOEL: Student-focused study & social platform with React, Firebase, Firestore, WebRTC, AI integration, streak system, study timer, shared collaborative board.
  2. TubeFetch: YouTube downloader/backend system built with Python, FastAPI, SQLite, SQLAlchemy, yt-dlp, FFmpeg, BackgroundTasks, Uvicorn.
  3. AI Video Clipper: AI media-processing pipeline using Next.js, TypeScript, React, Firebase, Gemini API, faster-whisper, OpenCV.
- Skills: React, Next.js, TypeScript, Python, FastAPI, WebRTC, Firebase, SQLite, FFmpeg, OpenCV, faster-whisper, Gemini API, Motion Graphics, Video Editing.
- Timeline: 2022 CS Foundations, 2023 Freelance & Creative Work, 2024 Software Projects (SHOEL, TubeFetch), 2025 AI + Full-Stack Systems, 2026 Building / Scaling.

RULES:
1. ONLY answer based on this exact factual data.
2. DO NOT fabricate any jobs, companies, awards, clients, revenue, or years of experience.
3. Be technical, concise, clear, and professional.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: `${systemPrompt}\n\nVisitor Question: ${question}` }],
                },
              ],
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const answer =
            geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (answer) {
            return NextResponse.json({ answer });
          }
        }
      } catch {
        // Fall back to local grounded knowledge engine
      }
    }

    // Grounded Local Knowledge Engine (No hallucinations, comprehensive coverage)
    let answer = '';

    if (q.includes('shoel') || q.includes('study') || q.includes('webrtc')) {
      answer = `**SHOEL — Collaborative Study & Social Platform**\n\n• **Core Tech**: React, Firebase (Auth & Firestore), WebRTC (Mesh topology), Tailwind CSS\n• **Architecture**: Peer-to-peer real-time audio/video study rooms with signaling handled via Firestore listeners.\n• **Key Features**:\n  - Synchronized group study timers\n  - Atomic daily streak transactions\n  - Real-time shared canvas board\n  - Integrated direct & room messaging\n• **Engineering Achievement**: Low-latency P2P mesh network minimizing server bandwidth costs while maintaining real-time sync across study room members.`;
    } else if (q.includes('tubefetch') || q.includes('tube') || q.includes('download') || q.includes('fastapi')) {
      answer = `**TubeFetch — Asynchronous Media Processing Backend**\n\n• **Core Tech**: Python 3.11, FastAPI, SQLite, SQLAlchemy, yt-dlp, FFmpeg, Uvicorn\n• **Architecture**: Client submits a download request and immediately receives a job UUID. FastAPI BackgroundTasks dispatches async worker jobs to stream video/audio streams and trigger FFmpeg conversion pipelines without blocking the event loop.\n• **Key Features**:\n  - Multi-resolution stream muxing (1080p, 4K, MP3 audio extraction)\n  - Real-time download progress tracking\n  - Automatic temporary artifact cleanup daemon\n• **Engineering Achievement**: High-throughput media conversion pipeline maintaining sub-20ms API response latency.`;
    } else if (q.includes('clipper') || q.includes('ai video') || q.includes('whisper') || q.includes('opencv') || q.includes('clip')) {
      answer = `**AI Video Clipper — Automated Highlight Extraction Pipeline**\n\n• **Core Tech**: Next.js, React, TypeScript, Python backend, faster-whisper, Gemini API, OpenCV, FFmpeg\n• **Architecture**: Multi-stage asynchronous AI pipeline:\n  1. **Audio Demuxing**: FFmpeg isolates high-fidelity audio track.\n  2. **Transcription**: \`faster-whisper\` generates word-level timestamps.\n  3. **Semantic Scoring**: Gemini LLM evaluates excitement, narrative hooks, and topical shifts.\n  4. **Video Slicing & Rendering**: OpenCV cuts frame-accurate clips and burns dynamic animated subtitles.\n• **Engineering Achievement**: End-to-end automated pipeline transforming 60-minute long-form videos into viral vertical shorts.`;
    } else if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('language') || q.includes('python') || q.includes('react')) {
      answer = `**Technical Capabilities & Architecture Stack**:\n\n• **Frontend & UI**: React, Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand\n• **Backend & Systems**: Python (FastAPI, SQLAlchemy), Node.js, SQLite, FFmpeg, OpenCV, WebRTC\n• **AI & Automation**: Gemini API, faster-whisper, prompt engineering, structured JSON outputs\n• **Cloud & Services**: Firebase (Firestore, Auth, Storage), Vercel, RESTful APIs\n• **Creative Toolchain**: Premiere Pro, After Effects, Photoshop, Motion Graphics, Audio Engineering`;
    } else if (q.includes('who') || q.includes('background') || q.includes('fiker') || q.includes('about') || q.includes('education') || q.includes('experience')) {
      answer = `**Fikremariyam "Fiker" Tadesse** is a Computer Science graduate, full-stack software engineer, systems builder, and creative technologist based in Addis Ababa, Ethiopia.\n\nHe specializes in architecting high-performance web systems, real-time collaboration platforms, and AI-driven media processing pipelines. His background uniquely blends deep computer science fundamentals (algorithms, distributed networks, concurrency) with motion design and creative aesthetics.`;
    } else if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('reach') || q.includes('telegram') || q.includes('phone') || q.includes('whatsapp') || q.includes('github')) {
      answer = `**Contact Channels for Fikremariyam Tadesse**:\n\n• **Email**: [Fmtadesse@gmail.com](mailto:Fmtadesse@gmail.com)\n• **GitHub**: [github.com/fikremariyam1](https://github.com/fikremariyam1)\n• **Telegram**: [@fmtadesse](https://t.me/fmtadesse)\n• **WhatsApp**: [+251970699570](https://wa.me/251970699570)\n• **Phone**: +251 970 699 570 / +251 786 458 717\n• **Location**: Addis Ababa, Ethiopia (Open to Remote Worldwide)`;
    } else if (q.includes('easter') || q.includes('secret') || q.includes('terminal') || q.includes('hidden')) {
      answer = `**FIKREMARIYAM OS Hidden Easter Eggs**:\n\n1. Type \`sudo su\` or \`unlock\` inside the Terminal app.\n2. Input the classic Konami Code (\`↑ ↑ ↓ ↓ ← → ← → B A\`) anywhere on the desktop.\n3. Dispatch 5 consecutive packets in the Network Topology Simulator.\n4. Click the audio/time widget in the Taskbar 3 times.\n5. Press \`Ctrl+K\` (or \`Cmd+K\`) to invoke the Omni Command Palette!`;
    } else {
      answer = `**FIKER OS System Intelligence**:\n\nFiker is a Computer Science graduate & Full-Stack Developer specializing in systems engineering, AI media pipelines, and real-time collaboration platforms.\n\n**Quick Topics to Explore**:\n• Ask about **SHOEL** (WebRTC study rooms & streaks)\n• Ask about **TubeFetch** (FastAPI async video processing)\n• Ask about **AI Video Clipper** (whisper + Gemini + OpenCV pipeline)\n• Ask about **Contact Info** or **Skills Matrix**`;
    }

    return NextResponse.json({ answer });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: 'Internal server error processing request.' },
      { status: 500 }
    );
  }
}
