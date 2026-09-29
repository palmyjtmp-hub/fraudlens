import { AnalysisResult } from '../types/analysis';

export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  const res = await fetch('/api/analyze/url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Analysis failed (${res.status})`);
  }

  return res.json();
}

export async function analyzeQr(payload: {
  decodedText?: string;
  imageBase64?: string;
  mimeType?: string;
}): Promise<AnalysisResult> {
  const res = await fetch('/api/analyze/qr', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `QR analysis failed (${res.status})`);
  }

  return res.json();
}

export async function analyzeScreenshot(payload: {
  imageBase64: string;
  mimeType?: string;
  userNotes?: string;
}): Promise<AnalysisResult> {
  const res = await fetch('/api/analyze/screenshot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Screenshot analysis failed (${res.status})`);
  }

  return res.json();
}
