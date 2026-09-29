import React from 'react';
import { ShieldCheck, EyeOff, Lock, Server, Trash2, AlertCircle } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn text-left">
      
      {/* Header */}
      <div className="space-y-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-teal-400">
          Privacy Policy & Data Handling
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          How FraudLens Handles Your Information
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          FraudLens is built on a defensive, privacy-first architecture. This document explains exactly what occurs when you submit a link, QR code, or screenshot for security inspection.
        </p>
      </div>

      {/* Core Principles Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl space-y-2">
          <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Transient Memory Processing</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Submitted URLs, QR optical barcodes, and screenshots are processed in transient server memory solely to evaluate security threat indicators. We do not maintain persistent public archives or sell browsing telemetry.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-2xl space-y-2">
          <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Zero Credential Collection</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            FraudLens will never ask you to register passwords, banking PINs, payment cards, or national identity numbers. If an uploaded screenshot contains visible private credentials, avoid submitting or redact them first.
          </p>
        </div>

      </div>

      {/* Detailed Disclosures */}
      <div className="space-y-8 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 text-xs sm:text-sm text-slate-300 leading-relaxed divide-y divide-slate-800">
        
        {/* Section 1 */}
        <div className="space-y-2 pb-6">
          <h3 className="text-base font-bold text-white">1. Information You Submit</h3>
          <p>
            When utilizing FraudLens, you may submit:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400 text-xs">
            <li><strong>Website URLs and links:</strong> The text string representing the target web address.</li>
            <li><strong>QR code images:</strong> Image files containing 2D matrix optical codes.</li>
            <li><strong>Screenshots:</strong> Image files capturing suspicious emails, SMS messages, or website interfaces.</li>
            <li><strong>User notes:</strong> Optional brief context you provide regarding how or where you encountered the suspicious content.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-2 py-6">
          <h3 className="text-base font-bold text-white">2. Third-Party AI & Threat Services</h3>
          <p>
            To provide deep, plain-language contextual threat analysis and multimodal visual OCR, FraudLens transmits submitted content to the server-side Google Gemini API (`gemini-3.8-flash`) via encrypted HTTPS channels.
          </p>
          <p className="text-slate-400 text-xs">
            API keys and internal inspection parameters remain securely isolated on our server proxy and are never exposed to browser clients. Content transmitted to the model is governed by standard enterprise API privacy protections and is not utilized for public model training.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-2 py-6">
          <h3 className="text-base font-bold text-white">3. Data Retention & Storage Policy</h3>
          <p>
            In the current version of FraudLens:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400 text-xs">
            <li>We do not create persistent user profiles or require email account sign-ups.</li>
            <li>Uploaded screenshot images and decoded payloads are discarded after the analysis response is delivered to your active browser session.</li>
            <li>If you refresh or close your browser tab, your analysis session is cleared from your local client state.</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="space-y-2 py-6">
          <h3 className="text-base font-bold text-white">4. User Responsibility & Redaction Advice</h3>
          <div className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-xl space-y-1 text-amber-200/90 text-xs">
            <span className="font-bold flex items-center gap-1.5 text-amber-300">
              <AlertCircle className="w-4 h-4" />
              Before uploading screenshots:
            </span>
            <p>
              Please crop out or blackout private personal data such as your residential street address, phone number, personal account balances, or identity card numbers. FraudLens only requires the suspicious message text, sender details, and visual brand elements.
            </p>
          </div>
        </div>

        {/* Section 5 */}
        <div className="space-y-2 pt-6">
          <h3 className="text-base font-bold text-white">5. Contact & Privacy Requests</h3>
          <p>
            For privacy inquiries, security feedback, or responsible vulnerability disclosure, please contact the FraudLens trust team at <span className="font-mono text-teal-400">trust@fraudlens.org</span>.
          </p>
        </div>

      </div>

    </div>
  );
};
