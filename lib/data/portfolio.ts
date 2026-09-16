import type { TimelineEntry, ContactLink } from '@/types';

export const identity = {
  name: 'Fikremariyam Tadesse',
  nickname: 'Fiker',
  avatar: '/developer.png',
  tagline: 'Software Developer · Systems Builder · Creative Technologist',
  roles: ['Software Developer', 'Full-Stack Engineer', 'Systems Builder', 'AI Developer', 'Creative Technologist'],
  domains: ['SOFTWARE', 'SYSTEMS', 'AI', 'CREATIVE', 'ENTREPRENEURSHIP'],
  summary:
    'Computer Science graduate and full-stack developer building real systems — from AI-powered media pipelines to real-time collaboration platforms. I combine engineering depth with creative sensibility.',
  education: 'Computer Science',
  location: 'Addis Ababa, Ethiopia',
};

export const timeline: TimelineEntry[] = [
  {
    year: 2022,
    title: 'Computer Science',
    description: 'Began formal CS education. Deep dives into algorithms, systems, networking, and software engineering fundamentals.',
    tags: ['CS Fundamentals', 'Algorithms', 'Networking'],
  },
  {
    year: 2023,
    title: 'Freelance & Creative Work',
    description: 'Started building independently — combining software development with video production and creative work.',
    tags: ['Freelance', 'Video Production', 'Creative', 'Web Development'],
  },
  {
    year: 2024,
    title: 'Software Projects',
    description: 'Built SHOEL (study platform with WebRTC and Firebase) and TubeFetch (async download backend with FastAPI). Developed systems-level thinking.',
    tags: ['SHOEL', 'TubeFetch', 'FastAPI', 'WebRTC', 'Firebase'],
  },
  {
    year: 2025,
    title: 'AI + Full-Stack Systems',
    description: 'Integrated AI into production pipelines. Built the AI Video Clipper using Gemini, faster-whisper, and OpenCV. Deepened understanding of AI-augmented systems.',
    tags: ['AI Video Clipper', 'Gemini API', 'faster-whisper', 'OpenCV', 'Next.js'],
  },
  {
    year: 2026,
    title: 'Building · Experimenting · Scaling',
    description: 'Expanding across AI, systems, and creative technology. Building products that sit at the intersection of engineering and experience.',
    tags: ['Systems', 'AI', 'Creative Tech', 'Product'],
  },
];

export const contactLinks: ContactLink[] = [
  {
    label: 'EMAIL',
    value: 'Fmtadesse@gmail.com',
    url: 'mailto:Fmtadesse@gmail.com',
    icon: 'mail',
  },
  {
    label: 'GITHUB',
    value: 'fikremariyam1',
    url: 'https://github.com/fikremariyam1',
    icon: 'github',
  },
  {
    label: 'TELEGRAM',
    value: '@fmtadesse',
    url: 'https://t.me/fmtadesse',
    icon: 'telegram',
  },
  {
    label: 'WHATSAPP',
    value: '+251 970 699 570',
    url: 'https://wa.me/251970699570',
    icon: 'whatsapp',
  },
  {
    label: 'PHONE (LINE 1)',
    value: '+251 970 699 570',
    url: 'tel:+251970699570',
    icon: 'phone',
  },
  {
    label: 'PHONE (LINE 2)',
    value: '+251 786 458 717',
    url: 'tel:+251786458717',
    icon: 'phone',
  },
];

export const terminalData = {
  whoami: `FIKREMARIYAM TADESSE

Software Developer
Full-Stack Engineer
Systems Builder
Creative Technologist`,

  about: `Fikremariyam "Fiker" Tadesse

Computer Science graduate and full-stack developer.
Builds real systems: AI pipelines, real-time platforms, backend services.
Combines engineering depth with creative sensibility.

Location: Addis Ababa, Ethiopia
Education: Computer Science`,

  skills: `TECHNICAL SKILLS

Full Stack    → React, Next.js, TypeScript, JavaScript
Backend       → Python, FastAPI, Node.js
AI            → Gemini API, faster-whisper, prompt engineering
Databases     → Firebase, Firestore, SQLite, SQLAlchemy
Systems       → FFmpeg, OpenCV, yt-dlp, background processing
Networking    → WebRTC, REST APIs
Creative      → Video editing, motion graphics, graphic design`,

  projects: `PROJECTS

[1] SHOEL             — Real-time study + social platform
                        React · Firebase · WebRTC · AI

[2] TUBEFETCH         — Async YouTube download backend
                        Python · FastAPI · SQLite · FFmpeg

[3] AI VIDEO CLIPPER  — AI-powered clip detection pipeline
                        Next.js · Gemini API · faster-whisper · OpenCV`,

  experience: `EXPERIENCE

2022  Computer Science — Foundations
2023  Freelance + Creative Work
2024  Software Projects (SHOEL, TubeFetch)
2025  AI + Full-Stack Systems
2026  Building · Experimenting · Scaling`,

  contact: `CONTACT

Email     → Fmtadesse@gmail.com
GitHub    → https://github.com/fikremariyam1
Telegram  → https://t.me/fmtadesse
WhatsApp  → +251 970 699 570
Phone     → +251 970 699 570 / +251 786 458 717`,

  system: `FIKREMARIYAM OS v1.0.0

System    → Next.js 14 + TypeScript
Runtime   → Node.js
Deploy    → Vercel
Status    → OPERATIONAL`,
};
