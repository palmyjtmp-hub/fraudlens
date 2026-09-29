export type SubmissionType = 'url' | 'qr' | 'screenshot';

export type RiskLevel = 
  | 'high_risk' 
  | 'suspicious' 
  | 'clean' 
  | 'undetermined';

export type ConfidenceLevel = 
  | 'Confirmed' 
  | 'Strong Indicator' 
  | 'Possible Indicator' 
  | 'Unverified';

export interface EvidenceBasedFinding {
  id: string;
  title: string;
  plainExplanation: string; // Explanation in plain language
  evidenceOrSource: string; // Evidence or source
  confidenceLevel: ConfidenceLevel; // Confirmed, Strong Indicator, Possible Indicator, Unverified
  whyItMatters: string; // Why it matters
  severity: 'high' | 'medium' | 'low' | 'neutral';
  limitation?: string;
}

export interface RecommendedAction {
  priority: 'immediate' | 'important' | 'guidance';
  action: string;
  description: string;
}

export interface CheckItem {
  name: string;
  description: string;
  status: 'passed' | 'warning' | 'flagged' | 'inconclusive' | 'not_applicable';
  notes: string;
}

export interface UrlFormatDetails {
  submittedUrl: string;
  canonicalUrl: string;
  protocol: string;
  hostname: string;
  port: string | null;
  path: string;
  queryParameters: Record<string, string>;
  isIpAddress: boolean;
  hasUserinfo: boolean;
  formatNotes: string;
}

export interface DomainRegistrationDetails {
  domain: string;
  registeredTld: string;
  source: string;
  status: 'available' | 'unavailable' | 'unverified';
  registrar: string | null;
  registrationDate: string | null;
  notes: string;
}

export interface ReachabilityDetails {
  status: 'checked' | 'unreachable' | 'timeout' | 'unavailable' | 'not_attempted';
  httpStatusCode: number | null;
  httpStatusText: string | null;
  responseTimeMs: number | null;
  contentType: string | null;
  serverHeader: string | null;
  inspectionSuccessful: boolean;
  failureReason: string | null;
}

export interface RedirectDetails {
  status: 'direct' | 'redirected' | 'inconclusive' | 'unreachable';
  redirectCount: number;
  redirectChain: string[];
  finalDestination: string | null;
  notes: string;
}

export interface ThreatIntelligenceDetails {
  status: 'clean' | 'flagged' | 'unavailable' | 'inconclusive';
  sourcesChecked: string[];
  matchedThreatFeeds: string[];
  notes: string;
}

export interface PageContentDetails {
  status: 'inspected' | 'unsuccessful' | 'not_attempted';
  pageTitle: string | null;
  hasLoginForm: boolean | null;
  hasPasswordField: boolean | null;
  observedElements: string[];
  notes: string;
}

export interface EvidenceAudit {
  overallConfidence: ConfidenceLevel;
  confidenceJustification: string;
  whatWasFound: string[];
  whatRemainsUnknown: string[];
}

export interface AnalysisResult {
  id: string;
  submissionType: SubmissionType;
  submittedValue: string;
  displayTarget?: string;
  thumbnailUrl?: string;
  timestamp: string;
  overallAssessment: RiskLevel;
  riskScore: number; // 0 to 100
  scoreExplanation: string;
  summary: string;
  brandImpersonated?: string | null;

  // Evidence-based report sections
  urlFormat?: UrlFormatDetails;
  domainRegistration?: DomainRegistrationDetails;
  reachability?: ReachabilityDetails;
  redirects?: RedirectDetails;
  threatIntelligence?: ThreatIntelligenceDetails;
  pageContent?: PageContentDetails;
  evidenceAudit?: EvidenceAudit;

  // Findings & Next Steps
  findings: EvidenceBasedFinding[];
  recommendedActions: RecommendedAction[];
  checksPerformed: CheckItem[];
  limitationsNote: string;
}

export interface SampleSubmission {
  id: string;
  title: string;
  category: string;
  type: SubmissionType;
  value: string;
  previewNote: string;
  expectedRisk: RiskLevel;
  sampleDescription: string;
}
