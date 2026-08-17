import { describe, expect, it } from "vitest";
import { mcqIdempotencyKey, normalizeBangla, validateMcq } from "../shared/gkValidation";

describe("GK validation helpers", () => {
  it("normalizes Unicode joiners without changing Bangla wording", () => {
    expect(normalizeBangla("বাংলা\u200c  প্রশ্ন")).toBe("বাংলা প্রশ্ন");
  });

  it("creates the same idempotency key regardless of option object order", () => {
    const first = mcqIdempotencyKey({ question: "প্রশ্ন", options: { ক: "এক", খ: "দুই" } });
    const second = mcqIdempotencyKey({ question: "প্রশ্ন", options: { খ: "দুই", ক: "এক" } });
    expect(first).toBe(second);
  });

  it("retains uncertain MCQs for review but excludes them from quiz-ready content", () => {
    expect(validateMcq({ question: "বাংলা প্রশ্ন", options: { ক: "উত্তর এক", খ: "উত্তর দুই" } })).toEqual({ accepted: true, quizReady: false, confidence: "low" });
    expect(validateMcq({ question: "বাংলা প্রশ্ন", options: { ক: "উত্তর এক", খ: "উত্তর দুই" }, correctOption: "ক" })).toEqual({ accepted: true, quizReady: true, confidence: "high" });
  });
});
