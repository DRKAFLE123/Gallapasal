import React from 'react';
import { Project } from '../types';
import { ExternalLink, Github, CheckCircle2, Clock, Code, Layers } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const isLive = project.status === 'Live Product';
  const isOngoing = project.status === 'Ongoing Project';

  return (
    <article
      id={`project-${project.id}`}
      className="flex flex-col h-full rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20 group overflow-hidden"
    >
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header row: Status badge & primary category */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span
              className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                isLive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : isOngoing
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}
            >
              {isLive ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <Clock className="w-3 h-3" />
              )}
              <span>{project.status}</span>
            </span>

            <span className="text-xs font-medium text-slate-400">
              {project.category[0]}
            </span>
          </div>

          {/* Project Title & Tagline */}
          <h3 className="text-xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-xs font-medium text-cyan-400/90 mt-1 mb-3">
            {project.tagline}
          </p>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <ul className="space-y-1.5 mb-5 text-xs text-slate-400">
              {project.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-cyan-400 mr-2 font-bold">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer section: Tech stack & Links */}
        <div>
          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800/80 mb-5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex items-center space-x-3 pt-1">
            {/* Live Demo Link (ONLY rendered when project has verified liveUrl) */}
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                aria-label={`Open live demo of ${project.title}`}
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : null}

            {/* GitHub Repository Link */}
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-slate-100 text-xs font-medium border border-slate-700/60 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                aria-label={`View ${project.title} on GitHub`}
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source Code</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
