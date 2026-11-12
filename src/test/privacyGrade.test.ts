import { describe, it, expect } from "vitest";
import { computePrivacyGrade, ensurePrivacyGrade, isValidPrivacyGrade } from "@/lib/privacyGrade";
import type { PolicyAnalysis, TrackerInfo } from "@/lib/types";

const policy: PolicyAnalysis = {
  score: "Review Recommended",
  policyUrl: "https://example.com/privacy",
  highlights: [],
  foundKeywords: ["a"],
  missingKeywords: ["1", "2", "3", "4", "5", "6"],
};

function tracker(id: string, fp: number, prev: number): TrackerInfo & {
  ddgTrackerRadar: { fingerprinting: number; prevalence: number };
} {
  return {
    id,
    name: id,
    domain: "tracker.test",
    category: "Marketing",
    riskLevel: "Medium",
    confidence: 0.9,
    expiry: "Session",
    secure: true,
    sameSite: "Lax",
    explanation: "",
    detectedVia: "test",
    ddgTrackerRadar: { fingerprinting: fp, prevalence: prev },
  };
}

describe("computePrivacyGrade", () => {
  // Mirrors a real stored scan (openrouter.ai): 6 trackers, policy
  // "Review Recommended" with 6 missing keywords, https URL.
  // Stored result: score 49, grade C, breakdown {18, 20, 0, 6, 7}.
  it("reproduces the edge-function result for a known scan", () => {
    const trackers = [
      tracker("t1", 0, 0.4),
      tracker("t2", 0, 0.05),
      tracker("t3", 0, 0.05),
      tracker("t4", 1, 0),
      tracker("t5", 1, 0),
      tracker("t6", 1, 0),
    ];
    const grade = computePrivacyGrade(trackers, policy, "https://openrouter.ai");
    expect(grade.score).toBe(49);
    expect(grade.grade).toBe("C");
    expect(grade.breakdown.trackerPenalty).toBe(18);
    expect(grade.breakdown.policyPenalty).toBe(20);
    expect(grade.breakdown.httpsPenalty).toBe(0);
    expect(grade.breakdown.fingerprintPenalty).toBe(6);
    expect(grade.breakdown.prevalencePenalty).toBe(7);
  });

  it("applies the https penalty for http urls", () => {
    const grade = computePrivacyGrade(
      [],
      { ...policy, score: "Likely Compliant", missingKeywords: [] },
      "http://example.com",
    );
    expect(grade.breakdown.httpsPenalty).toBe(15);
    expect(grade.score).toBe(85);
    expect(grade.grade).toBe("A");
  });
});

describe("isValidPrivacyGrade", () => {
  it("rejects the empty object stored by pre-grade scans", () => {
    expect(isValidPrivacyGrade({})).toBe(false);
    expect(isValidPrivacyGrade(null)).toBe(false);
    expect(isValidPrivacyGrade(undefined)).toBe(false);
  });

  it("accepts a complete grade", () => {
    expect(
      isValidPrivacyGrade({ grade: "A", score: 90, breakdown: { trackerPenalty: 0, policyPenalty: 0, httpsPenalty: 0, fingerprintPenalty: 0, prevalencePenalty: 0 } }),
    ).toBe(true);
  });
});

describe("ensurePrivacyGrade", () => {
  it("keeps stored grades untouched", () => {
    const stored = { grade: "B+", score: 77, breakdown: { trackerPenalty: 9, policyPenalty: 10, httpsPenalty: 0, fingerprintPenalty: 0, prevalencePenalty: 0 } };
    expect(ensurePrivacyGrade(stored, [], policy, "https://x.com")).toBe(stored);
  });

  it("recomputes grades for scans recorded before the grade feature", () => {
    const restored = ensurePrivacyGrade({}, [], { ...policy, score: "Likely Compliant" }, "https://x.com");
    expect(restored.grade).toBe("A");
    expect(restored.score).toBe(90);
  });
});
