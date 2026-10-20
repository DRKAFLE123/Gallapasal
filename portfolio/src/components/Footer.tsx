import React from 'react';
import Link from 'next/link';
import { Github, Mail, Phone, ArrowUpRight, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="main-footer"
      className="bg-slate-950 border-t border-slate-800/80 py-12 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/60">
          {/* Brand Identity */}
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1"
              title="Damodar Kafle Portfolio"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-md">
                DK
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                  Damodar Kafle
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Senior Full-Stack & AI/ML Engineer
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Links */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">Skills</a>
            <a href="#github" className="hover:text-cyan-400 transition-colors">GitHub</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
            <a
              href="https://pos.damodarkafle.com.np/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 inline-flex items-center"
            >
              <span>Gallapasal POS</span>
              <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </a>
          </nav>

          {/* Social icons */}
          <div className="flex items-center space-x-3 text-slate-400">
            <a
              href="https://github.com/DRKAFLE123"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 hover:text-cyan-400 border border-slate-800 transition-colors"
              aria-label="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/9779865575108"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 hover:text-emerald-400 border border-slate-800 transition-colors"
              aria-label="WhatsApp"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a
              href="mailto:damodarms0804@gmail.com"
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 hover:text-cyan-400 border border-slate-800 transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {currentYear} Damodar Kafle. All rights reserved. Kathmandu, Nepal.</p>
          <p className="flex items-center">
            Built with Next.js, TypeScript & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
