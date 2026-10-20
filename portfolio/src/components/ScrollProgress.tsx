'use client';

import React, { useState, useEffect } from 'react';

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scroll = (totalScroll / windowHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, scroll)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[60] bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-75 ease-out shadow-sm shadow-cyan-500/50"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
