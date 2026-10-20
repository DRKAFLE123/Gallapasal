'use client';

import React from 'react';
import { X, Download, Printer, GraduationCap, CheckCircle2, Briefcase, Code, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl shadow-cyan-950/30 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
            <span className="text-sm font-semibold text-slate-200">Damodar Kafle â€” Curriculum Vitae</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close CV preview"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / CV Content */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-8 text-slate-300 text-sm">
          {/* Header */}
          <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 id="resume-modal-title" className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                Damodar Kafle
              </h2>
              <p className="text-base font-semibold text-cyan-400 mt-1">
                Senior Full-Stack Developer & AI/ML Engineer
              </p>
              <p className="text-xs text-slate-400 mt-1 flex items-center space-x-3">
                <span className="inline-flex items-center"><MapPin className="w-3 h-3 mr-1 text-slate-500" /> Kathmandu, Nepal</span>
                <span>â€¢</span>
                <span className="inline-flex items-center"><Mail className="w-3 h-3 mr-1 text-slate-500" /> damodarms0804@gmail.com</span>
                <span>â€¢</span>
                <span className="inline-flex items-center"><Phone className="w-3 h-3 mr-1 text-slate-500" /> +977-9865575108</span>
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified Credentials
              </span>
            </div>
          </div>

          {/* Education */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center">
              <GraduationCap className="w-4 h-4 mr-2" /> Academic Education
            </h3>
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-slate-100">BSc in Computer Science and Information Technology (BSc CSIT)</h4>
                <span className="text-xs text-slate-400 font-medium">Graduated 2023</span>
              </div>
              <p className="text-xs text-slate-400">Tribhuvan University â€” Kathmandu, Nepal</p>
              <p className="text-xs text-slate-300 pt-1 leading-relaxed">
                4-year degree covering Algorithms, Advanced Data Structures, Relational Database Management, Machine Learning, Computer Vision, Software Engineering, Compiler Design, and Operating Systems.
              </p>
            </div>
          </section>

          {/* Flagship Production Products */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center">
              <Briefcase className="w-4 h-4 mr-2" /> Selected Flagship Systems & Products
            </h3>
            
            <div className="space-y-3">
              {/* Gallapasal */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-100">Gallapasal â€” Enterprise Point-of-Sale & Grain Ledger Accounting</h4>
                    <p className="text-xs text-cyan-400">Laravel 11, React 19, TypeScript, Tailwind CSS, MySQL, Zustand, Vite</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live Product
                  </span>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  <li>Designed transactional schema for dual calendar reconciliation (Gregorian AD and Nepali Bikram Sambat BS).</li>
                  <li>Engineered real-time grain stock inventory audit trail with multi-party purchase and sales registers.</li>
                  <li>Built automated server-side PDF invoice and receipt printing pipelines.</li>
                </ul>
              </div>

              {/* Digital Nomads in Nepal */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-100">Digital Nomads in Nepal â€” Workspaces & Mountain Retreats Directory</h4>
                    <p className="text-xs text-cyan-400">Next.js, React, TypeScript, Tailwind CSS, Vercel</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live Product
                  </span>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  <li>Directory of verified coliving hubs, mountain cafes, and high-speed workspaces across Kathmandu, Pokhara, and rural Nepal.</li>
                  <li>Direct WhatsApp customer routing, dynamic amenity filtering, and responsive mobile-first architecture.</li>
                </ul>
              </div>

              {/* Language Guru */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-100">Language Guru (JapanKoreaHub)</h4>
                    <p className="text-xs text-cyan-400">React, TypeScript, Vite, Tailwind CSS</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live Product
                  </span>
                </div>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  <li>Educational syllabus modules for JLPT (N5â€“N1) and TOPIK proficiencies with verified job listings and visa resources.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* AI / ML & Computer Vision */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center">
              <Code className="w-4 h-4 mr-2" /> Applied AI & Deep Learning Research
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800 text-xs">
                <h5 className="font-bold text-slate-200">Image Captioning (ResNet-50 + LSTM)</h5>
                <p className="text-slate-400 mt-1">Deep convolutional feature extraction merged with recurrent LSTM sentence decoders.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800 text-xs">
                <h5 className="font-bold text-slate-200">Real-Time Facial Recognition (OpenCV)</h5>
                <p className="text-slate-400 mt-1">Webcam face alignment, bounding box tracking, and deep facial embedding verification.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800 text-xs">
                <h5 className="font-bold text-slate-200">Forest Fire Risk Predictor (Scikit-Learn)</h5>
                <p className="text-slate-400 mt-1">Meteorological hazard modeling with climate feature engineering and hyperparameter tuning.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800 text-xs">
                <h5 className="font-bold text-slate-200">AI Voice Synthesizer (TypeScript)</h5>
                <p className="text-slate-400 mt-1">Waveform audio rendering and neural text-to-speech voice synthesis modulation.</p>
              </div>
            </div>
          </section>

          {/* Core Technical Stack */}
          <section className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Technical Expertise Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">Frontend & UI</span>
                <span className="text-slate-400">React 19, Next.js 15, TypeScript, Tailwind CSS, Vite, Zustand</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">Backend & Databases</span>
                <span className="text-slate-400">Laravel 11, Node.js, Python (Django), MySQL, MariaDB, REST APIs</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                <span className="font-semibold text-slate-200 block mb-1">Quality & Operations</span>
                <span className="text-slate-400">PHPUnit, API Contract Testing, Git, cPanel, Vercel, Agile/Scrum</span>
              </div>
            </div>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex justify-between items-center text-xs text-slate-400">
          <span>Kathmandu, Nepal â€¢ Available for Software Architecture & Full-Stack Roles</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
