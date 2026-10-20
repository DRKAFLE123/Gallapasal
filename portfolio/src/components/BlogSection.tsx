'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Calendar, Clock, Tag, Sparkles, Terminal } from 'lucide-react';
import { blogPosts } from '../data/blogData';

export default function BlogSection() {
  const featuredPost = blogPosts.find((p) => p.featured) || blogPosts[0];
  const secondaryPosts = blogPosts.filter((p) => p.slug !== featuredPost.slug).slice(0, 3);

  return (
    <section
      id="writing"
      aria-label="Technical Writing and Engineering Insights"
      className="py-24 bg-slate-900/40 border-t border-slate-800/60 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20 inline-flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Writing & Insights</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100 mt-4 tracking-tight">
              Engineering Notes & Technical Essays
            </h2>
            <p className="text-base sm:text-lg text-slate-400 mt-2 max-w-2xl">
              Reflections on software architecture, full-stack scalability, applied machine learning, and lessons from building production systems.
            </p>
          </div>

          <Link
            id="view-all-blog-posts-btn"
            href="/blog"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors py-2 px-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/30 group"
          >
            <span>View All Essays</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Featured Post Card */}
        <div className="mb-10">
          <Link
            href={`/blog/${featuredPost.slug}`}
            className="group block p-8 sm:p-10 rounded-3xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 shadow-2xl transition-all duration-300 relative overflow-hidden"
          >
            {/* Ambient Background Glow on hover */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-cyan-500/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Featured Essay â€¢ {featuredPost.category}
                  </span>
                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      {featuredPost.date}
                    </span>
                    <span>â€¢</span>
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-100 group-hover:text-cyan-400 transition-colors tracking-tight leading-tight">
                  {featuredPost.title}
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                  {featuredPost.excerpt}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {featuredPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <span className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-slate-950 font-semibold text-xs sm:text-sm transition-all shadow-md">
                  <span>Read Full Essay</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Secondary Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {secondaryPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="p-6 sm:p-7 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-cyan-950/15"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    {post.category}
                  </span>
                  <span className="flex items-center text-slate-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-cyan-400 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between text-xs text-slate-400">
                <span>{post.date}</span>
                <span className="text-cyan-400 font-semibold inline-flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Read</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
