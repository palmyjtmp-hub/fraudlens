import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ShieldAlert,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import { LEARNING_ARTICLES, LearningArticle } from '../data/learningArticles';

export const SafetyCentreView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<LearningArticle | null>(null);

  const categories = ['All', 'Communication Threats', 'Web Security', 'E-Commerce Safety', 'Financial Safety', 'Physical & Digital', 'Credential Protection', 'Incident Response'];

  const filteredArticles = LEARNING_ARTICLES.filter(art => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.whatItIs.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-teal-400">
          FraudLens Safety Centre
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Practical Digital Defense Guides
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Clear, jargon-free guides designed for everyday internet and smartphone users. Learn how scammers operate, how to spot warning signs, and what practical steps to take.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides (e.g. PayPal, OTP codes, parcel tracking, QR stickers)..."
            className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-400 font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills as Interactive Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-400 text-slate-950 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="bg-slate-900/70 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 flex flex-col justify-between space-y-4 cursor-pointer transition-all hover:-translate-y-0.5 group shadow-lg shadow-slate-950/40"
          >
            <div className="space-y-3">
              {/* Unboxed metadata line with typographic separator */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-teal-400 font-semibold">{article.category}</span>
                <span aria-hidden="true">·</span>
                <span>{article.readTime}</span>
              </div>

              <h2 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors leading-snug">
                {article.title}
              </h2>

              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {article.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-teal-400 group-hover:text-teal-300">
              <span>Read Safety Guide</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Emergency Immediate Action Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-900/50 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Action Protocol</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Did you already click a link or enter passwords?
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Do not panic. Follow our step-by-step incident response checklist to freeze accounts, change master credentials, and protect your finances right now.
          </p>
        </div>

        <button
          onClick={() => {
            const emergencyArt = LEARNING_ARTICLES.find(a => a.id === 'after-clicking-suspicious-link');
            if (emergencyArt) setActiveArticle(emergencyArt);
          }}
          className="px-5 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-rose-900/30 whitespace-nowrap cursor-pointer"
        >
          View Emergency Checklist
        </button>
      </div>

      {/* Full Article Modal / Drawer */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="space-y-2 pr-8">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-teal-400 font-semibold">{activeArticle.category}</span>
                <span aria-hidden="true">·</span>
                <span>{activeArticle.readTime}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeArticle.title}
              </h2>
              <p className="text-sm text-slate-300">
                {activeArticle.summary}
              </p>
            </div>

            {/* What it is */}
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5 text-xs sm:text-sm">
              <span className="font-bold text-white block">What It Is:</span>
              <p className="text-slate-300 leading-relaxed">{activeArticle.whatItIs}</p>
            </div>

            {/* Real World Example */}
            <div className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-xl space-y-1.5 text-xs sm:text-sm">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Real-World Scam Example:
              </span>
              <p className="text-amber-100/90 font-mono text-xs bg-slate-950/80 p-2.5 rounded border border-amber-900/50">
                {activeArticle.realWorldExample}
              </p>
            </div>

            {/* Warning Signs */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Red Flags & Warning Signs to Spot:
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {activeArticle.warningSigns.map((sign, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                    <span>{sign}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practical Safety Steps */}
            <div className="space-y-2.5">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                Practical Defense Checklist:
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {activeArticle.safetyChecklist.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* If targeted */}
            <div className="space-y-2.5 pt-2 border-t border-slate-800">
              <h4 className="text-sm font-bold text-rose-400">
                Immediate Steps If You Were Targeted:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {activeArticle.immediateStepsIfTargeted.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
              >
                Close Guide
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
