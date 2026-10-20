import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, BookOpen, Share2, MapPin, CheckCircle2, ChevronRight, Terminal, User } from 'lucide-react';
import { blogPosts } from '../../../data/blogData';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: 'Article Not Found' };

  return {
    title: `${post.title} | Damodar Kafle`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Damodar Kafle`,
      description: post.excerpt,
      type: 'article',
    },
  };
}

export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <article className="min-h-screen pt-32 pb-24 bg-[#090d16] text-[#f8fafc]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Technical Essays</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="border-b border-slate-800 pb-10 mb-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {post.category}
            </span>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-500" />
                {post.date}
              </span>
              <span>â€¢</span>
              <span className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                {post.readTime}
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Quick Table of Contents */}
        {post.tableOfContents.length > 0 && (
          <nav aria-label="Table of Contents" className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800/80 mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center space-x-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Table of Contents</span>
            </h2>
            <ul className="space-y-2">
              {post.tableOfContents.map((item, idx) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-xs sm:text-sm text-slate-300 hover:text-cyan-400 transition-colors flex items-center"
                  >
                    <span className="text-slate-500 font-mono mr-2 text-[11px]">0{idx + 1}.</span>
                    <span>{item.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Article Main Sections */}
        <div className="space-y-12 leading-relaxed text-slate-300 text-base">
          {post.content.map((sec) => (
            <section key={sec.sectionId} id={sec.sectionId} className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight pt-4 border-t border-slate-800/60">
                {sec.heading}
              </h2>

              {sec.body.map((p, idx) => (
                <p key={idx} className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {p}
                </p>
              ))}

              {sec.callout && (
                <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs sm:text-sm text-cyan-200 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-cyan-400 text-[10px] block">
                    Engineering Note
                  </span>
                  <p className="leading-relaxed">{sec.callout.text}</p>
                </div>
              )}

              {sec.codeSnippet && (
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/90 shadow-xl">
                  <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400 font-mono">
                    <span>{sec.codeSnippet.language}</span>
                    <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                    <code>{sec.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Author Bio Box */}
        <div className="mt-16 p-8 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg shadow-cyan-500/20">
            DK
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-slate-100">Damodar Kafle</h3>
            <p className="text-xs font-semibold text-cyan-400">Senior Full-Stack Developer & AI/ML Engineer â€¢ Kathmandu, Nepal</p>
            <p className="text-xs text-slate-400 leading-relaxed pt-1">
              BSc CSIT graduate from Tribhuvan University (2023). Builder of Gallapasal POS, Digital Nomads in Nepal, and Language Guru. Specializes in robust web architecture, deep learning pipelines, and quality assurance.
            </p>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-100">More Technical Essays</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/30 transition-all block group"
                >
                  <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                    {rel.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {rel.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
