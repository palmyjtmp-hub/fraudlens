import React from 'react';
import { Shield, Target, Users, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AboutViewProps {
  onStartAnalysis: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onStartAnalysis }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-teal-400">
          About FraudLens
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Democratizing Digital Trust & Scam Prevention
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          FraudLens is an independent digital trust and cybersecurity awareness platform designed to help everyday internet users see through digital deception before clicking, sharing, or paying.
        </p>
      </div>

      {/* Hero Image / Trust Operations */}
      <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl relative aspect-16/9 max-h-[420px]">
        <img
          src="/src/assets/images/fraudlens_trust_center_1790683950383.jpg"
          alt="FraudLens Trust & Research Center"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-6 sm:p-10">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              The FraudLens Mission
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Bridging the gap between complex cyber threat intelligence and everyday human intuition.
            </h2>
          </div>
        </div>
      </div>

      {/* The Problem We Are Solving */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
            The Reality
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Scams Target Psychology, Not Software Flaws
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Modern internet scams rarely rely on sophisticated zero-day exploits. Instead, they weaponize psychological pressure: fake parcel tracking notifications, sudden account restriction alerts, lookalike web addresses, and counterfeit QR codes.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            While enterprise corporations have dedicated Security Operations Centers (SOCs) and threat hunting teams, the average smartphone user, student, or grandparent receives these attacks with zero independent verification tools.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Who FraudLens Is Built For
          </span>
          <div className="space-y-3 text-xs sm:text-sm text-slate-300">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
              <span><strong>Everyday Smartphone & Internet Users:</strong> Anyone who receives an unexpected SMS text or email with a link they are unsure about.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
              <span><strong>Online Shoppers:</strong> Consumers verifying deals, discount retail websites, and social media seller ads before entering payment cards.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
              <span><strong>Small Businesses & Freelancers:</strong> Teams receiving suspicious invoice links, vendor payment alteration requests, or job offers.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
              <span><strong>Families & Caregivers:</strong> Helping non-technical parents and relatives verify requests without falling for impersonation.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Limitations & Ethical Boundaries */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-amber-400">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-base font-bold tracking-tight">
            Important Platform Limitations & Legal Notice
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          FraudLens is designed as an educational and preventive screening tool. It does not replace professional incident response teams, official law enforcement investigations, or enterprise endpoint detection.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-400">
          <li className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            • FraudLens does not conduct offensive hacking, penetration testing, or server intrusion against third-party destinations.
          </li>
          <li className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            • A clean assessment means no known red flags were observed; it is not a warranty or guarantee of absolute safety.
          </li>
          <li className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            • If you have suffered financial loss or identity theft, report it immediately to your financial institution and local police fraud bureau.
          </li>
          <li className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            • AI-assisted analysis provides contextual reasoning, not legally binding determinations of malice.
          </li>
        </ul>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-2">
        <button
          onClick={onStartAnalysis}
          className="px-8 py-3.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-teal-500/10 inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Scan a Suspicious Link Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
