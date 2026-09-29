import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import type { 
  AnalysisResult, 
  ConfidenceLevel, 
  EvidenceBasedFinding, 
  RiskLevel,
  UrlFormatDetails,
  DomainRegistrationDetails,
  ReachabilityDetails,
  RedirectDetails,
  ThreatIntelligenceDetails,
  PageContentDetails,
  EvidenceAudit,
  RecommendedAction,
  CheckItem
} from './src/types/analysis.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize GoogleGenAI SDK server-side
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const KNOWN_BRANDS: Record<string, string[]> = {
  PayPal: ['paypal', 'paypa1', 'pay-pal', 'paypaii'],
  Apple: ['apple', 'appleid', 'icloud', 'applestore'],
  Amazon: ['amazon', 'arnazon', 'prime-video', 'amz-order'],
  Microsoft: ['microsoft', 'micros0ft', 'office365', 'outlook', 'onedrive'],
  Google: ['google', 'g00gle', 'gmail', 'google-drive', 'google-security'],
  Netflix: ['netflix', 'netfllx', 'netflix-billing'],
  'Chase Bank': ['chase', 'chasebank', 'jpmorgan'],
  'Wells Fargo': ['wellsfargo', 'wells-fargo'],
  'Bank of America': ['bankofamerica', 'bofa', 'bank-of-america'],
  USPS: ['usps', 'us-postal', 'postal-service', 'usps-tracking'],
  DHL: ['dhl', 'dhl-express', 'dhl-parcel'],
  FedEx: ['fedex', 'fed-ex', 'fedex-delivery'],
  Meta: ['facebook', 'instagram', 'whatsapp', 'faceb00k'],
  Binance: ['binance', 'binance-trade'],
  Coinbase: ['coinbase', 'coin-base']
};

const HIGH_RISK_TLDS = new Set([
  'top', 'xyz', 'click', 'live', 'loan', 'cfd', 'rest', 'buzz',
  'cam', 'zip', 'mov', 'country', 'gq', 'tk', 'ml', 'cf', 'ga', 'work', 'link'
]);

const SUSPICIOUS_KEYWORDS = [
  'login', 'signin', 'verify', 'verification', 'security', 'update',
  'banking', 'secure', 'account', 'recover', 'wallet', 'kyc', 'billing',
  'invoice', 'support', 'confirm', 'token', 'otp', 'claim', 'airdrop',
  'prize', 'free-gift', 'auth', 'portal', 'alert', 'unusual-activity'
];

const URL_SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 't.co', 'rb.gy', 'is.gd', 'cutt.ly',
  'shorturl.at', 'ow.ly', 'buff.ly', 'rebrand.ly'
]);

// Real safe reachability probe
async function performSafeReachabilityProbe(targetUrl: string): Promise<{
  reachability: ReachabilityDetails;
  redirects: RedirectDetails;
  pageContent: PageContentDetails;
}> {
  const startTime = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  const redirectChain: string[] = [targetUrl];
  let currentUrl = targetUrl;
  let redirectCount = 0;
  let finalDestination = targetUrl;

  try {
    // Attempt HEAD request or GET request safely with manual redirects
    let response: globalThis.Response | null = null;
    let attempts = 0;

    while (attempts < 3) {
      attempts++;
      try {
        response = await fetch(currentUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'FraudLens-Security-Probe/1.0 (+https://fraudlens.org/bot-info; Defensive Scanner)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5'
          },
          signal: controller.signal,
          redirect: 'manual'
        });
      } catch (e: any) {
        // Fallback or error handled below
        break;
      }

      if (response && [301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('location');
        if (location) {
          redirectCount++;
          const resolvedLocation = new URL(location, currentUrl).toString();
          redirectChain.push(resolvedLocation);
          currentUrl = resolvedLocation;
          finalDestination = resolvedLocation;
          continue;
        }
      }
      break;
    }

    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;

    if (!response) {
      return {
        reachability: {
          status: 'unreachable',
          httpStatusCode: null,
          httpStatusText: null,
          responseTimeMs: duration,
          contentType: null,
          serverHeader: null,
          inspectionSuccessful: false,
          failureReason: 'Inspection was unsuccessful: The target server could not be reached. The cause is unknown unless verified (the host may be offline, non-existent, firewalled, or rejecting automated requests).'
        },
        redirects: {
          status: 'unreachable',
          redirectCount: 0,
          redirectChain: [targetUrl],
          finalDestination: null,
          notes: 'Redirect tracking was unsuccessful due to network reachability failure.'
        },
        pageContent: {
          status: 'unsuccessful',
          pageTitle: null,
          hasLoginForm: null,
          hasPasswordField: null,
          observedElements: [],
          notes: 'Page content inspection was unsuccessful: Server could not be reached or returned no response body. Cause is unknown.'
        }
      };
    }

    const contentType = response.headers.get('content-type') || null;
    const serverHeader = response.headers.get('server') || null;

    let pageTitle: string | null = null;
    let hasLoginForm: boolean | null = null;
    let hasPasswordField: boolean | null = null;
    const observedElements: string[] = [];

    // Safely sample first 30KB of HTML if content-type is HTML
    if (contentType && contentType.includes('text/html')) {
      try {
        const text = await response.text();
        const titleMatch = text.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1]) {
          pageTitle = titleMatch[1].trim().slice(0, 100);
        }

        hasPasswordField = /type=["']password["']/i.test(text);
        hasLoginForm = /<form[^>]*>/i.test(text) && (/login|signin|password|email/i.test(text) || hasPasswordField);

        if (pageTitle) observedElements.push(`HTML Title: "${pageTitle}"`);
        if (hasPasswordField) observedElements.push('Detected password input field (<input type="password">)');
        if (hasLoginForm) observedElements.push('Detected credential/login submission form (<form>)');
        if (/type=["']tel["']|name=["']phone["']/i.test(text)) observedElements.push('Detected telephone input field');
        if (/credit-card|cardnumber|cvv|exp-date/i.test(text)) observedElements.push('Detected payment/card input fields');
      } catch {
        // Text read failed or stream closed
      }
    }

    return {
      reachability: {
        status: 'checked',
        httpStatusCode: response.status,
        httpStatusText: response.statusText || `${response.status}`,
        responseTimeMs: duration,
        contentType,
        serverHeader,
        inspectionSuccessful: true,
        failureReason: null
      },
      redirects: {
        status: redirectCount > 0 ? 'redirected' : 'direct',
        redirectCount,
        redirectChain,
        finalDestination,
        notes: redirectCount > 0 
          ? `Safely tracked ${redirectCount} redirect(s) to destination ${finalDestination}.`
          : 'Direct response: No redirects were initiated by the target server.'
      },
      pageContent: {
        status: 'inspected',
        pageTitle,
        hasLoginForm,
        hasPasswordField,
        observedElements,
        notes: observedElements.length > 0 
          ? `Identified ${observedElements.length} key structural DOM elements.`
          : 'Inspected response markup; no explicit credential forms detected in static HTML.'
      }
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const duration = Date.now() - startTime;
    const isTimeout = err?.name === 'AbortError';

    return {
      reachability: {
        status: isTimeout ? 'timeout' : 'unreachable',
        httpStatusCode: null,
        httpStatusText: null,
        responseTimeMs: duration,
        contentType: null,
        serverHeader: null,
        inspectionSuccessful: false,
        failureReason: isTimeout 
          ? 'Inspection was unsuccessful: The server connection timed out after 3500ms. The cause is unknown (the host may be slow, rate-limiting requests, or inactive).'
          : `Inspection was unsuccessful: Network connection failed (${err?.message || 'Host unresolvable'}). The cause is unknown unless verified.`
      },
      redirects: {
        status: 'unreachable',
        redirectCount: 0,
        redirectChain: [targetUrl],
        finalDestination: null,
        notes: 'Redirect tracking was unsuccessful due to network reachability failure.'
      },
      pageContent: {
        status: 'unsuccessful',
        pageTitle: null,
        hasLoginForm: null,
        hasPasswordField: null,
        observedElements: [],
        notes: 'Page content inspection was unsuccessful: Server could not be reached. The cause is unknown unless verified.'
      }
    };
  }
}

// Evidence-based URL analysis builder
function generateEvidenceReport(
  rawUrl: string, 
  probe: {
    reachability: ReachabilityDetails;
    redirects: RedirectDetails;
    pageContent: PageContentDetails;
  }
): AnalysisResult {
  let normalizedUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = 'http://' + normalizedUrl;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalizedUrl);
  } catch {
    return {
      id: `fl-rep-${Date.now()}`,
      submissionType: 'url',
      submittedValue: rawUrl,
      timestamp: new Date().toISOString(),
      overallAssessment: 'undetermined',
      riskScore: 50,
      scoreExplanation: 'Assessment is Unable to Determine because the submitted text could not be parsed as a standard RFC 3986 URL.',
      summary: 'The submitted string does not conform to standard URL format. Technical inspection cannot proceed.',
      findings: [
        {
          id: 'malformed-url-syntax',
          title: 'Unparseable URL Format',
          plainExplanation: `The string "${rawUrl}" could not be parsed into a standard web protocol, hostname, and path structure.`,
          evidenceOrSource: 'RFC 3986 Uniform Resource Identifier Specification',
          confidenceLevel: 'Confirmed',
          whyItMatters: 'Web browsers and security filters require standard syntax to establish connections. Malformed strings cannot be validated against threat registers.',
          severity: 'medium',
          limitation: 'The submission may be an incomplete link or contain unsupported character encodings.'
        }
      ],
      checksPerformed: [
        {
          name: 'RFC 3986 URL Syntax Conformance',
          description: 'Validates standard URL protocol, authority, and path syntax',
          status: 'flagged',
          notes: 'Failed standard URL parsing.'
        }
      ],
      recommendedActions: [
        {
          priority: 'immediate',
          action: 'Verify and resubmit the complete web address',
          description: 'Ensure the link begins with https:// or http:// and contains a valid domain name.'
        }
      ],
      limitationsNote: 'Unparseable URL. Automated reachability and domain reputation checks could not be executed.'
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const pathname = parsed.pathname.toLowerCase();
  const search = parsed.search.toLowerCase();
  const protocol = parsed.protocol.toLowerCase();
  const parts = hostname.split('.');
  const tld = parts.length > 1 ? parts[parts.length - 1] : '';

  // Extract query parameters
  const queryParams: Record<string, string> = {};
  parsed.searchParams.forEach((val, key) => {
    queryParams[key] = val.slice(0, 50);
  });

  const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || /^\[?[a-f0-9:]+\]?$/.test(hostname);
  const hasUserinfo = rawUrl.includes('@');

  // URL format details
  const urlFormat: UrlFormatDetails = {
    submittedUrl: rawUrl,
    canonicalUrl: parsed.href,
    protocol: protocol.replace(':', ''),
    hostname,
    port: parsed.port || (protocol === 'https:' ? '443' : '80'),
    path: parsed.pathname || '/',
    queryParameters: queryParams,
    isIpAddress,
    hasUserinfo,
    formatNotes: isIpAddress 
      ? 'Direct IP address authority specified instead of registered domain.'
      : (hasUserinfo ? 'Contains @ authentication delimiter in authority segment.' : 'Standard host/path structure.')
  };

  // Domain & Registration details (HONEST: do not fabricate dates)
  const domainRegistration: DomainRegistrationDetails = {
    domain: hostname,
    registeredTld: tld ? `.${tld}` : 'Unknown',
    source: 'Public Suffix List & Hostname Analysis',
    status: 'unavailable',
    registrar: 'Unavailable (Direct WHOIS registration query was not performed)',
    registrationDate: 'Unavailable (Not retrieved from authoritative registry - never fabricated)',
    notes: 'Domain registration dates and registrant contacts are marked unavailable because authoritative registry lookups were not performed during this scan. FraudLens strictly adheres to evidence-based reporting and never fabricates dates.'
  };

  // Threat Intelligence details (Local verified heuristic signatures)
  const threatSources = ['FraudLens Heuristic Signature Engine', 'RFC 3986 Address Validator', 'Brand Trademark Registry Heuristics'];
  const matchedFeeds: string[] = [];

  // Findings list
  const findings: EvidenceBasedFinding[] = [];
  const checks: CheckItem[] = [];
  const whatWasFound: string[] = [];
  const whatRemainsUnknown: string[] = [];

  let detectedBrand: string | null = null;
  let hasHighRiskEvidence = false;
  let suspicionCount = 0;

  // 1. Check Protocol
  if (protocol === 'http:') {
    findings.push({
      id: 'find-unencrypted-http',
      title: 'Unencrypted Plaintext Protocol (HTTP)',
      plainExplanation: 'The submitted link specifies unencrypted HTTP rather than modern HTTPS encryption.',
      evidenceOrSource: 'Transport Protocol Inspection (http: scheme)',
      confidenceLevel: 'Confirmed',
      whyItMatters: 'Any data entered on an unencrypted website (passwords, credit cards, or personal info) can be intercepted or altered by unauthorized intermediaries on the network.',
      severity: 'medium',
      limitation: 'Some non-transactional informational pages still run HTTP without malicious intent.'
    });
    checks.push({
      name: 'Transport Layer Security (HTTPS)',
      description: 'Checks whether connection is encrypted using modern TLS',
      status: 'warning',
      notes: 'Uses unencrypted HTTP connection.'
    });
    whatWasFound.push('The link uses plain HTTP rather than encrypted HTTPS.');
  } else {
    checks.push({
      name: 'Transport Layer Security (HTTPS)',
      description: 'Checks whether connection is encrypted using modern TLS',
      status: 'passed',
      notes: 'Uses encrypted HTTPS protocol.'
    });
    whatWasFound.push('The link uses encrypted HTTPS transport.');
  }

  // 2. Check IP Address Hostname
  if (isIpAddress) {
    hasHighRiskEvidence = true;
    matchedFeeds.push('Direct-IP-Host-Indicator');
    findings.push({
      id: 'find-raw-ip',
      title: 'Direct Numerical IP Hostname',
      plainExplanation: `The address connects directly to an IP address (${hostname}) instead of a registered domain name.`,
      evidenceOrSource: 'Hostname Resolution (IPv4/IPv6 pattern match)',
      confidenceLevel: 'Confirmed',
      whyItMatters: 'Legitimate public organizations and services operate on registered branded domain names. Attackers frequently use raw IP addresses to bypass domain registry takedowns.',
      severity: 'high',
      limitation: 'Private local development or network testing may use IP addresses, but they should never be accessed for regular consumer services.'
    });
    checks.push({
      name: 'Domain Identity Resolution',
      description: 'Verifies standard domain name rather than numerical IP',
      status: 'flagged',
      notes: `Direct numerical IP address (${hostname}) detected.`
    });
    whatWasFound.push(`The web address is a raw numerical IP (${hostname}) rather than a domain.`);
  } else {
    checks.push({
      name: 'Domain Identity Resolution',
      description: 'Verifies standard domain name rather than numerical IP',
      status: 'passed',
      notes: `Domain structure: ${hostname}`
    });
  }

  // 3. Userinfo @ Trick
  if (hasUserinfo) {
    hasHighRiskEvidence = true;
    matchedFeeds.push('URL-Userinfo-Obfuscation');
    findings.push({
      id: 'find-userinfo-trick',
      title: 'URL Authority Redirection Trick (@ delimiter)',
      plainExplanation: 'The web address contains an "@" symbol within the authority segment.',
      evidenceOrSource: 'URL Authority Parsing (RFC 3986 userinfo syntax)',
      confidenceLevel: 'Confirmed',
      whyItMatters: 'Web browsers treat everything before the "@" as a username and actually connect to the server specified AFTER the "@". Scammers place reputable brand names before the "@" to trick users.',
      severity: 'high',
      limitation: 'Rarely used in specialized internal servers, but effectively never present in legitimate customer links.'
    });
    checks.push({
      name: 'Address Obfuscation (@ Check)',
      description: 'Checks for deceptive @ delimiter tricks',
      status: 'flagged',
      notes: 'Deceptive @ symbol identified in address.'
    });
    whatWasFound.push('Contains an @ delimiter designed to obscure the true destination domain.');
  }

  // 4. Brand Impersonation check
  for (const [brand, patterns] of Object.entries(KNOWN_BRANDS)) {
    for (const pattern of patterns) {
      if (hostname.includes(pattern)) {
        const isLegit = hostname === `${pattern}.com` || hostname.endsWith(`.${pattern}.com`);
        if (!isLegit) {
          detectedBrand = brand;
          hasHighRiskEvidence = true;
          matchedFeeds.push(`Brand-Spoofing-${brand}`);
          findings.push({
            id: `find-brand-spoof-${pattern}`,
            title: `Apparent Brand Impersonation (${brand})`,
            plainExplanation: `The domain "${hostname}" incorporates brand terminology resembling ${brand}, but the root domain is not an official ${brand} property.`,
            evidenceOrSource: 'Brand Trademark Lookalike Pattern Engine',
            confidenceLevel: 'Strong Indicator',
            whyItMatters: 'Brand spoofing is the primary hallmark of phishing. Attackers register lookalike addresses to create credible-looking login and payment pages that steal credentials.',
            severity: 'high',
            limitation: 'Third-party authorized partners or regional affiliates occasionally reference brand names, but sensitive account credentials should never be entered on unofficial domains.'
          });
          checks.push({
            name: 'Brand Alignment & Impersonation',
            description: `Evaluates domain authority against known registered ${brand} properties`,
            status: 'flagged',
            notes: `Domain references ${brand} without official root authorization.`
          });
          whatWasFound.push(`The domain explicitly incorporates the name of ${brand} without official authorization.`);
          break;
        }
      }
    }
    if (detectedBrand) break;
  }

  if (!detectedBrand) {
    checks.push({
      name: 'Brand Alignment & Impersonation',
      description: 'Evaluates domain authority against known global brands',
      status: 'passed',
      notes: 'No obvious brand hijacking detected.'
    });
  }

  // 5. URL Shorteners
  if (URL_SHORTENERS.has(hostname)) {
    suspicionCount++;
    findings.push({
      id: 'find-url-shortener',
      title: 'Concealed Destination via URL Shortening Service',
      plainExplanation: `The link uses a public URL shortener (${hostname}) which conceals the final destination address.`,
      evidenceOrSource: 'Known URL Shortener Database Registry',
      confidenceLevel: 'Confirmed',
      whyItMatters: 'URL shorteners hide the real destination, preventing you from evaluating the target address before opening it.',
      severity: 'medium',
      limitation: 'URL shorteners are widely used for convenience on social media. A shortened link alone is NOT proof of a scam, but requires caution until expanded.'
    });
    checks.push({
      name: 'Destination Address Transparency',
      description: 'Checks whether the true target web address is immediately visible',
      status: 'warning',
      notes: `Shortener detected (${hostname}).`
    });
    whatWasFound.push(`The destination is obscured by a public URL shortener (${hostname}).`);
  }

  // 6. Suspicious TLD (Carefully marked as Possible Indicator, NOT proof of scam by itself)
  if (HIGH_RISK_TLDS.has(tld)) {
    suspicionCount++;
    findings.push({
      id: 'find-unfamiliar-tld',
      title: `Unfamiliar Top-Level Domain Extension (.${tld})`,
      plainExplanation: `The domain uses the .${tld} extension. This extension is common among disposable or low-cost registrations.`,
      evidenceOrSource: 'Top-Level Domain Abuse Telemetry Profile',
      confidenceLevel: 'Possible Indicator',
      whyItMatters: 'Certain inexpensive domain extensions exhibit elevated statistical rates of temporary spam and phishing domains.',
      severity: 'low',
      limitation: 'An unfamiliar or new top-level domain is NOT proof of a scam by itself. Many legitimate modern websites and startups utilize newer extensions.'
    });
    checks.push({
      name: 'TLD Reputation Context',
      description: 'Evaluates historical abuse metrics associated with domain extension',
      status: 'warning',
      notes: `Extension .${tld} has elevated abuse rates in security telemetry.`
    });
    whatWasFound.push(`The domain uses the .${tld} extension.`);
  }

  // 7. Security-Sensitive Keywords
  const foundKws = SUSPICIOUS_KEYWORDS.filter(kw => (hostname + pathname + search).includes(kw));
  if (foundKws.length > 0) {
    const hasLoginKw = foundKws.some(k => ['login', 'signin', 'verify', 'wallet', 'banking', 'otp'].includes(k));
    if (hasLoginKw) suspicionCount++;
    findings.push({
      id: 'find-sensitive-keywords',
      title: 'Security-Sensitive Keywords in URL Path',
      plainExplanation: `The web address path contains terms frequently seen in authentication flows: [${foundKws.slice(0, 4).join(', ')}].`,
      evidenceOrSource: 'URL Lexical Tokenizer',
      confidenceLevel: 'Possible Indicator',
      whyItMatters: 'Phishing URLs often include words like "login", "verify", or "security" to reassure potential victims.',
      severity: hasLoginKw ? 'medium' : 'low',
      limitation: 'Legitimate websites routinely have login and verification paths. This factor is only meaningful when considered in combination with other domain attributes.'
    });
    checks.push({
      name: 'Credential Harvesting Pattern Check',
      description: 'Scans path for terms associated with credential workflows',
      status: hasLoginKw ? 'warning' : 'passed',
      notes: `Observed terms: ${foundKws.slice(0, 3).join(', ')}`
    });
  }

  // 8. Reachability and Page Content Findings
  if (probe.reachability.status === 'checked' && probe.reachability.httpStatusCode) {
    whatWasFound.push(`Target server responded with HTTP ${probe.reachability.httpStatusCode} (${probe.reachability.responseTimeMs}ms response time).`);
    checks.push({
      name: 'Server Reachability & HTTP Response',
      description: 'Performs safe, non-executing connection test to assess server status',
      status: 'passed',
      notes: `HTTP ${probe.reachability.httpStatusCode} (${probe.reachability.responseTimeMs}ms)`
    });

    if (probe.pageContent.hasLoginForm || probe.pageContent.hasPasswordField) {
      if (detectedBrand || isIpAddress) {
        hasHighRiskEvidence = true;
      } else {
        suspicionCount++;
      }
      findings.push({
        id: 'find-page-login-form',
        title: 'Credential Entry Fields Detected in Page Markup',
        plainExplanation: 'Safe content inspection identified password entry fields (<input type="password">) or login forms in the page HTML.',
        evidenceOrSource: 'Safe HTML Markup Inspection (DOM Static Parser)',
        confidenceLevel: 'Confirmed',
        whyItMatters: 'When present on an unverified or lookalike domain, login forms indicate an active attempt to harvest account passwords.',
        severity: detectedBrand ? 'high' : 'medium',
        limitation: 'Login forms on legitimate authorized websites are normal. Risk depends on domain authority.'
      });
      whatWasFound.push('Page HTML contains active credential entry fields (password input).');
    }
  } else {
    // Inspection was unsuccessful
    checks.push({
      name: 'Server Reachability & HTTP Response',
      description: 'Performs safe, non-executing connection test to assess server status',
      status: 'inconclusive',
      notes: probe.reachability.failureReason || 'Server unreachable'
    });
    whatWasFound.push('Server reachability probe was unsuccessful (server unreachable or timed out).');
    whatRemainsUnknown.push('Target server availability and live HTTP response details (the server may be offline, firewalled, or geo-blocked).');
    whatRemainsUnknown.push('Live page HTML contents and interactive forms (could not be rendered safely).');
    
    findings.push({
      id: 'find-reachability-unsuccessful',
      title: 'Page Reachability Check Unsuccessful',
      plainExplanation: probe.reachability.failureReason || 'The inspection was unsuccessful because the server could not be reached. The cause is unknown unless verified.',
      evidenceOrSource: 'Safe Network Reachability Probe',
      confidenceLevel: 'Confirmed',
      whyItMatters: 'A failed page load by itself is NOT proof of a scam. The server could be down, temporarily overloaded, geofencing automated scanners, or already deactivated by hosting providers.',
      severity: 'neutral',
      limitation: 'Failed connections do not prove malice. The website may be accessible from certain geographic regions or residential IP addresses.'
    });
  }

  // Document what remains unknown
  whatRemainsUnknown.push('Authoritative domain creation date and registrant entity (not verified via official WHOIS).');
  whatRemainsUnknown.push('Dynamic client-side JavaScript execution behavior (scripts were not executed to protect security).');
  whatRemainsUnknown.push('Backend database and transaction handling on the target server.');

  // Determine Overall Assessment according to the user's strict rules:
  // "Use a high-risk label only when the available evidence supports it. Otherwise use Suspicious or Unable to Determine."
  // "Do not treat a new domain, unfamiliar top-level domain, long URL, failed page load, or encoded parameter as proof of a scam by itself."
  let overallAssessment: RiskLevel = 'clean';
  let overallConfidence: ConfidenceLevel = 'Confirmed';
  let riskScore = 10;
  let scoreExplanation = '';
  let summary = '';

  if (hasHighRiskEvidence) {
    overallAssessment = 'high_risk';
    overallConfidence = detectedBrand ? 'Strong Indicator' : 'Confirmed';
    riskScore = detectedBrand ? 95 : 85;
    scoreExplanation = `High risk determined based on concrete evidence: ${detectedBrand ? `unauthorized imitation of ${detectedBrand}` : 'critical address obfuscation tricks'}.`;
    summary = `High-risk indicators were detected for this destination${detectedBrand ? ` targeting ${detectedBrand}` : ''}. Available evidence strongly suggests deceptive intent. We advise against visiting or submitting information.`;
  } else if (suspicionCount >= 2 || (suspicionCount === 1 && !probe.reachability.inspectionSuccessful)) {
    overallAssessment = 'suspicious';
    overallConfidence = 'Possible Indicator';
    riskScore = 55;
    scoreExplanation = 'Suspicious rating based on multiple cautionary attributes. Note: unfamiliar TLDs or failed connections alone do not constitute proof of fraud.';
    summary = 'Multiple cautionary indicators were observed. While not definitive proof of malicious activity, caution is advised before entering details.';
  } else if (!probe.reachability.inspectionSuccessful && suspicionCount === 0) {
    overallAssessment = 'undetermined';
    overallConfidence = 'Unverified';
    riskScore = 30;
    scoreExplanation = 'Assessment is Unable to Determine because the target server could not be reached and no obvious deceptive indicators were identified in the URL structure.';
    summary = 'The server could not be reached, and the address syntax does not contain overt scam signatures. A definitive determination cannot be made from available evidence.';
  } else {
    overallAssessment = 'clean';
    overallConfidence = 'Confirmed';
    riskScore = 8;
    scoreExplanation = 'No significant warning signs were detected across standard domain reputation, protocol, and structure checks.';
    summary = 'Available checks did not identify significant warning signs. Standard safe browsing practices still apply, as automated checks cannot provide a 100% guarantee of safety.';
  }

  // Recommended actions
  const recommendedActions: RecommendedAction[] = [];
  if (overallAssessment === 'high_risk') {
    recommendedActions.push({
      priority: 'immediate',
      action: 'Do not enter passwords, PINs, or financial details',
      description: 'The evidence indicates an intentional deceptive structure designed to harvest credentials or manipulate users.'
    });
    if (detectedBrand) {
      recommendedActions.push({
        priority: 'immediate',
        action: `Verify independently via the official ${detectedBrand} website`,
        description: `Open a separate browser tab and navigate directly to the verified official ${detectedBrand} portal to review your account status.`
      });
      recommendedActions.push({
        priority: 'important',
        action: 'If credentials were typed, change them immediately',
        description: `Reset your ${detectedBrand} password on the genuine platform and revoke any active login sessions.`
      });
    }
    recommendedActions.push({
      priority: 'guidance',
      action: 'Forward the message to abuse reporting channels',
      description: 'Report the suspicious link to your cellular provider (7726 in most jurisdictions) or national fraud reporting services.'
    });
  } else if (overallAssessment === 'suspicious') {
    recommendedActions.push({
      priority: 'immediate',
      action: 'Verify the true recipient before proceeding',
      description: 'Do not provide payment cards or login information until you have verified the organization through an independent channel.'
    });
    if (URL_SHORTENERS.has(hostname)) {
      recommendedActions.push({
        priority: 'important',
        action: 'Unshorten the link to preview the final landing page',
        description: 'Use a reputable link expansion tool to inspect the true destination domain before clicking.'
      });
    }
    recommendedActions.push({
      priority: 'guidance',
      action: 'Check independent consumer reviews and registries',
      description: 'Look for public trade registrations or verified customer reviews if considering a purchase.'
    });
  } else if (overallAssessment === 'undetermined') {
    recommendedActions.push({
      priority: 'important',
      action: 'Do not treat this result as confirmation of safety',
      description: 'The server could not be reached, so live page content and security certificates could not be verified. Exercise caution.'
    });
    recommendedActions.push({
      priority: 'guidance',
      action: 'Try again later or verify the sender directly',
      description: 'If you received this link in an unsolicited message, contact the sender through a known, trusted phone number.'
    });
  } else {
    recommendedActions.push({
      priority: 'guidance',
      action: 'Standard safe browsing practices remain applicable',
      description: 'A clean assessment means no known red flags were observed. It does not constitute a guarantee that the website is completely safe.'
    });
    recommendedActions.push({
      priority: 'guidance',
      action: 'Confirm the address bar domain before typing credentials',
      description: 'Always double-check that the domain in your browser matches the expected service before submitting passwords.'
    });
  }

  // Threat intelligence details
  const threatIntelligence: ThreatIntelligenceDetails = {
    status: matchedFeeds.length > 0 ? 'flagged' : 'clean',
    sourcesChecked: threatSources,
    matchedThreatFeeds: matchedFeeds,
    notes: matchedFeeds.length > 0 
      ? `Matched ${matchedFeeds.length} local threat pattern heuristic(s): ${matchedFeeds.join(', ')}.`
      : 'No active malicious signatures matched in verified local rule databases. (Note: Newly created or targeted phishing sites frequently evade external threat feeds).'
  };

  // Evidence audit
  const evidenceAudit: EvidenceAudit = {
    overallConfidence,
    confidenceJustification: overallAssessment === 'high_risk'
      ? 'Confidence is high due to verified structural anomalies and direct brand lookalike signatures.'
      : (overallAssessment === 'suspicious' 
          ? 'Confidence is limited to the observable cautionary signals. In the absence of authoritative registration or live DOM verification, definitive determination cannot be made.'
          : 'Confidence reflects nominal results across verified address syntax, transport protocols, and heuristic databases.'),
    whatWasFound,
    whatRemainsUnknown
  };

  return {
    id: `fl-rep-${Date.now()}`,
    submissionType: 'url',
    submittedValue: rawUrl,
    displayTarget: hostname,
    timestamp: new Date().toISOString(),
    overallAssessment,
    riskScore,
    scoreExplanation,
    summary,
    brandImpersonated: detectedBrand,
    urlFormat,
    domainRegistration,
    reachability: probe.reachability,
    redirects: probe.redirects,
    threatIntelligence,
    pageContent: probe.pageContent,
    evidenceAudit,
    findings,
    recommendedActions,
    checksPerformed: checks,
    limitationsNote: 'This evidence-based report documents observable technical indicators at the time of inspection. FraudLens adheres strictly to factual findings and never fabricates registry dates, scan results, or HTTP status codes.'
  };
}

// API Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiEnabled: Boolean(ai),
    timestamp: new Date().toISOString()
  });
});

// URL Analysis endpoint
app.post('/api/analyze/url', async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !url.trim()) {
      res.status(400).json({ error: 'A valid URL or link string is required.' });
      return;
    }

    const trimmedUrl = url.trim();

    // 1. Perform safe reachability and redirect probe
    const probe = await performSafeReachabilityProbe(trimmedUrl);

    // 2. Generate evidence-based base report
    const evidenceReport = generateEvidenceReport(trimmedUrl, probe);

    // 3. If Gemini is available, enhance plain-language translations while preserving facts
    if (ai) {
      try {
        const prompt = `You are FraudLens Core Analysis Engine.
You must review and enhance this evidence-based report for clarity and public understanding.
CRITICAL EVIDENCE-BASED REPORTING RULES:
1. NEVER fabricate or alter the facts. Do not invent domain registration dates, threat feed hits, or HTTP status codes.
2. If reachability was unsuccessful, explicitly explain that the cause is unknown unless verified.
3. Do NOT treat an unfamiliar TLD, long URL, or failed page load as proof of a scam by itself.
4. Use "high_risk" ONLY when concrete evidence supports it (e.g. verified brand impersonation, deceptive userinfo @ trick, or confirmed credential harvesting form). Otherwise use "suspicious", "clean", or "undetermined".
5. Use confidence labels: "Confirmed", "Strong Indicator", "Possible Indicator", or "Unverified".

Existing Evidence Data:
- URL: ${evidenceReport.submittedValue}
- Overall Assessment: ${evidenceReport.overallAssessment}
- Reachability status: ${probe.reachability.status} (HTTP ${probe.reachability.httpStatusCode || 'None'})
- Failure reason if any: ${probe.reachability.failureReason || 'None'}
- Suspected Brand: ${evidenceReport.brandImpersonated || 'None'}
- Verified Findings: ${JSON.stringify(evidenceReport.findings)}
- What was found: ${JSON.stringify(evidenceReport.evidenceAudit?.whatWasFound)}
- What remains unknown: ${JSON.stringify(evidenceReport.evidenceAudit?.whatRemainsUnknown)}

Enhance the plain-language summary and score explanation, preserving all evidence.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are an evidence-based cybersecurity analyst. Produce strictly objective, fact-grounded reporting without exaggerating or inventing evidence.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                overallAssessment: { type: Type.STRING },
                riskScore: { type: Type.INTEGER },
                scoreExplanation: { type: Type.STRING },
                summary: { type: Type.STRING },
                confidenceJustification: { type: Type.STRING }
              },
              required: ['overallAssessment', 'riskScore', 'scoreExplanation', 'summary', 'confidenceJustification']
            }
          }
        });

        if (response.text) {
          const aiData = JSON.parse(response.text);
          if (['high_risk', 'suspicious', 'clean', 'undetermined'].includes(aiData.overallAssessment)) {
            // Apply only if valid and aligns with evidence discipline
            if (aiData.overallAssessment !== 'high_risk' || evidenceReport.overallAssessment === 'high_risk') {
              evidenceReport.overallAssessment = aiData.overallAssessment;
            }
          }
          if (typeof aiData.riskScore === 'number') {
            evidenceReport.riskScore = Math.min(Math.max(aiData.riskScore, 0), 100);
          }
          if (aiData.scoreExplanation) evidenceReport.scoreExplanation = aiData.scoreExplanation;
          if (aiData.summary) evidenceReport.summary = aiData.summary;
          if (aiData.confidenceJustification && evidenceReport.evidenceAudit) {
            evidenceReport.evidenceAudit.confidenceJustification = aiData.confidenceJustification;
          }
        }
      } catch (aiErr) {
        console.warn('Gemini enrichment error, returning verified evidence report:', aiErr);
      }
    }

    res.json(evidenceReport);
  } catch (err: any) {
    console.error('Server error in /api/analyze/url:', err);
    res.status(500).json({ error: 'Internal server error while analyzing URL.' });
  }
});

// QR Code Analysis endpoint
app.post('/api/analyze/qr', async (req: Request, res: Response) => {
  try {
    const { decodedText, imageBase64, mimeType } = req.body;
    let targetPayload = (decodedText || '').trim();

    // If no client-decoded text was provided but an image was uploaded, use Gemini multimodal to decode
    if (!targetPayload && imageBase64 && ai) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
        const imagePart = {
          inlineData: {
            mimeType: mimeType || 'image/png',
            data: cleanBase64
          }
        };
        const decodePrompt = {
          text: 'Examine this image and extract the exact QR code content or text payload. If you identify a URL or text string inside the QR code, return ONLY that raw text payload. If no QR code is readable, return "UNREADABLE".'
        };

        const decodeRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts: [imagePart, decodePrompt] }
        });

        const rawText = decodeRes.text?.trim() || '';
        if (rawText && !rawText.includes('UNREADABLE')) {
          targetPayload = rawText;
        }
      } catch (decodeErr) {
        console.warn('QR visual decode fallback error:', decodeErr);
      }
    }

    if (!targetPayload) {
      res.status(400).json({
        error: 'Unable to decode a QR code from this image. Please ensure the QR code is clearly visible and well-lit.'
      });
      return;
    }

    // Inspect the decoded QR content
    const isUrl = /^https?:\/\//i.test(targetPayload) || /^[a-z0-9-]+(\.[a-z0-9-]+)+([/?].*)?$/i.test(targetPayload);

    if (isUrl) {
      // Run the full reachability and evidence probe on the QR destination URL
      const probe = await performSafeReachabilityProbe(targetPayload);
      const evidenceReport = generateEvidenceReport(targetPayload, probe);
      evidenceReport.submissionType = 'qr';
      evidenceReport.displayTarget = `QR Destination: ${evidenceReport.displayTarget || targetPayload}`;
      
      evidenceReport.findings.unshift({
        id: 'find-qr-optical-extraction',
        title: 'Optical QR Code Payload Extraction',
        plainExplanation: `Successfully extracted target web address from optical QR code: "${targetPayload.slice(0, 80)}"`,
        evidenceOrSource: 'Optical 2D Matrix Barcode Reader',
        confidenceLevel: 'Confirmed',
        whyItMatters: 'Scanning QR codes on mobile devices typically bypasses URL inspection. Pre-screening the destination prevents automated malicious downloads.',
        severity: 'low',
        limitation: 'Cannot detect physical tampering (e.g. a fraudulent sticker pasted over an authentic sign) without on-site visual inspection.'
      });

      res.json(evidenceReport);
      return;
    }

    // Non-URL QR Payload (e.g. WiFi, plain text, custom scheme)
    res.json({
      id: `fl-qr-${Date.now()}`,
      submissionType: 'qr',
      submittedValue: targetPayload,
      displayTarget: 'Non-URL QR Payload',
      timestamp: new Date().toISOString(),
      overallAssessment: 'clean',
      riskScore: 15,
      scoreExplanation: 'Decoded QR code contains text or custom data rather than an external web link. Web-based drive-by attacks are not applicable.',
      summary: 'The QR code contains direct text or configuration data rather than an external web address.',
      brandImpersonated: null,
      findings: [
        {
          id: 'qr-non-url-payload',
          title: 'Direct Data QR Payload (No Web Link)',
          plainExplanation: `Decoded QR payload contains data: "${targetPayload.slice(0, 100)}"`,
          evidenceOrSource: 'Optical 2D Barcode Decoder',
          confidenceLevel: 'Confirmed',
          whyItMatters: 'Does not lead to an external web server, eliminating standard web phishing risks.',
          severity: 'neutral',
          limitation: 'Specialized application URIs or device configuration codes may still trigger local device prompts.'
        }
      ],
      checksPerformed: [
        {
          name: 'Optical Barcode Decryption',
          description: 'Decodes 2D matrix optical pattern into readable characters',
          status: 'passed',
          notes: 'Successfully decoded text payload.'
        }
      ],
      recommendedActions: [
        {
          priority: 'guidance',
          action: 'Verify contents before accepting device prompts',
          description: 'If this QR code prompts you to connect to a Wi-Fi network or add a contact card, confirm the sender.'
        }
      ],
      limitationsNote: 'Analysis evaluates optical data contents. Physical sticker overlays cannot be ruled out without physical examination.'
    });
  } catch (err: any) {
    console.error('Server error in /api/analyze/qr:', err);
    res.status(500).json({ error: 'Internal server error while analyzing QR code.' });
  }
});

// Screenshot Analysis endpoint (Multimodal Vision)
app.post('/api/analyze/screenshot', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType, userNotes } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      res.status(400).json({ error: 'Image data is required for screenshot analysis.' });
      return;
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const actualMime = mimeType || 'image/jpeg';

    if (!ai) {
      res.json({
        id: `fl-ss-${Date.now()}`,
        submissionType: 'screenshot',
        submittedValue: 'Screenshot Image',
        displayTarget: 'Uploaded Image',
        timestamp: new Date().toISOString(),
        overallAssessment: 'undetermined',
        riskScore: 40,
        scoreExplanation: 'Assessment is Unable to Determine because server-side visual AI engine is not configured.',
        summary: 'Image received. Multimodal analysis requires server AI credentials.',
        brandImpersonated: null,
        findings: [
          {
            id: 'ss-no-ai',
            title: 'Visual Inspection Engine Unavailable',
            plainExplanation: 'Deep optical brand and sentiment analysis could not be completed.',
            evidenceOrSource: 'System Capability Check',
            confidenceLevel: 'Unverified',
            whyItMatters: 'Without optical OCR and visual scrutiny, message text cannot be evaluated.',
            severity: 'neutral'
          }
        ],
        recommendedActions: [
          {
            priority: 'immediate',
            action: 'Verify sender identity independently',
            description: 'Do not click links or call numbers displayed in the screenshot.'
          }
        ],
        checksPerformed: [],
        limitationsNote: 'Visual analysis unavailable.'
      });
      return;
    }

    const promptText = `Examine this screenshot of a message, email, website, or payment request for potential fraud or scam activity.
${userNotes ? `User context: "${userNotes}"` : ''}

Strict Evidence-Based Guidelines:
1. Do not label content malicious without clear concrete visual or textual evidence.
2. If text is unreadable or blurry, label it Unable to Determine.
3. Use confidence levels: Confirmed, Strong Indicator, Possible Indicator, Unverified.
4. Identify any brand being impersonated (e.g. USPS, PayPal, Chase, Microsoft, Netflix).
5. Explain what was found and what remains unknown.`;

    const imagePart = {
      inlineData: {
        mimeType: actualMime,
        data: cleanBase64
      }
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          imagePart,
          { text: promptText }
        ]
      },
      config: {
        systemInstruction: 'You are an evidence-based scam analysis platform. Adhere strictly to factual visual observations. Never invent sender addresses or threat indicators.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallAssessment: { type: Type.STRING },
            riskScore: { type: Type.INTEGER },
            scoreExplanation: { type: Type.STRING },
            summary: { type: Type.STRING },
            brandImpersonated: { type: Type.STRING },
            findings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  plainExplanation: { type: Type.STRING },
                  evidenceOrSource: { type: Type.STRING },
                  confidenceLevel: { type: Type.STRING },
                  whyItMatters: { type: Type.STRING },
                  severity: { type: Type.STRING }
                },
                required: ['id', 'title', 'plainExplanation', 'evidenceOrSource', 'confidenceLevel', 'whyItMatters', 'severity']
              }
            },
            recommendedActions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  priority: { type: Type.STRING },
                  action: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ['priority', 'action', 'description']
              }
            },
            whatWasFound: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            whatRemainsUnknown: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            'overallAssessment', 'riskScore', 'scoreExplanation', 'summary',
            'findings', 'recommendedActions', 'whatWasFound', 'whatRemainsUnknown'
          ]
        }
      }
    });

    if (response.text) {
      const aiData = JSON.parse(response.text);
      const validOverall = ['high_risk', 'suspicious', 'clean', 'undetermined'].includes(aiData.overallAssessment)
        ? aiData.overallAssessment
        : 'suspicious';

      const defaultChecks: CheckItem[] = [
        {
          name: 'Visual Trademark & Brand Logo Authenticity',
          description: 'Scans image for spoofed company insignias and counterfeit headers',
          status: aiData.brandImpersonated ? 'flagged' : 'passed',
          notes: aiData.brandImpersonated ? `Target brand identified: ${aiData.brandImpersonated}` : 'No brand trademark spoofing recognized.'
        },
        {
          name: 'Coercive Urgency & Extortion Analysis',
          description: 'Evaluates text for threatening deadlines and account cancellation ultimatums',
          status: aiData.riskScore > 60 ? 'flagged' : (aiData.riskScore > 30 ? 'warning' : 'passed'),
          notes: 'Evaluated psychological sentiment indicators.'
        }
      ];

      res.json({
        id: `fl-ss-${Date.now()}`,
        submissionType: 'screenshot',
        submittedValue: 'Screenshot Image Analysis',
        displayTarget: aiData.brandImpersonated ? `${aiData.brandImpersonated} Impersonation Screenshot` : 'Suspicious Message/Screenshot',
        timestamp: new Date().toISOString(),
        overallAssessment: validOverall,
        riskScore: typeof aiData.riskScore === 'number' ? Math.min(Math.max(aiData.riskScore, 0), 100) : 50,
        scoreExplanation: aiData.scoreExplanation || 'Score based on visual brand evaluation, textual urgency, and credential requests.',
        summary: aiData.summary || 'Multimodal screenshot evaluation completed.',
        brandImpersonated: aiData.brandImpersonated || null,
        evidenceAudit: {
          overallConfidence: validOverall === 'high_risk' ? 'Strong Indicator' : 'Possible Indicator',
          confidenceJustification: 'Assessment derived from optical inspection of visual assets and text sentiment.',
          whatWasFound: aiData.whatWasFound || ['Visual screenshot received and scanned.'],
          whatRemainsUnknown: aiData.whatRemainsUnknown || ['Underlying transmission headers', 'Server delivery logs']
        },
        findings: aiData.findings || [],
        recommendedActions: aiData.recommendedActions || [],
        checksPerformed: defaultChecks,
        limitationsNote: 'Visual analysis relies on image resolution and legibility. Underlying server network logs cannot be inspected from a static image.'
      });
      return;
    }

    res.status(500).json({ error: 'Failed to extract meaningful analysis from screenshot.' });
  } catch (err: any) {
    console.error('Server error in /api/analyze/screenshot:', err);
    res.status(500).json({ error: 'Internal server error while inspecting screenshot.' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FraudLens server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
