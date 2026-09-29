import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  Copy, 
  Check, 
  Printer, 
  ArrowLeft, 
  Clock, 
  Lock, 
  Info,
  ChevronDown,
  ChevronUp,
  Globe,
  Server,
  ArrowRight,
  Database,
  FileCode,
  Shield,
  Layers,
  AlertOctagon,
  CheckCircle2,
  XCircle,
  HelpCircle as QuestionIcon
} from 'lucide-react';
import { AnalysisResult, ConfidenceLevel, RiskLevel } from '../types/analysis';

interface AnalysisResultsViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const AnalysisResultsView: React.FC<AnalysisResultsViewProps> = ({ result, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [expandedFindings, setExpandedFindings] = useState<Record<string, boolean>>({});

  const toggleFinding = (id: string) => {
    setExpandedFindings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyLink = () => {
    if (!result.submittedValue) return;
    navigator.clipboard.writeText(result.submittedValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Risk styling configuration
  const getRiskConfig = (risk: RiskLevel) => {
    switch (risk) {
      case 'high_risk':
        return {
          title: 'High Risk',
          subtitle: 'Concrete evidence identifies deceptive impersonation, credential harvesting, or intentional address obfuscation.',
          badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          accentColor: 'text-rose-400',
          gaugeColor: 'bg-rose-500',
          icon: ShieldAlert,
          cardBorder: 'border-rose-900/50'
        };
      case 'suspicious':
        return {
          title: 'Suspicious',
          subtitle: 'Multiple cautionary signals detected that warrant heightened caution. Unfamiliar TLDs or failed connections alone do not constitute proof of fraud.',
          badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          accentColor: 'text-amber-400',
          gaugeColor: 'bg-amber-500',
          icon: AlertTriangle,
          cardBorder: 'border-amber-900/50'
        };
      case 'clean':
        return {
          title: 'No Significant Warning Signs Detected',
          subtitle: 'Available checks did not observe known red flags. Note: a clean result is never an absolute guarantee of complete safety.',
          badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          accentColor: 'text-emerald-400',
          gaugeColor: 'bg-emerald-500',
          icon: ShieldCheck,
          cardBorder: 'border-emerald-900/40'
        };
      case 'undetermined':
      default:
        return {
          title: 'Unable to Determine',
          subtitle: 'Insufficient technical data or unresolvable connection to establish a definitive evidence-based verdict.',
          badgeBg: 'bg-slate-500/10 border-slate-500/30 text-slate-400',
          accentColor: 'text-slate-400',
          gaugeColor: 'bg-slate-500',
          icon: HelpCircle,
          cardBorder: 'border-slate-800'
        };
    }
  };

  const getConfidenceBadge = (confidence?: ConfidenceLevel) => {
    switch (confidence) {
      case 'Confirmed':
        return {
          label: 'Confirmed Evidence',
          bg: 'bg-teal-950/80 border-teal-800 text-teal-300'
        };
      case 'Strong Indicator':
        return {
          label: 'Strong Indicator',
          bg: 'bg-sky-950/80 border-sky-800 text-sky-300'
        };
      case 'Possible Indicator':
        return {
          label: 'Possible Indicator',
          bg: 'bg-amber-950/80 border-amber-800 text-amber-300'
        };
      case 'Unverified':
      default:
        return {
          label: 'Unverified / Inconclusive',
          bg: 'bg-slate-900 border-slate-800 text-slate-400'
        };
    }
  };

  const riskCfg = getRiskConfig(result.overallAssessment);
  const RiskIcon = riskCfg.icon;
  const auditConfidence = result.evidenceAudit?.overallConfidence || 'Confirmed';
  const confidenceCfg = getConfidenceBadge(auditConfidence);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fadeIn text-left">
      
      {/* Top Back & Print Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Analyze Another Link, QR, or Screenshot</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Report ID:</span>
            <span className="font-mono text-slate-300">{result.id.slice(0, 16)}</span>
          </div>
          <span aria-hidden="true" className="text-slate-700">|</span>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Primary Verdict & Evidence Confidence Header */}
      <div className={`bg-slate-900/90 border ${riskCfg.cardBorder} rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Verdict Info */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${confidenceCfg.bg}`}>
                {confidenceCfg.label}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {new Date(result.timestamp).toUTCString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl border ${riskCfg.badgeBg} flex items-center justify-center`}>
                <RiskIcon className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                  Overall Assessment
                </span>
                <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${riskCfg.accentColor}`}>
                  {riskCfg.title}
                </h1>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {result.summary || riskCfg.subtitle}
            </p>

            {result.brandImpersonated && (
              <div className="inline-flex items-center gap-2 text-xs text-rose-300 bg-rose-950/40 border border-rose-900/60 px-3 py-1.5 rounded-lg">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Suspected Brand Target: <strong className="font-semibold text-white">{result.brandImpersonated}</strong></span>
              </div>
            )}
          </div>

          {/* Risk Score Indicator */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 w-full md:w-64 text-center shrink-0">
            <span className="text-xs font-medium text-slate-400 block mb-1">
              Estimated Risk Score
            </span>
            <div className="flex items-baseline justify-center gap-1 font-mono">
              <span className={`text-4xl font-extrabold tabular-nums ${riskCfg.accentColor}`}>
                {result.riskScore}
              </span>
              <span className="text-sm text-slate-500 font-normal">/ 100</span>
            </div>

            {/* Score Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div 
                className={`h-full ${riskCfg.gaugeColor} transition-all duration-700`}
                style={{ width: `${result.riskScore}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400 mt-2 leading-tight">
              {result.scoreExplanation}
            </p>
          </div>
        </div>

        {/* Target Details Safe Box */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <span className="text-xs text-slate-400 font-semibold block mb-1">
              Submitted Target ({result.submissionType.toUpperCase()}):
            </span>
            <p className="text-xs sm:text-sm font-mono text-slate-200 break-all select-all bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
              {result.submittedValue}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Copy submitted text to clipboard safely without opening"
            >
              {copied ? <Check className="w-4 h-4 text-teal-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Safely'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Audit: What Was Found vs What Remains Unknown */}
      {result.evidenceAudit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* What Was Found */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-teal-400">
              <CheckCircle2 className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                What Was Confirmed / Observed
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {result.evidenceAudit.whatWasFound.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Remains Unknown */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <HelpCircle className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                What Remains Unknown / Gaps
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {result.evidenceAudit.whatRemainsUnknown.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}

      {/* 6 Comprehensive Evidence Sections */}
      <div className="space-y-6">
        <div className="border-b border-slate-800 pb-2">
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Detailed Evidence & Technical Breakdown
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Structured forensic documentation across protocol, server reachability, and threat databases
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Section 1: URL Format & Destination */}
          {result.urlFormat && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-bold text-white">1. URL Format & Destination</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400 uppercase">RFC 3986</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800 text-slate-300 space-y-1">
                  <div><span className="text-slate-500">Protocol:</span> {result.urlFormat.protocol.toUpperCase()}</div>
                  <div><span className="text-slate-500">Hostname:</span> {result.urlFormat.hostname}</div>
                  <div><span className="text-slate-500">Port:</span> {result.urlFormat.port}</div>
                  <div><span className="text-slate-500">Path:</span> {result.urlFormat.path}</div>
                  {Object.keys(result.urlFormat.queryParameters).length > 0 && (
                    <div>
                      <span className="text-slate-500">Query Parameters:</span>
                      <pre className="text-[11px] text-teal-300 mt-0.5">
                        {JSON.stringify(result.urlFormat.queryParameters, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  {result.urlFormat.formatNotes}
                </p>
              </div>
            </div>
          )}

          {/* Section 2: Domain and Registration Information */}
          {result.domainRegistration && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-white">2. Domain & Registration Info</h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  {result.domainRegistration.status === 'available' ? 'Available' : 'Unavailable'}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800 text-slate-300 space-y-1">
                  <div><span className="text-slate-500">Domain:</span> {result.domainRegistration.domain}</div>
                  <div><span className="text-slate-500">Top-Level Domain (TLD):</span> {result.domainRegistration.registeredTld}</div>
                  <div><span className="text-slate-500">Registrar:</span> {result.domainRegistration.registrar}</div>
                  <div><span className="text-slate-500">Registration Date:</span> {result.domainRegistration.registrationDate}</div>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  {result.domainRegistration.notes}
                </p>
              </div>
            </div>
          )}

          {/* Section 3: Reachability and HTTP Response Details */}
          {result.reachability && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">3. Reachability & HTTP Response</h3>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  result.reachability.inspectionSuccessful
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                }`}>
                  {result.reachability.inspectionSuccessful ? 'Checked' : 'Unsuccessful'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {result.reachability.inspectionSuccessful ? (
                  <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800 text-slate-300 font-mono space-y-1">
                    <div><span className="text-slate-500">HTTP Status:</span> {result.reachability.httpStatusCode} {result.reachability.httpStatusText}</div>
                    <div><span className="text-slate-500">Response Latency:</span> {result.reachability.responseTimeMs} ms</div>
                    <div><span className="text-slate-500">Content-Type:</span> {result.reachability.contentType || 'Not disclosed'}</div>
                    <div><span className="text-slate-500">Server Header:</span> {result.reachability.serverHeader || 'Not disclosed'}</div>
                  </div>
                ) : (
                  <div className="bg-amber-950/20 border border-amber-900/40 p-3 rounded-lg text-amber-200/90 space-y-1">
                    <span className="font-semibold block text-amber-300">Reachability Inspection Unsuccessful</span>
                    <p className="text-[11px] leading-relaxed">
                      {result.reachability.failureReason || 'Target server could not be reached. The cause is unknown unless independently verified (server may be offline, firewalled, or rejecting requests).'}
                    </p>
                  </div>
                )}
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Reachability tests are performed via non-executing, sandboxed HTTP probes. A failed page connection is not proof of fraud by itself.
                </p>
              </div>
            </div>
          )}

          {/* Section 4: Redirects and Final Destination */}
          {result.redirects && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                  <h3 className="text-sm font-bold text-white">4. Redirects & Destination</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {result.redirects.redirectCount} Hop(s)
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800 space-y-2 font-mono">
                  {result.redirects.redirectChain.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300 break-all text-[11px]">
                      <span className="text-slate-500 shrink-0">#{idx + 1}:</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {result.redirects.notes}
                </p>
              </div>
            </div>
          )}

          {/* Section 5: Threat-Intelligence Findings */}
          {result.threatIntelligence && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">5. Threat Intelligence</h3>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  result.threatIntelligence.status === 'flagged'
                    ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {result.threatIntelligence.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800 space-y-1 font-mono text-slate-300 text-[11px]">
                  <div><span className="text-slate-500">Heuristic Feeds:</span> {result.threatIntelligence.sourcesChecked.join(', ')}</div>
                  {result.threatIntelligence.matchedThreatFeeds.length > 0 && (
                    <div className="text-rose-400 font-semibold">
                      <span>Matched Signatures:</span> {result.threatIntelligence.matchedThreatFeeds.join(', ')}
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {result.threatIntelligence.notes}
                </p>
              </div>
            </div>
          )}

          {/* Section 6: Page-Content Inspection Results */}
          {result.pageContent && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">6. Page-Content Inspection</h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  {result.pageContent.status === 'inspected' ? 'Inspected' : 'Unsuccessful'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {result.pageContent.status === 'inspected' ? (
                  <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800 space-y-1 text-slate-300 text-[11px]">
                    <div><span className="text-slate-500">Page Title:</span> {result.pageContent.pageTitle || 'None specified'}</div>
                    <div><span className="text-slate-500">Login Forms:</span> {result.pageContent.hasLoginForm ? 'Detected (<form>)' : 'Not detected'}</div>
                    <div><span className="text-slate-500">Password Fields:</span> {result.pageContent.hasPasswordField ? 'Detected (<input type="password">)' : 'Not detected'}</div>
                  </div>
                ) : (
                  <div className="bg-slate-950/80 p-2.5 rounded border border-slate-800 text-slate-400 text-[11px]">
                    Page markup could not be safely inspected because the server could not be reached. Cause is unknown.
                  </div>
                )}
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {result.pageContent.notes}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Section 7: Suspicious Indicators (Findings with All 5 Required Fields) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              7. Suspicious Indicators & Findings
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Each finding documents plain-language explanation, evidence source, confidence level, and why it matters
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {result.findings.length} observed
          </span>
        </div>

        {result.findings.length === 0 ? (
          <div className="p-6 text-center text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No anomalous indicators identified</p>
            <p className="text-xs text-slate-500 mt-1">Standard structural and heuristic checks returned nominal baseline indicators.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {result.findings.map((finding) => {
              const isExpanded = expandedFindings[finding.id] ?? true;
              const conf = getConfidenceBadge(finding.confidenceLevel);
              return (
                <div
                  key={finding.id}
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFinding(finding.id)}
                    className="w-full p-4 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${
                        finding.severity === 'high'
                          ? 'bg-rose-500'
                          : finding.severity === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-teal-500'
                      }`} />
                      <span className="text-sm font-semibold text-slate-100">
                        {finding.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${conf.bg}`}>
                        {finding.confidenceLevel}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      
                      {/* Plain Language Explanation */}
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-400 block">Explanation in Plain Language:</span>
                        <p className="text-slate-300 leading-relaxed">{finding.plainExplanation}</p>
                      </div>

                      {/* Evidence or Source */}
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-400 block">Evidence or Source:</span>
                        <p className="text-slate-300 font-mono text-[11px] leading-relaxed bg-slate-900/60 p-2 rounded border border-slate-800">
                          {finding.evidenceOrSource}
                        </p>
                      </div>

                      {/* Why It Matters */}
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-400 block">Why It Matters:</span>
                        <p className="text-slate-300 leading-relaxed">{finding.whyItMatters}</p>
                      </div>

                      {/* Limitations & Caveats */}
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-400 block">Limitations & Context:</span>
                        <p className="text-slate-400 leading-relaxed italic">
                          {finding.limitation || 'No additional limitations documented for this metric.'}
                        </p>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 8: Evidence Confidence Audit */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">
            8. Evidence Confidence
          </h2>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${confidenceCfg.bg}`}>
            Overall: {auditConfidence}
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {result.evidenceAudit?.confidenceJustification || 'Confidence is determined by the convergence of observable technical attributes, network reachability probes, and verified threat pattern matches.'}
        </p>
      </div>

      {/* Section 9: Recommended Next Steps */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              9. Recommended Next Steps
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Prioritized, practical safety measures tailored to the observed evidence
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {result.recommendedActions.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                item.priority === 'immediate'
                  ? 'bg-rose-950/20 border-rose-900/40 text-slate-200'
                  : item.priority === 'important'
                  ? 'bg-amber-950/20 border-amber-900/40 text-slate-200'
                  : 'bg-slate-950/50 border-slate-800 text-slate-300'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {item.priority === 'immediate' ? (
                  <XCircle className="w-4 h-4 text-rose-400" />
                ) : item.priority === 'important' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider ${
                    item.priority === 'immediate' ? 'text-rose-400' : (item.priority === 'important' ? 'text-amber-400' : 'text-teal-400')
                  }`}>
                    {item.priority}
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {item.action}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verification Matrix & Completed Checks */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Inspection Details & Completed Checks
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Status across syntactic parsing, brand lookalikes, reachability, and protocol safety
            </p>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
          {result.checksPerformed.map((check, idx) => (
            <div key={idx} className="p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-200">{check.name}</span>
                <p className="text-slate-400">{check.description}</p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className="text-slate-400 font-mono text-[11px] max-w-[200px] truncate text-right">
                  {check.notes}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                  check.status === 'passed'
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/50'
                    : check.status === 'warning'
                    ? 'bg-amber-950/60 text-amber-400 border border-amber-900/50'
                    : check.status === 'flagged'
                    ? 'bg-rose-950/60 text-rose-400 border border-rose-900/50'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {check.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Limitations Notice */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 text-xs text-slate-400 space-y-1">
          <span className="font-semibold text-slate-300">Evidence Integrity Policy:</span>
          <p className="leading-relaxed">
            {result.limitationsNote}
          </p>
        </div>
      </div>

    </div>
  );
};
