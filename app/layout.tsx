import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'FIKREMARIYAM OS — Interactive Software Engineer Portfolio | Fikremariyam Tadesse',
  description:
    'Interactive operating system portfolio for Fikremariyam "Fiker" Tadesse. Computer Science graduate, full-stack engineer, systems builder, AI developer, and creative technologist.',
  keywords: [
    'Fikremariyam Tadesse',
    'Fiker',
    'Software Engineer',
    'Full Stack Developer',
    'Systems Builder',
    'AI Developer',
    'Creative Technologist',
    'Next.js',
    'FastAPI',
    'Python',
    'React',
    'SHOEL',
    'TubeFetch',
    'AI Video Clipper',
    'WebRTC',
    'Interactive Portfolio',
  ],
  authors: [{ name: 'Fikremariyam Tadesse' }],
  creator: 'Fikremariyam Tadesse',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fikeros.dev',
    title: 'FIKREMARIYAM OS — Interactive Software Engineer Portfolio',
    description:
      'Explore FIKREMARIYAM OS — a software product portfolio representing Fikremariyam\'s engineering ability, live network simulator, architecture visualizers, and creative work.',
    siteName: 'FIKREMARIYAM OS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FIKREMARIYAM OS — Interactive Software Engineer Portfolio',
    description:
      'Explore FIKREMARIYAM OS — a personal operating system representing Fikremariyam\'s software engineering and creative work.',
    creator: '@[ADD TWITTER]',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#08080a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#08080a] text-white selection:bg-blue-500/30 selection:text-white`}
      >
        {children}
      </body>
    </html>
  );
}
