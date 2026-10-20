'use client';

import React, { useState, useMemo } from 'react';
import { projectsData } from '../data/projectsData';
import { ProjectCategory } from '../types';
import ProjectCard from './ProjectCard';
import { Filter, Layers, Sparkles } from 'lucide-react';

const categories: ProjectCategory[] = [
  'All',
  'Live Products',
  'Web Applications',
  'AI / ML',
  'E-Commerce',
  'Games',
  'Ongoing',
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projectsData;
    return projectsData.filter((p) => p.category.includes(activeCategory));
  }, [activeCategory]);

  return (
    <section
      id="projects"
      aria-label="Verified Projects and Products"
      className="py-24 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-4 tracking-tight">
            Featured Projects & Real-World Products
          </h2>
          <p className="text-base sm:text-lg text-slate-400 mt-3">
            Explore live production web applications, open-source AI/ML models, and ongoing engineering developments with verified repository references.
          </p>
        </div>

        {/* Filter Navigation Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            const count =
              category === 'All'
                ? projectsData.length
                : projectsData.filter((p) => p.category.includes(category)).length;

            return (
              <button
                key={category}
                id={`filter-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => setActiveCategory(category)}
                className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                <span>{category}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-700/60 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Live System Operational Note */}
        <div className="mt-14 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center max-w-2xl mx-auto">
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-200">Verification Guarantee:</strong> All repositories, deployed platform URLs, and academic credentials showcased above are verified against active codebases. No unverified employment, client logos, or fabricated metrics are used.
          </p>
        </div>
      </div>
    </section>
  );
}
