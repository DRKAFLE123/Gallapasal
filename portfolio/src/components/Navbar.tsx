'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Code, Sparkles, Terminal, FileText, Layers, Workflow, BookOpen } from 'lucide-react';
import ResumeModal from './ResumeModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '/#about' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Visualizations', href: '/#visualizations' },
    { label: 'Process', href: '/#process' },
    { label: 'Writing', href: '/#writing' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      <header
        id="main-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/25 py-2.5'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Name */}
            <Link
              id="brand-logo-link"
              href="/"
              className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1"
              title="Damodar Kafle - Personal Portfolio"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
                DK
              </div>
              <div className="flex flex-col">
                <span className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors tracking-tight">
                  Damodar Kafle
                </span>
                <span className="text-[11px] text-slate-400 font-medium tracking-wide hidden sm:block">
                  Full-Stack & AI/ML Engineer
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav id="desktop-nav" className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                >
                  {link.label}
                </a>
              ))}

              {/* CV / Resume Modal Button */}
              <button
                onClick={() => setIsResumeOpen(true)}
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800/70 hover:bg-slate-700/70 text-slate-200 border border-slate-700/60 hover:text-cyan-400 transition-all ml-1"
                title="View Verified CV & Credentials"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>CV / Resume</span>
              </button>

              {/* Live Gallapasal Product Link */}
              <a
                id="header-gallapasal-link"
                href="https://pos.damodarkafle.com.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 transition-all ml-2"
                title="Launch Gallapasal POS System"
              >
                <span>Gallapasal POS</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={() => setIsResumeOpen(true)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800/80 text-slate-200 border border-slate-700/60"
              >
                <FileText className="w-3 h-3" />
                <span>CV</span>
              </button>

              <button
                id="mobile-menu-toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                aria-expanded={isOpen}
                aria-label="Toggle Navigation Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div
            id="mobile-nav-menu"
            className="lg:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/90 px-4 pt-3 pb-6 space-y-1 shadow-2xl"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-sm font-semibold text-slate-300 hover:text-cyan-400 hover:bg-slate-900 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}

            <div className="pt-3 px-2 border-t border-slate-800 mt-2 space-y-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsResumeOpen(true);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-200 border border-slate-700"
              >
                <span className="flex items-center space-x-2">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Verified CV / Credentials</span>
                </span>
              </button>

              <a
                href="https://pos.damodarkafle.com.np/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
              >
                <span>Launch Gallapasal POS</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Resume Modal */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
}
