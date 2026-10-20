import React from 'react';
import { Github, Star, GitFork, ExternalLink, ArrowRight, BookOpen, Terminal } from 'lucide-react';

interface RepoItem {
  name: string;
  desc: string;
  lang: string;
  url: string;
  tag: string;
}

const verifiedRepos: RepoItem[] = [
  {
    name: 'Gallapasal',
    desc: 'Point-of-sale & grain accounting web application with dual Gregorian/Bikram Sambat calendar.',
    lang: 'TypeScript / PHP',
    url: 'https://github.com/DRKAFLE123/Gallapasal',
    tag: 'Production POS'
  },
  {
    name: 'digital-nomads-in-nepal',
    desc: 'Discovery platform for nomad workspaces, mountain stays, and community adventures in Nepal.',
    lang: 'TypeScript',
    url: 'https://github.com/DRKAFLE123/digital-nomads-in-nepal',
    tag: 'Live Product'
  },
  {
    name: 'JapanKoreaHub',
    desc: 'Comprehensive language learning (JLPT & TOPIK), jobs, and accommodation resource portal.',
    lang: 'TypeScript',
    url: 'https://github.com/DRKAFLE123/JapanKoreaHub',
    tag: 'Live Product'
  },
  {
    name: 'ImageCaptioning',
    desc: 'Automatic image captioning using CNN (ResNet-50) and RNN (LSTM) deep learning networks.',
    lang: 'Jupyter Notebook',
    url: 'https://github.com/DRKAFLE123/ImageCaptioning',
    tag: 'AI / ML'
  },
  {
    name: 'ForestFirePredict',
    desc: 'Wildland forest fire hazard analysis and prediction models based on meteorological metrics.',
    lang: 'Jupyter Notebook',
    url: 'https://github.com/DRKAFLE123/ForestFirePredict',
    tag: 'AI / ML'
  },
  {
    name: 'faceRecog',
    desc: 'Real-time facial detection and identification pipeline utilizing OpenCV and TensorFlow.',
    lang: 'Python',
    url: 'https://github.com/DRKAFLE123/faceRecog',
    tag: 'Computer Vision'
  },
  {
    name: 'AI-Voice',
    desc: 'Exploration of neural text-to-speech audio pipelines and synthetic voice modulation.',
    lang: 'TypeScript',
    url: 'https://github.com/DRKAFLE123/AI-Voice',
    tag: 'AI Audio'
  },
  {
    name: 'Sajilo_Dokan',
    desc: 'B2C software-as-a-service e-commerce shop management and customer ordering concept.',
    lang: 'TypeScript',
    url: 'https://github.com/DRKAFLE123/Sajilo_Dokan',
    tag: 'E-Commerce SAAS'
  }
];

export default function GitHubSection() {
  return (
    <section
      id="github"
      aria-label="GitHub Repositories and Open Source Contributions"
      className="py-24 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Open Source
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-4 tracking-tight">
              GitHub Repositories & Research
            </h2>
            <p className="text-base text-slate-400 mt-2">
              Verified public repositories authored under <strong className="text-slate-200">@DRKAFLE123</strong>.
            </p>
          </div>

          <a
            href="https://github.com/DRKAFLE123"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 mt-4 md:mt-0 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 self-start md:self-auto"
          >
            <Github className="w-4 h-4" />
            <span>Follow on GitHub</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>

        {/* Repositories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {verifiedRepos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-950/20 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                      {repo.tag}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>

                <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors mb-2">
                  {repo.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {repo.desc}
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t border-slate-800/80 mt-4 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>{repo.lang}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
