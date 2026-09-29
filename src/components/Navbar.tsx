import React from 'react';
import { ShieldAlert, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'how-it-works' | 'safety-centre' | 'about' | 'privacy';
  setActiveTab: (tab: 'home' | 'how-it-works' | 'safety-centre' | 'about' | 'privacy') => void;
  onAnalyzeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onAnalyzeClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark */}
        <button 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:border-teal-400 transition-colors">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-teal-300 transition-colors">
            FraudLens
          </span>
        </button>

        {/* Zone 2: 4-5 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors hover:text-white ${
              activeTab === 'home' ? 'text-teal-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('how-it-works')}
            className={`transition-colors hover:text-white ${
              activeTab === 'how-it-works' ? 'text-teal-400 font-semibold' : 'text-slate-400'
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => setActiveTab('safety-centre')}
            className={`transition-colors hover:text-white ${
              activeTab === 'safety-centre' ? 'text-teal-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Safety Centre
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`transition-colors hover:text-white ${
              activeTab === 'about' ? 'text-teal-400 font-semibold' : 'text-slate-400'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`transition-colors hover:text-white ${
              activeTab === 'privacy' ? 'text-teal-400 font-semibold' : 'text-slate-400'
            }`}
          >
            Privacy
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('home');
              onAnalyzeClick();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-teal-400 hover:bg-teal-300 active:scale-95 transition-all rounded-lg shadow-sm shadow-teal-500/20 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          >
            Analyze Now
          </button>
        </div>
      </div>
    </header>
  );
};
