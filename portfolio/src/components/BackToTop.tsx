'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      id="back-to-top-btn"
      onClick={scrollToTop}
      aria-label="Back to top of page"
      className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-slate-900/85 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700/80 hover:border-cyan-500/50 backdrop-blur-md shadow-xl shadow-black/40 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 group"
    >
      <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}
