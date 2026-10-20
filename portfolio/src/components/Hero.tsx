import React from 'react';
import { ArrowRight, Download, Github, Mail, MapPin, Phone, MessageSquare, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="hero"
      aria-label="Introduction and Overview"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-indigo-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Status & Location Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/80 backdrop-blur-sm text-xs font-medium text-slate-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for Architecture & Engineering Roles</span>
              <span className="text-slate-500">•</span>
              <span className="inline-flex items-center text-slate-400">
                <MapPin className="w-3 h-3 mr-1 text-cyan-400" />
                Kathmandu, Nepal
              </span>
            </div>

            {/* Name & Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-[1.1]">
                Hi, I am <span className="text-gradient">Damodar Kafle</span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-slate-300 tracking-tight">
                Building Digital Products, Web Applications and Intelligent Solutions.
              </p>
            </div>

            {/* Bio paragraph */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Software Developer and BSc CSIT graduate specializing in full-stack web architecture, 
              applied AI/ML engineering, rigorous quality assurance, and technical project management. 
              Author of enterprise systems including <strong className="text-slate-200">Gallapasal</strong> and international platforms like <strong className="text-slate-200">Digital Nomads in Nepal</strong>.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <a
                id="hero-view-projects-btn"
                href="#projects"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>

              <a
                id="hero-about-me-btn"
                href="#about"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <span>About Me</span>
              </a>

              <a
                id="hero-contact-btn"
                href="#contact"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/60 text-slate-300 border border-slate-800 font-semibold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <MessageSquare className="w-4 h-4 mr-2 text-cyan-400" />
                <span>Contact Me</span>
              </a>

              <a
                id="hero-download-cv-btn"
                href="#contact"
                className="inline-flex items-center justify-center px-4 py-3 rounded-xl bg-slate-900/40 hover:bg-slate-800/40 text-slate-400 hover:text-slate-200 border border-slate-800/60 text-sm font-medium transition-all"
                title="Request complete CV"
              >
                <Download className="w-4 h-4 mr-1.5" />
                <span>CV / Resume</span>
              </a>
            </div>

            {/* Quick Links & Socials */}
            <div className="flex items-center justify-center lg:justify-start space-x-4 pt-4 border-t border-slate-800/60 text-slate-400">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">Connect:</span>
              <a
                href="https://github.com/DRKAFLE123"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/9779865575108"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 hover:text-emerald-400 transition-colors"
                aria-label="WhatsApp Message"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="mailto:damodarms0804@gmail.com"
                className="p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
                aria-label="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Authentic Monogram & Architecture Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Outer decorative card */}
              <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
                {/* Monogram emblem */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-cyan-500/20">
                      DK
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-100">Damodar Kafle</h2>
                      <p className="text-xs text-cyan-400 font-mono">BSc CSIT • TU 2023</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Verified
                  </span>
                </div>

                {/* Core competencies badges */}
                <div className="py-6 space-y-3">
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800/80">
                    <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-slate-200">Full-Stack Architecture</p>
                      <p className="text-[11px] text-slate-400">Next.js, React 19, TypeScript, Laravel 11</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800/80">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-slate-200">AI & Machine Learning</p>
                      <p className="text-[11px] text-slate-400">TensorFlow, Computer Vision, CNN/RNN, NLP</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800/80">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-slate-200">QA & Technical Delivery</p>
                      <p className="text-[11px] text-slate-400">System Testing, Defect Triage, Agile Delivery</p>
                    </div>
                  </div>
                </div>

                {/* Live Products Quick Summary */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>3 Live Products</span>
                  <span>•</span>
                  <span>4 Ongoing Projects</span>
                  <span>•</span>
                  <span className="text-cyan-400 font-medium">Kathmandu, NP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
