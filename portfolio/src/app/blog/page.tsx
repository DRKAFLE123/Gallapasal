'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Search, ArrowLeft, ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { blogPosts } from '../../data/blogData';

export default function BlogListingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Architecture', 'AI & ML', 'Quality Assurance', 'Engineering Process'];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#090d16] text-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio</span>
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-slate-800 pb-10 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20 inline-flex items-center space-x-1.5 mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Engineering Notes & Essays</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
            Writing & Technical Insights
          </h1>
          <p className="text-base sm:text-lg text-slate-400 mt-3 max-w-3xl leading-relaxed">
            In-depth architectural explorations, applied machine learning pipelines, and quality assurance principles written by <strong className="text-slate-200">Damodar Kafle</strong>.
          </p>

          {/* Search & Category Filter */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search essays by keyword..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      {post.category}
                    </span>
                    <span className="flex items-center text-slate-500">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-100 group-hover:text-cyan-400 transition-colors leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800/80"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>{post.date}</span>
                  <span className="text-cyan-400 font-semibold inline-flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Essay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-slate-950/60 border border-slate-800">
            <p className="text-slate-400 text-sm">No essays match your current filter query.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 text-cyan-400 hover:bg-slate-700"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
