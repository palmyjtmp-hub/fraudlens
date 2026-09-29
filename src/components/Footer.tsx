import React from 'react';
import { ShieldAlert, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'how-it-works' | 'safety-centre' | 'about' | 'privacy') => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-20 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <ShieldAlert className="w-3.5 h-3.5" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                FraudLens
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Global digital trust and scam detection platform. Helping everyday internet users analyze suspicious links, QR codes, and screenshots with transparent explanations.
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>See Beyond the Scam.</span>
              <span aria-hidden="true">·</span>
              <span>Defensive Cybersecurity Education</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
              Navigation
            </span>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Home & Scanner
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('how-it-works');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('safety-centre');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Safety Centre Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  About the Platform
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider block">
              Trust & Transparency
            </span>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('privacy');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Privacy Policy & Data Handling
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('how-it-works');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Model & Heuristic Limitations
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('safety-centre');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-rose-400 transition-colors text-left text-slate-400"
                >
                  Emergency Incident Plan
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} FraudLens. Educational & defensive digital trust platform.
          </p>
          <p className="text-slate-400">
            FraudLens does not replace official incident response or law enforcement reporting.
          </p>
        </div>
      </div>
    </footer>
  );
};
