import React from 'react';
import { GraduationCap, Award, Compass, Code2, Server, ShieldCheck, Cpu } from 'lucide-react';
import { educationData } from '../data/skillsData';

export default function About() {
  return (
    <section
      id="about"
      aria-label="About Damodar Kafle"
      className="py-20 bg-slate-900/40 border-y border-slate-800/60 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-4 tracking-tight">
            Engineering Systems with Precision & Purpose
          </h2>
          <p className="text-base sm:text-lg text-slate-400 mt-3">
            A developer mindset rooted in rigorous computer science principles, practical software architecture, and real-world product delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Biography Column */}
          <div className="lg:col-span-7 space-y-6 text-slate-300 leading-relaxed text-base">
            <p>
              I am a software engineer based in <strong className="text-slate-100">Kathmandu, Nepal</strong>, holding a <strong className="text-slate-100">Bachelor of Science in Computer Science and Information Technology (BSc CSIT)</strong> from <strong className="text-slate-100">Tribhuvan University</strong>, graduating in 2023.
            </p>
            <p>
              My professional focus spans the entire product life cycle — from designing high-throughput relational schemas and secure RESTful endpoints in <strong className="text-slate-100">Laravel and Node.js</strong> to engineering intuitive, responsive user experiences with <strong className="text-slate-100">React, Next.js, and TypeScript</strong>.
            </p>
            <p>
              Beyond standard web development, I have a deep passion for <strong className="text-slate-100">Artificial Intelligence and Machine Learning</strong>, where I develop practical predictive models in computer vision (CNNs) and sequence processing (RNNs/LSTMs). In parallel, my approach to software delivery is deeply informed by <strong className="text-slate-100">Quality Assurance and Agile Project Management</strong>, ensuring that every codebase is tested for edge cases, performance bottlenecks, and regressions before reaching production.
            </p>

            {/* Core Values / Engineering Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <Code2 className="w-5 h-5 text-cyan-400 mb-2" />
                <h3 className="text-sm font-semibold text-slate-200">Maintainable Code</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Clean modular structures, type safety, and predictable state management.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <Server className="w-5 h-5 text-blue-400 mb-2" />
                <h3 className="text-sm font-semibold text-slate-200">Robust Backends</h3>
                <p className="text-xs text-slate-400 mt-1">
                  ACID database ledgers, secure session handling, and optimized SQL queries.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
                <h3 className="text-sm font-semibold text-slate-200">Quality Assured</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Systematic functional validation, defect prevention, and regression testing.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <Cpu className="w-5 h-5 text-indigo-400 mb-2" />
                <h3 className="text-sm font-semibold text-slate-200">Applied Intelligence</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Exploring practical machine learning pipelines to solve concrete problems.
                </p>
              </div>
            </div>
          </div>

          {/* Education & Verified Facts Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Formal Education</h3>
                  <p className="text-xs text-slate-400">Tribhuvan University, Nepal</p>
                </div>
              </div>

              <div className="space-y-3 text-sm border-t border-slate-800/80 pt-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Degree</span>
                  <p className="font-medium text-slate-200">{educationData.degree}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Graduation</span>
                    <p className="font-medium text-slate-200">{educationData.graduationYear}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Location</span>
                    <p className="font-medium text-slate-200">{educationData.location}</p>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Curriculum Scope</span>
                  <p className="text-xs text-slate-300 leading-relaxed mt-1">
                    {educationData.details}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Contact summary */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-sm space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Location & Details</h4>
              <p className="text-slate-300 flex justify-between">
                <span className="text-slate-400">Base:</span>
                <span className="font-medium text-slate-200">Kathmandu, Nepal</span>
              </p>
              <p className="text-slate-300 flex justify-between">
                <span className="text-slate-400">Email:</span>
                <a href="mailto:damodarms0804@gmail.com" className="font-medium text-cyan-400 hover:underline">damodarms0804@gmail.com</a>
              </p>
              <p className="text-slate-300 flex justify-between">
                <span className="text-slate-400">Phone / WhatsApp:</span>
                <a href="tel:+9779865575108" className="font-medium text-emerald-400 hover:underline">+977-9865575108</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
