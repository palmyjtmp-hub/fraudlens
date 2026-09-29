import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Globe, 
  QrCode, 
  Image as ImageIcon, 
  ArrowRight, 
  AlertTriangle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Lock, 
  Eye, 
  FileText,
  Sparkles,
  Zap
} from 'lucide-react';
import { AnalysisPanel } from './AnalysisPanel';
import { SubmissionType } from '../types/analysis';

interface HomeViewProps {
  onStartAnalysis: (payload: {
    type: SubmissionType;
    value?: string;
    imageBase64?: string;
    mimeType?: string;
    userNotes?: string;
  }) => void;
  isLoading: boolean;
  onNavigateToHowItWorks: () => void;
  onNavigateToSafetyCentre: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartAnalysis,
  isLoading,
  onNavigateToHowItWorks,
  onNavigateToSafetyCentre
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(prev => prev === index ? null : index);
  };

  const warningSigns = [
    {
      title: 'Brand Impersonation & Typosquatting',
      description: 'Addresses that look authentic at a quick glance (e.g., paypa1.com, netflix-billing-verify.top, apple-security-portal.info) designed to harvest your passwords.',
      category: 'Domain Deception'
    },
    {
      title: 'Artificial Urgency & Fear Tactics',
      description: 'Threats claiming your account will be deleted within 24 hours, or fake delivery fees requiring immediate credit card settlement.',
      category: 'Psychological Manipulation'
    },
    {
      title: 'Direct Password or OTP Demands',
      description: 'Websites or incoming callers asking you to share one-time authentication codes sent to your phone. Legitimate institutions never ask for these.',
      category: 'Credential Harvesting'
    },
    {
      title: 'Concealed QR Code Destinations',
      description: 'Physical stickers placed over parking meter codes, restaurant menus, or email attachments leading to unfamiliar domains or direct app installations.',
      category: 'Physical & Optical Quishing'
    }
  ];

  const faqs = [
    {
      q: 'Does FraudLens guarantee that a clean website is 100% safe?',
      a: 'No. FraudLens evaluates observable structural signals, known brand lookalikes, TLD reputations, and contextual red flags. A clean assessment means no significant warning signs were detected by available checks. However, brand new scam campaigns or compromised legitimate accounts may not yet be flagged in global threat registries.'
    },
    {
      q: 'Is it dangerous to analyze a suspicious link on FraudLens?',
      a: 'No. FraudLens does not open or execute links in your web browser. Content is parsed and analyzed in a sandboxed, isolated server environment. Your browser is never directed to the suspicious destination.'
    },
    {
      q: 'Can I upload a screenshot of an SMS text message or WhatsApp chat?',
      a: 'Yes. FraudLens uses multimodal vision AI to examine screenshots for fake sender headers, deceptive brand logos, emotional urgency, and payment requests. Please ensure you do not include private credentials or payment cards in your screenshot.'
    },
    {
      q: 'Why does FraudLens avoid relying only on a single risk score?',
      a: 'Scam detection is contextual. Merely seeing "72/100" doesn\'t help you understand what was wrong. FraudLens provides plain-language explanations of exactly what was detected, why it matters, and concrete actions to keep you safe.'
    },
    {
      q: 'What should I do if FraudLens marks a link as High Risk?',
      a: 'Do not click the link, do not enter any credentials, and do not make payments. If you already submitted information before checking, immediately navigate to the authentic website directly from a separate browser tab to reset your passwords and notify your bank.'
    }
  ];

  return (
    <div className="space-y-24 animate-fadeIn pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-16 pb-6 overflow-hidden">
        
        {/* Subtle Background Radial */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Mission Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>Global Digital Trust & Scam Detection Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              See Beyond the Scam.
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Check suspicious links, QR codes, and screenshots. Understand potential risks before you click, share, or pay.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => {
                  const el = document.getElementById('analysis-panel');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-teal-500/10 cursor-pointer active:scale-95"
              >
                Analyze Now
              </button>
              <button
                onClick={onNavigateToHowItWorks}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
              >
                Learn How It Works
              </button>
            </div>
          </div>

          {/* Core Interactive Analysis Panel */}
          <div className="mt-12 max-w-4xl mx-auto">
            <AnalysisPanel onStartAnalysis={onStartAnalysis} isLoading={isLoading} />
          </div>

        </div>
      </section>

      {/* Editorial Visual Feature Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center shadow-2xl shadow-slate-950/80">
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-5">
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-400">
              Clear Security Forensics
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              Not just an arbitrary score. We explain the evidence.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              When internet fraud occurs, victims are often left wondering what happened. FraudLens disassembles deceptive domain patterns, unmasks hidden URL shorteners, and inspects SMS urgency markers—presenting clear facts so you understand the risk.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <span>Identifies brand lookalike trickery</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <span>Screens for fake parcel & invoice scams</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <span>Decodes optical QR codes safely</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
                <span>Provides step-by-step safety actions</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 h-full min-h-[300px] relative bg-slate-950 flex items-center justify-center p-6 border-t lg:border-t-0 lg:border-l border-slate-800">
            <img
              src="/src/assets/images/fraudlens_hero_threat_scan_1790683928768.jpg"
              alt="FraudLens Forensic Scan Inspection"
              className="w-full h-full max-h-[360px] object-cover rounded-2xl shadow-xl border border-slate-800"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </section>

      {/* What FraudLens Can Analyze Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-wider font-semibold text-teal-400">
            Comprehensive Input Support
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            What Can You Check on FraudLens?
          </h2>
          <p className="text-sm text-slate-300">
            Submit suspicious materials across the three most prevalent modern digital fraud vectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-2xl space-y-4 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Website URLs & Links</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste suspicious links sent via email, text, or social media. We verify domain structure, lookalike characters, SSL transport encryption, and high-risk domain extensions.
            </p>
            <div className="text-xs text-teal-400/90 font-medium pt-2">
              ✓ Unmasks URL shorteners & deceptive redirects
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-2xl space-y-4 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">QR Codes (Quishing)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload photos of QR codes found on parking meters, restaurant tables, flyers, or email attachments. We decode the target safely without executing actions on your phone.
            </p>
            <div className="text-xs text-teal-400/90 font-medium pt-2">
              ✓ Prevents accidental phone redirect traps
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-2xl space-y-4 hover:border-slate-700 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Screenshots</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload screenshots of threatening messages, fake banking alerts, unexpected invoices, or social media ads. Visual AI inspects brand logos and coercive urgency triggers.
            </p>
            <div className="text-xs text-teal-400/90 font-medium pt-2">
              ✓ Detects visual brand forgery & extortion
            </div>
          </div>

        </div>
      </section>

      {/* Examples of Common Warning Signs */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-400">
              Pattern Recognition
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Common Red Flags We Look For
            </h2>
          </div>
          <button
            onClick={onNavigateToSafetyCentre}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <span>Explore All 9 Safety Guides</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {warningSigns.map((sign, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-2 text-left"
            >
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-amber-400 font-semibold">{sign.category}</span>
                <span aria-hidden="true">·</span>
                <span>Warning Indicator</span>
              </div>
              <h3 className="text-base font-bold text-white">
                {sign.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {sign.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Scam Detection Matters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-teal-400">
              Why Scam Detection Matters
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Anti-Virus Protects Against Bugs. FraudLens Protects Against Human Deception.
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Traditional anti-virus programs look for malicious executable code and software vulnerabilities. But over 90% of successful cyberattacks do not use malware at all—they convince people to voluntarily type their credentials or authorize instant money transfers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
            <div className="space-y-1">
              <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                $1.03T+
              </span>
              <p className="text-xs text-slate-400">
                Global consumer losses to scams and online financial fraud in 2024–2025 alone.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                83%
              </span>
              <p className="text-xs text-slate-400">
                Of phishing websites now feature HTTPS padlocks, rendering basic browser warnings ineffective.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-3xl font-extrabold text-white font-mono tabular-nums">
                &lt; 5 mins
              </span>
              <p className="text-xs text-slate-400">
                Average time it takes for stolen credentials to be tested against automated account takeover tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-teal-400">
            Questions & Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <span className="text-sm font-bold text-white">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-teal-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
