'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  Workflow, 
  Cpu, 
  ShieldCheck, 
  Database, 
  Server, 
  Code2, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Terminal, 
  GitBranch, 
  ExternalLink 
} from 'lucide-react';

export default function TechnicalVisualizations() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'domains' | 'code-matrix'>('architecture');
  const [selectedArch, setSelectedArch] = useState<'gallapasal' | 'aiml' | 'qa'>('gallapasal');

  // Honest language breakdown from verified open-source repositories
  const languageDistribution = [
    { name: 'TypeScript', percentage: 42, color: 'bg-cyan-400', textColor: 'text-cyan-400', repos: 'Gallapasal UI, Digital Nomads, Language Guru, AI-Voice' },
    { name: 'Python', percentage: 28, color: 'bg-blue-500', textColor: 'text-blue-400', repos: 'ImageCaptioning, ForestFirePredict, faceRecog, Pygame' },
    { name: 'PHP (Laravel 11)', percentage: 18, color: 'bg-indigo-500', textColor: 'text-indigo-400', repos: 'Gallapasal Backend, Hostel Management' },
    { name: 'SQL & Database Schemas', percentage: 7, color: 'bg-emerald-400', textColor: 'text-emerald-400', repos: 'Relational ACID Transactions, Dual AD/BS Ledgers' },
    { name: 'HTML5 / CSS3 / Tailwind', percentage: 5, color: 'bg-purple-400', textColor: 'text-purple-400', repos: 'Responsive layouts, Micro-animations' },
  ];

  // Engineering Competency Focus
  const domainMatrix = [
    {
      domain: 'Full-Stack Web Architecture',
      level: 'Production Systems',
      description: 'Decoupled SPAs, Next.js App Router, Laravel 11 REST APIs, Zustand state persistence, and responsive UI systems.',
      technologies: ['React 19', 'Next.js 15', 'TypeScript', 'Laravel 11', 'Tailwind CSS', 'Vite'],
      focusMetric: 'High-Throughput Web Applications',
      icon: <Server className="w-5 h-5 text-cyan-400" />
    },
    {
      domain: 'Applied AI & Machine Learning',
      level: 'Research & Prototyping',
      description: 'Convolutional neural networks (ResNet-50), sequence decoders (LSTM), OpenCV real-time vision pipelines, and predictive regressors.',
      technologies: ['Python', 'TensorFlow', 'OpenCV', 'Scikit-Learn', 'Keras', 'NumPy'],
      focusMetric: 'Computer Vision & Deep Learning',
      icon: <Cpu className="w-5 h-5 text-purple-400" />
    },
    {
      domain: 'Quality Assurance & Reliability',
      level: 'Systematic Practice',
      description: 'API contract verification, boundary condition hunting, automated regression testing, and defect prevention.',
      technologies: ['PHPUnit', 'Postman / cURL', 'Sanctum Security', 'Regression Testing', 'UAT'],
      focusMetric: 'Defect Prevention & Zero Regressions',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />
    },
    {
      domain: 'Relational Databases & Storage',
      level: 'Transactional Schemas',
      description: 'Normalized MySQL/MariaDB database schemas, ACID transaction rollbacks, multi-tenant ledgers, and indexing.',
      technologies: ['MySQL', 'MariaDB', 'Transactions (ACID)', 'Query Optimization', 'Foreign Constraints'],
      focusMetric: 'Synchronized AD/BS Ledgers',
      icon: <Database className="w-5 h-5 text-blue-400" />
    }
  ];

  return (
    <section
      id="visualizations"
      aria-label="Technical Visualizations and Architecture"
      className="py-24 bg-slate-900/50 border-t border-slate-800/80 relative overflow-hidden"
    >
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-br from-cyan-500/5 via-blue-600/5 to-indigo-600/5 blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20 inline-flex items-center space-x-1.5">
            <Workflow className="w-3.5 h-3.5" />
            <span>Technical Visualizations</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-4 tracking-tight">
            System Architecture & Engineering Metrics
          </h2>
          <p className="text-base sm:text-lg text-slate-400 mt-3">
            Honest architectural workflows and verifiable technical distribution drawn from real production projects and open-source codebases.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'architecture'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-950/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Workflow className="w-4 h-4" />
              <span>System Architectures</span>
            </button>

            <button
              onClick={() => setActiveTab('domains')}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'domains'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-950/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Engineering Domains</span>
            </button>

            <button
              onClick={() => setActiveTab('code-matrix')}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'code-matrix'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-950/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>Repository Code Share</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SYSTEM ARCHITECTURE FLOWS */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            {/* Sub-selector for Architecture Diagram */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setSelectedArch('gallapasal')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedArch === 'gallapasal'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                01. Gallapasal POS & Ledger Flow
              </button>

              <button
                onClick={() => setSelectedArch('aiml')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedArch === 'aiml'
                    ? 'bg-purple-500/15 text-purple-400 border-purple-500/40'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                02. Deep Learning Vision-to-Text Pipeline
              </button>

              <button
                onClick={() => setSelectedArch('qa')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedArch === 'qa'
                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/40'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                03. Quality Assurance & Release Pipeline
              </button>
            </div>

            {/* Architecture Canvas Card */}
            <div className="p-6 sm:p-10 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-2xl relative">
              {/* Gallapasal Flow */}
              {selectedArch === 'gallapasal' && (
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                        <span>Gallapasal POS Transaction Architecture</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-normal">
                          Live Production Stack
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        High-throughput transactional flow ensuring ACID stock balances, dual AD/BS calendar synchronization, and automated invoice PDF generation.
                      </p>
                    </div>
                  </div>

                  {/* Flow Diagram Nodes */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
                    {/* Node 1 */}
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/30 text-center relative group hover:border-cyan-400 transition-colors">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">Step 1 â€¢ Client</span>
                      <h4 className="text-sm font-bold text-slate-100">React 19 & Vite</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Zustand state store calculates gross/tare weights instantly with zero latency.
                      </p>
                    </div>

                    <div className="hidden md:flex justify-center text-slate-600">
                      <ArrowRight className="w-5 h-5 text-cyan-400" />
                    </div>

                    {/* Node 2 */}
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-500/30 text-center relative group hover:border-blue-400 transition-colors">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">Step 2 â€¢ API</span>
                      <h4 className="text-sm font-bold text-slate-100">Laravel 11 Gateway</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        FormRequest validation, session token authentication & rate-limiting checks.
                      </p>
                    </div>

                    <div className="hidden md:flex justify-center text-slate-600">
                      <ArrowRight className="w-5 h-5 text-blue-400" />
                    </div>

                    {/* Node 3 */}
                    <div className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 text-center relative group hover:border-indigo-400 transition-colors">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">Step 3 â€¢ Business</span>
                      <h4 className="text-sm font-bold text-slate-100">Nepali AD/BS Engine</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Bidirectional date conversion; maps Gregorian ISO to Bikram Sambat tax periods.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3">
                      <Database className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-slate-200">ACID Database Transaction (MySQL)</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Wraps grain stock decrements, merchant credit balance, and slip logs in <code className="text-slate-300">DB::transaction</code> to prevent negative stock states.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start space-x-3">
                      <Server className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="text-xs font-bold text-slate-200">Server-Side PDF Voucher Rendering</h5>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Streamlined voucher generation producing receipt slip printouts formatted for thermal POS printers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI/ML Flow */}
              {selectedArch === 'aiml' && (
                <div className="space-y-8">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                      <span>Deep Learning Vision-to-Text Pipeline</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-normal">
                        CNN-RNN Architecture
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Multi-modal neural pipeline converting spatial image matrices into human-readable descriptive text captions.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/30 text-center">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">Stage 1</span>
                      <h4 className="text-sm font-bold text-slate-100">Visual Input</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        High-resolution image resized to 224x224 RGB matrix with standard normalization.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 text-center">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">Stage 2</span>
                      <h4 className="text-sm font-bold text-slate-100">ResNet-50 Encoder</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Convolutional backbone extracts a dense 2048-dimensional feature embedding.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-blue-500/30 text-center">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">Stage 3</span>
                      <h4 className="text-sm font-bold text-slate-100">LSTM Decoder</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Recurrent layers decode word probabilities sequentially over time steps.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 text-center">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">Stage 4</span>
                      <h4 className="text-sm font-bold text-slate-100">Beam Search</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Greedy / beam search selects the highest-probability English sentence output.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* QA Flow */}
              {selectedArch === 'qa' && (
                <div className="space-y-8">
                  <div className="border-b border-slate-800 pb-4">
                    <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                      <span>Quality Assurance & Defect Prevention</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-normal">
                        Engineering Discipline
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Systematic test lifecycle preventing regressions before code reaches production servers.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">01. Analysis</span>
                      <h4 className="text-sm font-bold text-slate-100">Spec & Edge Cases</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Identify boundary conditions, leap year calendar math, and negative balance scenarios.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">02. Automation</span>
                      <h4 className="text-sm font-bold text-slate-100">PHPUnit & Unit Tests</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Automated assertions for tare math, tax percentages, and gross/net calculations.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">03. Integration</span>
                      <h4 className="text-sm font-bold text-slate-100">API Contract Testing</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Validate HTTP response codes, headers, and authentication barriers via Postman / cURL.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">04. Release</span>
                      <h4 className="text-sm font-bold text-slate-100">Zero-Downtime Deploy</h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Asset cache-busting, database migration safety checks, and rollback scripts.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ENGINEERING DOMAINS MATRIX */}
        {activeTab === 'domains' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {domainMatrix.map((item, index) => (
              <div
                key={index}
                className="p-6 sm:p-8 rounded-3xl bg-slate-950/80 border border-slate-800 hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
                        {item.icon}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">
                          {item.level}
                        </span>
                        <h3 className="text-lg font-bold text-slate-100">{item.domain}</h3>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <span className="text-[11px] font-semibold text-slate-300 block">Demonstrated In Practice:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-between items-center text-xs text-slate-500">
                  <span className="flex items-center text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                    {item.focusMetric}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: CODE SHARE MATRIX */}
        {activeTab === 'code-matrix' && (
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-2xl max-w-4xl mx-auto space-y-8">
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
                <span>Verified Repository Codebase Share</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-normal">
                  Public GitHub & Enterprise Projects
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Measured by active production systems and open-source repositories hosted on GitHub.
              </p>
            </div>

            {/* Visual Multi-Segment Bar */}
            <div className="space-y-3">
              <div className="h-4 w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden flex shadow-inner">
                {languageDistribution.map((lang) => (
                  <div
                    key={lang.name}
                    className={`${lang.color} transition-all duration-500 hover:opacity-80`}
                    style={{ width: `${lang.percentage}%` }}
                    title={`${lang.name}: ${lang.percentage}%`}
                  />
                ))}
              </div>

              {/* Legend with Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {languageDistribution.map((lang) => (
                  <div key={lang.name} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className={`w-3 h-3 rounded-full ${lang.color}`}></span>
                        <span className="text-xs font-bold text-slate-200">{lang.name}</span>
                      </div>
                      <span className={`text-xs font-extrabold ${lang.textColor}`}>
                        {lang.percentage}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {lang.repos}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
              <span>All metrics represent actual code volume across working repositories.</span>
              <a
                href="https://github.com/DRKAFLE123"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                <span>View GitHub Profile</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
