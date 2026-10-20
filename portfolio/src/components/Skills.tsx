import React from 'react';
import { skillsCategories } from '../data/skillsData';
import { 
  Layout, 
  Server, 
  Code2, 
  Database, 
  BrainCircuit, 
  ShieldCheck, 
  Terminal, 
  Kanban 
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  frontend: <Layout className="w-5 h-5 text-cyan-400" />,
  backend: <Server className="w-5 h-5 text-blue-400" />,
  languages: <Code2 className="w-5 h-5 text-indigo-400" />,
  databases: <Database className="w-5 h-5 text-emerald-400" />,
  aiml: <BrainCircuit className="w-5 h-5 text-purple-400" />,
  qa: <ShieldCheck className="w-5 h-5 text-rose-400" />,
  devops: <Terminal className="w-5 h-5 text-amber-400" />,
  pm: <Kanban className="w-5 h-5 text-teal-400" />,
};

export default function Skills() {
  return (
    <section
      id="skills"
      aria-label="Technical Skills and Core Competencies"
      className="py-24 bg-slate-900/30 border-t border-slate-800/60 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Expertise
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-4 tracking-tight">
            Technical Skills & Engineering Stack
          </h2>
          <p className="text-base sm:text-lg text-slate-400 mt-3">
            Every technology listed below is evidenced by implemented production codebases, research repositories, and deployed platforms.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillsCategories.map((category) => (
            <div
              key={category.categoryKey}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                    {categoryIcons[category.categoryKey] || <Code2 className="w-5 h-5 text-cyan-400" />}
                  </div>
                  <h3 className="text-base font-bold text-slate-200">
                    {category.title}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/40 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
