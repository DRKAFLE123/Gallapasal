'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  Workflow, 
  Code2, 
  ShieldCheck, 
  Rocket, 
  CheckCircle2, 
  Terminal, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';

interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  icon: React.ReactNode;
  accent: string;
}

export default function EngineeringProcess() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps: ProcessStep[] = [
    {
      number: '01',
      title: 'Discovery & Spec',
      subtitle: 'Domain Modeling & Edge Cases',
      description: 'Understanding real-world user friction before writing a single line of code. We map business logic (e.g. Nepali Bikram Sambat tax cycles, agricultural inventory units, or coliving directory filters).',
      deliverables: [
        'User workflow journey maps',
        'Relational data schema specifications',
        'Edge case & boundary condition catalog'
      ],
      icon: <Compass className="w-5 h-5 text-cyan-400" />,
      accent: 'border-cyan-500/40 text-cyan-400'
    },
    {
      number: '02',
      title: 'Architecture & Schema',
      subtitle: 'Type-Safe Contracts & ACID Rules',
      description: 'Designing normalized database schemas, index strategies, and clean API endpoints. Establishing strict TypeScript interfaces that prevent runtime mismatch between backend and frontend.',
      deliverables: [
        'Normalized 3NF relational schemas',
        'Strict REST API endpoints (OpenAPI / Swagger specs)',
        'State management strategy (Zustand / Redux)'
      ],
      icon: <Workflow className="w-5 h-5 text-blue-400" />,
      accent: 'border-blue-500/40 text-blue-400'
    },
    {
      number: '03',
      title: 'Implementation',
      subtitle: 'Modular Full-Stack Development',
      description: 'Building decoupled, high-performance web applications with React 19, Next.js 15, and Laravel 11. Emphasizing clean component hierarchies, semantic HTML, and mobile-first responsiveness.',
      deliverables: [
        'Decoupled client architecture with Vite / Next.js',
        'Validated backend controllers with CSRF/Sanctum security',
        'Responsive layouts tested down to 320px mobile screens'
      ],
      icon: <Code2 className="w-5 h-5 text-indigo-400" />,
      accent: 'border-indigo-500/40 text-indigo-400'
    },
    {
      number: '04',
      title: 'Testing & QA',
      subtitle: 'Defect Prevention & Boundary Tests',
      description: 'Applying rigorous quality assurance principles from specification to execution. Automated unit assertions, manual exploratory testing, and end-to-end API validations.',
      deliverables: [
        'PHPUnit test suites for core business math',
        'API contract tests via Postman / cURL',
        'Cross-browser and low-bandwidth latency verification'
      ],
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      accent: 'border-emerald-500/40 text-emerald-400'
    },
    {
      number: '05',
      title: 'Deployment & CI/CD',
      subtitle: 'Zero-Downtime Live Delivery',
      description: 'Production rollouts with environment isolation, hashed asset caching, and automated DNS routing on platforms like Vercel and cPanel.',
      deliverables: [
        'Automated build scripts (PowerShell & npm)',
        'Automated SSL & HTTP/2 Anycast CDN configuration',
        'Safe database migration pipelines and rollback strategy'
      ],
      icon: <Rocket className="w-5 h-5 text-purple-400" />,
      accent: 'border-purple-500/40 text-purple-400'
    }
  ];

  return (
    <section
      id="process"
      aria-label="Engineering Methodology and Process"
      className="py-24 bg-slate-900/30 border-t border-slate-800/60 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20 inline-flex items-center space-x-1.5">
            <Workflow className="w-3.5 h-3.5" />
            <span>Methodology</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-4 tracking-tight">
            The Engineering Discipline
          </h2>
          <p className="text-base sm:text-lg text-slate-400 mt-3">
            A systematic engineering process connecting conceptual problem discovery to verified, scalable production software.
          </p>
        </div>

        {/* Desktop Step Navigation */}
        <div className="hidden lg:grid grid-cols-5 gap-3 mb-8">
          {steps.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <button
                key={step.number}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 relative ${
                  isSelected
                    ? 'bg-slate-900/90 border-cyan-500/50 shadow-lg shadow-cyan-950/20'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700/80 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-mono font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {step.number}
                  </span>
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-900 text-slate-500'}`}>
                    {step.icon}
                  </div>
                </div>
                <h4 className={`text-sm font-bold ${isSelected ? 'text-slate-100' : 'text-slate-300'}`}>
                  {step.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {step.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detailed Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
                <span className="font-mono font-bold text-cyan-400">STAGE {steps[activeStep].number} OF 05</span>
                <span className="text-slate-600">â€¢</span>
                <span className="text-slate-400">{steps[activeStep].subtitle}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                {steps[activeStep].title}
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {steps[activeStep].description}
              </p>

              {/* Mobile next/prev controls */}
              <div className="flex lg:hidden items-center space-x-2 pt-2">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveStep(i)}
                    className={`h-2 rounded-full transition-all ${activeStep === i ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700'}`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block mb-2">
                Key Engineering Deliverables
              </span>
              <ul className="space-y-2.5">
                {steps[activeStep].deliverables.map((item, index) => (
                  <li key={index} className="flex items-start text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2.5 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
