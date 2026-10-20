import React from 'react';
import { GraduationCap, Briefcase, CheckCircle2, Calendar, MapPin, Award } from 'lucide-react';
import { educationData } from '../data/skillsData';

export default function ExperienceEducation() {
  return (
    <section
      id="experience-education"
      aria-label="Education and Professional Background"
      className="py-24 bg-slate-900/40 border-t border-slate-800/60 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Background
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-4 tracking-tight">
            Education & Professional Discipline
          </h2>
          <p className="text-base sm:text-lg text-slate-400 mt-3">
            Academic foundation and specialized engineering disciplines with transparent credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Education Card */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Verified Degree</span>
                  <h3 className="text-lg font-bold text-slate-100">BSc in Computer Science & IT</h3>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-center text-slate-400 text-xs space-x-4">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    Graduated 2023
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    Tribhuvan University, Nepal
                  </span>
                </div>

                <p className="leading-relaxed text-slate-400 text-xs sm:text-sm">
                  {educationData.details}
                </p>

                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                    <span>Focus on Algorithms, Database Schemas & Artificial Intelligence</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                    <span>Software Engineering & Object-Oriented System Architecture</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center">
              <span>National University Credential</span>
              <span className="text-emerald-400 font-medium">Completed & Verified</span>
            </div>
          </div>

          {/* QA & Project Management Card */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Engineering Focus</span>
                  <h3 className="text-lg font-bold text-slate-100">QA & Technical Project Delivery</h3>
                </div>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-center text-slate-400 text-xs space-x-4">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    Active Practice
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    Full Lifecycle
                  </span>
                </div>

                <p className="leading-relaxed text-slate-400 text-xs sm:text-sm">
                  Bridging software development with rigorous quality assurance and technical governance. Applying structured test suites, defect reproduction matrixes, API schema validations, and continuous verification.
                </p>

                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                    <span>Manual & Automated API and Regression Test Suites</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                    <span>Agile Sprint Delivery & User Acceptance Criteria Management</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center">
              <span>Full Engineering Lifecycle</span>
              <span className="text-cyan-400 font-medium">Quality-First Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
