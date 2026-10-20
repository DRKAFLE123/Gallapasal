'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  FileText, 
  Github, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  Code2, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import ResumeModal from './ResumeModal';

export default function Hero() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <>
      <section
        id="hero"
        aria-label="Introduction and Overview"
        className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden"
      >
        {/* Soft Ambient Background Mesh */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-indigo-600/10 blur-[140px] rounded-full pointer-events-none -z-10 animate-pulse duration-1000" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Text & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Status & Location Pill */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 backdrop-blur-md text-xs font-medium text-slate-300 shadow-md">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold text-slate-200">Available for Architecture & Engineering Roles</span>
                <span className="text-slate-600">â€¢</span>
                <span className="inline-flex items-center text-slate-400">
                  <MapPin className="w-3 h-3 mr-1 text-cyan-400" />
                  Kathmandu, Nepal
                </span>
              </div>

              {/* Name & Headline with smooth reveal */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-[1.1]">
                  Hi, I am <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Damodar Kafle</span>
                </h1>
                <p className="text-xl sm:text-2xl font-semibold text-slate-300 tracking-tight">
                  Building Digital Products, Web Applications and Intelligent Solutions.
                </p>
              </div>

              {/* Bio paragraph */}
              <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Software Developer and BSc CSIT graduate (Tribhuvan University) specializing in full-stack web architecture, 
                applied AI/ML engineering, rigorous quality assurance, and technical project management. 
                Author of enterprise platforms including <strong className="text-slate-200">Gallapasal POS</strong> and international products like <strong className="text-slate-200">Digital Nomads in Nepal</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                {/* Primary CTA: View Projects */}
                <a
                  id="hero-view-projects-btn"
                  href="#projects"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 group"
                >
                  <span>View Projects</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Secondary CTA: About Me */}
                <a
                  id="hero-about-me-btn"
                  href="#about"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                >
                  <span>About Me</span>
                </a>

                {/* Secondary CTA: CV / Resume */}
                <button
                  id="hero-cv-btn"
                  onClick={() => setIsResumeOpen(true)}
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/50 font-semibold text-sm transition-all transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span>CV / Resume</span>
                </button>

                {/* Contact CTA */}
                <a
                  id="hero-contact-btn"
                  href="#contact"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800 font-semibold text-sm transition-all transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                >
                  <Mail className="w-4 h-4 mr-2 text-cyan-400" />
                  <span>Contact Me</span>
                </a>
              </div>

              {/* Direct Social & Repository Links */}
              <div className="flex items-center justify-center lg:justify-start space-x-4 pt-4 text-xs text-slate-400">
                <a
                  href="https://github.com/DRKAFLE123"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 hover:text-cyan-400 transition-colors py-1 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800"
                  aria-label="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                  <span>DRKAFLE123</span>
                </a>

                <a
                  href="https://wa.me/9779865575108"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 hover:text-emerald-400 transition-colors py-1 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800"
                  aria-label="WhatsApp Message"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href="mailto:damodarms0804@gmail.com"
                  className="flex items-center space-x-1.5 hover:text-cyan-400 transition-colors py-1 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800"
                  aria-label="Direct Email"
                >
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>damodarms0804@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Right Column: High-End Technical Profile Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Subtle decorative glow ring */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 blur-xl opacity-70 group-hover:opacity-100 transition duration-1000"></div>

                <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-950/85 border border-slate-800/90 shadow-2xl backdrop-blur-xl space-y-6">
                  {/* Top Bar / Terminal Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center">
                      <Terminal className="w-3 h-3 mr-1 text-cyan-400" />
                      engineer.profile.json
                    </span>
                  </div>

                  {/* Core Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">Degree</span>
                      <span className="text-xs font-bold text-slate-100 block">BSc CSIT (2023)</span>
                      <span className="text-[11px] text-slate-400">Tribhuvan University</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">Active Status</span>
                      <span className="text-xs font-bold text-slate-100 block">Open for Roles</span>
                      <span className="text-[11px] text-slate-400">Kathmandu / Remote</span>
                    </div>
                  </div>

                  {/* Highlights Stack */}
                  <div className="space-y-2.5 pt-1 text-left">
                    <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Full-Stack Architecture:</strong> React 19, Next.js 15, Laravel 11, TypeScript, Tailwind</span>
                    </div>
                    <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Production POS:</strong> Live enterprise system with dual AD/BS calendar ledger logic</span>
                    </div>
                    <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Applied AI/ML:</strong> ResNet-50 CNNs, LSTM sentence models, and real-time OpenCV</span>
                    </div>
                    <div className="flex items-start space-x-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span><strong>Quality Assurance:</strong> API contract validation, defect triage & automated unit tests</span>
                    </div>
                  </div>

                  {/* Bottom Quick Action: Gallapasal Launch */}
                  <div className="pt-4 border-t border-slate-800/90 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Featured System</span>
                    <a
                      href="https://pos.damodarkafle.com.np/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-emerald-400 hover:text-emerald-300 font-bold group"
                    >
                      <span>Gallapasal POS</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Modal */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </>
  );
}
