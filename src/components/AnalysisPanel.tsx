import React, { useState, useRef } from 'react';
import { 
  Globe, 
  QrCode, 
  Image as ImageIcon, 
  ArrowRight, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { SubmissionType } from '../types/analysis';
import { SAMPLE_SUBMISSIONS } from '../data/samples';
import { decodeQrFromImageFile } from '../utils/qrDecoder';

interface AnalysisPanelProps {
  onStartAnalysis: (payload: {
    type: SubmissionType;
    value?: string;
    imageBase64?: string;
    mimeType?: string;
    userNotes?: string;
  }) => void;
  isLoading: boolean;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ onStartAnalysis, isLoading }) => {
  const [activeMode, setActiveMode] = useState<SubmissionType>('url');
  
  // URL state
  const [urlInput, setUrlInput] = useState('');
  
  // QR state
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [decodedQrText, setDecodedQrText] = useState<string | null>(null);
  const [isQrDecoding, setIsQrDecoding] = useState(false);
  const qrInputRef = useRef<HTMLInputElement>(null);

  // Screenshot state
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotNotes, setScreenshotNotes] = useState('');
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  // Handle QR file selection
  const handleQrFile = async (file: File) => {
    setQrFile(file);
    setIsQrDecoding(true);
    setDecodedQrText(null);

    const reader = new FileReader();
    reader.onload = (e) => setQrPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    const result = await decodeQrFromImageFile(file);
    setIsQrDecoding(false);
    if (result.success && result.data) {
      setDecodedQrText(result.data);
    }
  };

  // Handle Screenshot file selection
  const handleScreenshotFile = (file: File) => {
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setScreenshotPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (activeMode === 'url') {
      if (!urlInput.trim()) return;
      onStartAnalysis({ type: 'url', value: urlInput.trim() });
    } else if (activeMode === 'qr') {
      if (!qrFile && !decodedQrText) return;
      onStartAnalysis({
        type: 'qr',
        value: decodedQrText || undefined,
        imageBase64: qrPreview || undefined,
        mimeType: qrFile?.type || 'image/png'
      });
    } else if (activeMode === 'screenshot') {
      if (!screenshotPreview) return;
      onStartAnalysis({
        type: 'screenshot',
        imageBase64: screenshotPreview,
        mimeType: screenshotFile?.type || 'image/jpeg',
        userNotes: screenshotNotes.trim() || undefined
      });
    }
  };

  // Select Sample
  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_SUBMISSIONS.find(s => s.id === sampleId);
    if (!sample) return;

    setActiveMode(sample.type);
    if (sample.type === 'url') {
      setUrlInput(sample.value);
    }
  };

  return (
    <div id="analysis-panel" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-950/60 transition-all">
      
      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-950/70 border border-slate-800/80 rounded-xl mb-6 max-w-md">
        <button
          type="button"
          onClick={() => setActiveMode('url')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
            activeMode === 'url'
              ? 'bg-slate-800 text-teal-400 shadow-sm border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Website URL</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('qr')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
            activeMode === 'qr'
              ? 'bg-slate-800 text-teal-400 shadow-sm border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>QR Code</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('screenshot')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
            activeMode === 'screenshot'
              ? 'bg-slate-800 text-teal-400 shadow-sm border border-slate-700/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Screenshot</span>
        </button>
      </div>

      {/* Main Interactive Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* URL Input Mode */}
        {activeMode === 'url' && (
          <div className="space-y-3">
            <label htmlFor="url-input" className="block text-xs font-medium text-slate-300">
              Paste suspicious link or website address:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Globe className="w-5 h-5" />
              </div>
              <input
                id="url-input"
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="e.g. https://paypal-security-update-account.top/login"
                className="w-full pl-11 pr-4 py-3.5 bg-slate-950/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 font-mono transition-colors"
                autoComplete="off"
                spellCheck="false"
              />
              {urlInput && (
                <button
                  type="button"
                  onClick={() => setUrlInput('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* QR Code Input Mode */}
        {activeMode === 'qr' && (
          <div className="space-y-4">
            <input
              ref={qrInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleQrFile(file);
              }}
            />

            {!qrPreview ? (
              <div
                onClick={() => qrInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('image/')) handleQrFile(file);
                }}
                className="border-2 border-dashed border-slate-700 hover:border-teal-400/80 bg-slate-950/50 rounded-xl p-8 text-center cursor-pointer transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-800/80 group-hover:bg-teal-500/10 text-slate-400 group-hover:text-teal-400 mx-auto flex items-center justify-center transition-colors mb-3">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-slate-200">
                  Drop a QR code image here or <span className="text-teal-400 underline underline-offset-2">browse files</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PNG, JPEG, WEBP or phone photos of parking meters, receipts, or screens
                </p>
              </div>
            ) : (
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-black shrink-0 border border-slate-800 flex items-center justify-center">
                  <img
                    src={qrPreview}
                    alt="Uploaded QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-slate-300">Target Payload:</span>
                    {isQrDecoding ? (
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Loader2 className="w-3 h-3 animate-spin" /> Decoding barcode...
                      </span>
                    ) : decodedQrText ? (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Decoded
                      </span>
                    ) : (
                      <span className="text-xs text-amber-400 flex items-center gap-1 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" /> Optical scan pending AI scrutiny
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-slate-400 break-all line-clamp-2 bg-slate-900/90 p-2 rounded border border-slate-800">
                    {decodedQrText || 'Visual QR analysis will extract instructions during analysis.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setQrFile(null);
                    setQrPreview(null);
                    setDecodedQrText(null);
                  }}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900 rounded-lg transition-colors shrink-0"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        )}

        {/* Screenshot Input Mode */}
        {activeMode === 'screenshot' && (
          <div className="space-y-4">
            <input
              ref={screenshotInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleScreenshotFile(file);
              }}
            />

            {!screenshotPreview ? (
              <div
                onClick={() => screenshotInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('image/')) handleScreenshotFile(file);
                }}
                className="border-2 border-dashed border-slate-700 hover:border-teal-400/80 bg-slate-950/50 rounded-xl p-8 text-center cursor-pointer transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-800/80 group-hover:bg-teal-500/10 text-slate-400 group-hover:text-teal-400 mx-auto flex items-center justify-center transition-colors mb-3">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-slate-200">
                  Drop screenshot here or <span className="text-teal-400 underline underline-offset-2">browse image</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Upload an SMS text, WhatsApp chat, suspicious email header, or payment demand
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-black shrink-0 border border-slate-800">
                    <img
                      src={screenshotPreview}
                      alt="Uploaded Screenshot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-slate-200 truncate">
                      {screenshotFile?.name || 'Screenshot image ready for inspection'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Visual OCR and sentiment threat analysis will examine brand marks and urgency triggers.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setScreenshotFile(null);
                      setScreenshotPreview(null);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-900 rounded-lg transition-colors shrink-0"
                  >
                    Remove
                  </button>
                </div>

                <div>
                  <label htmlFor="screenshot-notes" className="block text-xs font-medium text-slate-400 mb-1">
                    Optional context (e.g. "Received via SMS claiming to be Chase Bank"):
                  </label>
                  <input
                    id="screenshot-notes"
                    type="text"
                    value={screenshotNotes}
                    onChange={(e) => setScreenshotNotes(e.target.value)}
                    placeholder="Provide any details about how you received this..."
                    className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-400"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button & Privacy Note */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span>Privacy notice: Avoid uploading sensitive personal credentials, passwords, or banking PINs.</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={
              isLoading || 
              (activeMode === 'url' && !urlInput.trim()) ||
              (activeMode === 'qr' && !qrPreview && !decodedQrText) ||
              (activeMode === 'screenshot' && !screenshotPreview)
            }
            className="w-full sm:w-auto px-6 py-3 bg-teal-400 hover:bg-teal-300 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-slate-950 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/10 active:scale-95 whitespace-nowrap cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Running Security Checks...</span>
              </>
            ) : (
              <>
                <span>Analyze Content</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Test Samples Bar */}
      <div className="mt-8 pt-6 border-t border-slate-800/80 text-left">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400">
            Or test with real-world scenarios:
          </span>
          <span className="text-xs text-slate-500">
            Click to load & analyze
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SAMPLE_SUBMISSIONS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample.id)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-teal-300 hover:border-slate-700 transition-all text-left flex items-center gap-2 group cursor-pointer"
              title={sample.previewNote}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${
                sample.expectedRisk === 'high_risk' 
                  ? 'bg-rose-500' 
                  : sample.expectedRisk === 'suspicious' 
                  ? 'bg-amber-500' 
                  : 'bg-emerald-500'
              }`} />
              <span className="font-medium">{sample.title}</span>
              <span className="text-slate-500 text-[11px] hidden sm:inline">({sample.category})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
