import React from 'react';
import { 
  FileSearch, 
  Cpu, 
  ShieldCheck, 
  MessageSquare, 
  ListChecks, 
  AlertOctagon,
  ArrowRight,
  Eye,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface HowItWorksViewProps {
  onStartAnalysis: () => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ onStartAnalysis }) => {
  const steps = [
    {
      step: '01',
      title: 'Submit Content',
      icon: FileSearch,
      description: 'You provide a suspicious link, upload an image containing a QR code, or submit a screenshot of an email, SMS message, or checkout invoice.'
    },
    {
      step: '02',
      title: 'Structural & Visual Extraction',
      icon: Eye,
      description: 'FraudLens parses the address syntax, checks transport encryption, decodes the embedded QR barcode, or extracts visual elements via OCR without executing any code.'
    },
    {
      step: '03',
      title: 'Dual-Layer Security Scrutiny',
      icon: Cpu,
      description: 'The content is examined simultaneously through rule-based heuristic engines (IP hostnames, typosquatting, TLD abuse rates) and server-side AI threat models.'
    },
    {
      step: '04',
      title: 'Plain-Language Translation',
      icon: MessageSquare,
      description: 'Instead of obscure cryptic network codes, findings are translated into clear English explaining what was observed, why it matters, and where uncertainty remains.'
    },
    {
      step: '05',
      title: 'Actionable Protection Steps',
      icon: ListChecks,
      description: 'You receive prioritized, practical guidance on how to safely verify the sender, avoid credential exposure, or recover compromised accounts.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fadeIn">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-teal-400">
          How FraudLens Works
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Demystifying Digital Scam Detection
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          FraudLens breaks down technical deception into plain-language evidence so you can make informed decisions before clicking, typing passwords, or sending payments.
        </p>
      </div>

      {/* Visual Feature Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 items-center">
        <div className="p-8 sm:p-10 space-y-4">
          <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
            Zero-Execution Security
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Safe inspection without exposing your device
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Unlike standard web browsers that automatically download scripts and connect to destination servers, FraudLens treats every submission as potentially hostile. Links are never opened directly in your browser, and uploaded images are scanned in an isolated sandboxed memory container.
          </p>
          <div className="space-y-2 pt-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Protects against drive-by downloads and browser exploit kits</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Never confirms to scammers that an email or SMS was opened</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Safely examines QR codes before your phone camera launches a link</span>
            </div>
          </div>
        </div>

        <div className="relative aspect-4/3 md:aspect-auto h-full min-h-[280px] bg-slate-950 flex items-center justify-center p-6 border-t md:border-t-0 md:border-l border-slate-800">
          <img
            src="/src/assets/images/fraudlens_qr_safety_check_1790683939650.jpg"
            alt="FraudLens QR Safety Inspection"
            className="rounded-xl object-cover w-full h-full max-h-[360px] shadow-lg border border-slate-800"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // Resilient fallback container if image fails to render
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* 5-Step Process Sequence */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            The 5-Phase Analysis Pipeline
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            From initial submission to practical safety recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-900/60 border border-slate-800 p-6 rounded-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-teal-400">
                      {item.step}
                    </span>
                    <Icon className="w-5 h-5 text-slate-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transparent Uncertainty & Limitations Section */}
      <div className="bg-slate-900/40 border border-slate-800/90 rounded-2xl p-8 space-y-4">
        <div className="flex items-center gap-3 text-amber-400">
          <AlertOctagon className="w-5 h-5" />
          <h3 className="text-base font-bold tracking-tight">
            Understanding AI & Heuristic Limitations
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Cybersecurity is an evolving cat-and-mouse game. While FraudLens scans known threat patterns, brand lookalikes, and psychological coercion techniques, no automated technology can guarantee 100% certainty:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs text-slate-400">
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-slate-200 block">Zero-Day Campaigns</span>
            <p>A domain registered 20 minutes ago may not yet appear on public threat feeds. Absence of evidence is not evidence of absence.</p>
          </div>
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-slate-200 block">Cloaking & Geofencing</span>
            <p>Some malicious servers show legitimate dummy pages to automated security scanners while serving scams exclusively to mobile phone IP addresses.</p>
          </div>
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
            <span className="font-semibold text-slate-200 block">Contextual Knowledge</span>
            <p>Only you know whether you actually ordered a package or requested a password reset. When in doubt, always independently verify directly with the company.</p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center pt-4">
        <button
          onClick={onStartAnalysis}
          className="px-8 py-3.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-teal-500/10 inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Try an Analysis Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
