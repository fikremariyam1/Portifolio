'use client';

import React, { useState, useEffect } from 'react';
import { useOSStore } from '@/lib/store/os.store';
import { BootSequence } from '@/components/boot/BootSequence';
import { Desktop } from '@/components/desktop/Desktop';

export default function HomePage() {
  const { booted, setBooted } = useOSStore();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // Always show the welcome screen on every visit — clear any old stored boot state
    localStorage.removeItem('fiker_os_booted');
  }, []);

  // Silent black screen while React hydrates — no flashing text
  if (!mounted) {
    return <div className="w-screen h-screen bg-[#060608]" />;
  }

  if (!booted) {
    return <BootSequence onComplete={() => setBooted(true)} />;
  }

  return <Desktop />;
}
