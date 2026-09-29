import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { AnalysisResultsView } from './components/AnalysisResultsView';
import { HowItWorksView } from './components/HowItWorksView';
import { SafetyCentreView } from './components/SafetyCentreView';
import { AboutView } from './components/AboutView';
import { PrivacyView } from './components/PrivacyView';
import { Footer } from './components/Footer';
import { AnalysisResult, SubmissionType } from './types/analysis';
import { analyzeUrl, analyzeQr, analyzeScreenshot } from './services/api';
import { AlertCircle, X, Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'how-it-works' | 'safety-centre' | 'about' | 'privacy'>('home');
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleStartAnalysis = async (payload: {
    type: SubmissionType;
    value?: string;
    imageBase64?: string;
    mimeType?: string;
    userNotes?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      let result: AnalysisResult;

      if (payload.type === 'url') {
        if (!payload.value) throw new Error('A URL address is required.');
        result = await analyzeUrl(payload.value);
      } else if (payload.type === 'qr') {
        result = await analyzeQr({
          decodedText: payload.value,
          imageBase64: payload.imageBase64,
          mimeType: payload.mimeType,
        });
      } else if (payload.type === 'screenshot') {
        if (!payload.imageBase64) throw new Error('Screenshot image data is required.');
        result = await analyzeScreenshot({
          imageBase64: payload.imageBase64,
          mimeType: payload.mimeType,
          userNotes: payload.userNotes,
        });
      } else {
        throw new Error('Unsupported analysis mode.');
      }

      setCurrentResult(result);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during security analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAnalysis = () => {
    setCurrentResult(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTopBarAnalyzeClick = () => {
    setActiveTab('home');
    setCurrentResult(null);
    setTimeout(() => {
      const el = document.getElementById('analysis-panel');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/20 selection:text-teal-300">
      
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // If moving to another tab, preserve result state or clear as appropriate
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAnalyzeClick={handleTopBarAnalyzeClick}
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="bg-rose-950/80 border-b border-rose-900 px-4 py-3 text-xs text-rose-200 flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Global Loading Overlay Banner */}
      {isLoading && (
        <div className="bg-teal-950/70 border-b border-teal-900/60 px-4 py-2.5 text-xs text-teal-300 flex items-center justify-center gap-2.5 max-w-7xl mx-auto w-full">
          <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
          <span>Conducting multidimensional security inspection and AI threat reasoning...</span>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          currentResult ? (
            <AnalysisResultsView
              result={currentResult}
              onReset={handleResetAnalysis}
            />
          ) : (
            <HomeView
              onStartAnalysis={handleStartAnalysis}
              isLoading={isLoading}
              onNavigateToHowItWorks={() => {
                setActiveTab('how-it-works');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToSafetyCentre={() => {
                setActiveTab('safety-centre');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )
        )}

        {activeTab === 'how-it-works' && (
          <HowItWorksView
            onStartAnalysis={() => {
              setActiveTab('home');
              setCurrentResult(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'safety-centre' && (
          <SafetyCentreView />
        )}

        {activeTab === 'about' && (
          <AboutView
            onStartAnalysis={() => {
              setActiveTab('home');
              setCurrentResult(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacyView />
        )}
      </main>

      {/* Global Quiet Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
