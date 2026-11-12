import type { PolicyAnalysis, PrivacyGrade, TrackerInfo } from "./types";

interface RadarInfo {
  ddgTrackerRadar?: { fingerprinting?: number; prevalence?: number };
}

/**
 * Same methodology as the `calculatePrivacyGrade` function in
 * supabase/functions/scan-website/index.ts — used to restore grades for
 * scans recorded before the grade feature existed, from their stored
 * trackers + policy analysis (no new scan, no API calls).
 */
export function computePrivacyGrade(
  trackers: TrackerInfo[],
  policyAnalysis: PolicyAnalysis,
  url: string,
): PrivacyGrade {
  let score = 100;

  const trackerPenalty = Math.min(trackers.length * 3, 30);
  score -= trackerPenalty;

  let fingerprintPenalty = 0;
  for (const t of trackers) {
    const fp = (t as RadarInfo).ddgTrackerRadar?.fingerprinting || 0;
    if (fp >= 3) fingerprintPenalty += 8;
    else if (fp >= 2) fingerprintPenalty += 5;
    else if (fp >= 1) fingerprintPenalty += 2;
  }
  fingerprintPenalty = Math.min(fingerprintPenalty, 20);
  score -= fingerprintPenalty;

  let prevalencePenalty = 0;
  for (const t of trackers) {
    const prev = (t as RadarInfo).ddgTrackerRadar?.prevalence || 0;
    if (prev >= 0.3) prevalencePenalty += 5;
    else if (prev >= 0.1) prevalencePenalty += 3;
    else if (prev > 0) prevalencePenalty += 1;
  }
  prevalencePenalty = Math.min(prevalencePenalty, 15);
  score -= prevalencePenalty;

  let policyPenalty = 0;
  if (policyAnalysis?.score === "Potentially Non-Compliant") policyPenalty = 20;
  else if (policyAnalysis?.score === "Review Recommended") policyPenalty = 10;
  policyPenalty += Math.min((policyAnalysis?.missingKeywords?.length || 0) * 2, 10);
  policyPenalty = Math.min(policyPenalty, 20);
  score -= policyPenalty;

  const httpsPenalty = url.startsWith("https://") ? 0 : 15;
  score -= httpsPenalty;

  score = Math.max(0, Math.min(100, score));

  let grade: string;
  if (score >= 95) grade = "A+";
  else if (score >= 85) grade = "A";
  else if (score >= 75) grade = "B+";
  else if (score >= 65) grade = "B";
  else if (score >= 55) grade = "C+";
  else if (score >= 45) grade = "C";
  else if (score >= 35) grade = "D+";
  else if (score >= 25) grade = "D";
  else grade = "F";

  return {
    grade,
    score,
    breakdown: { trackerPenalty, policyPenalty, httpsPenalty, fingerprintPenalty, prevalencePenalty },
  };
}

export function isValidPrivacyGrade(grade: unknown): grade is PrivacyGrade {
  const g = grade as PrivacyGrade | null | undefined;
  return (
    !!g &&
    typeof g === "object" &&
    typeof g.grade === "string" &&
    typeof g.score === "number" &&
    !!g.breakdown
  );
}

/** Returns the stored grade when present, otherwise recomputes it from stored scan data. */
export function ensurePrivacyGrade(
  stored: unknown,
  trackers: TrackerInfo[],
  policyAnalysis: PolicyAnalysis,
  url: string,
): PrivacyGrade {
  if (isValidPrivacyGrade(stored)) return stored;
  return computePrivacyGrade(trackers, policyAnalysis, url);
}
