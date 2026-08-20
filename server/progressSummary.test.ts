import { describe, expect, it } from "vitest";
import { getProgressSummary } from "../client/src/lib/progressSummary";

describe("getProgressSummary", () => {
  it("includes an authenticated Supabase practice attempt in the accuracy record", () => {
    const summary = getProgressSummary({
      content: [],
      attempts: [{ totalQuestions: 8, correctAnswers: 6 }],
      daily: [],
    });

    expect(summary).toMatchObject({
      answered: 8,
      correct: 6,
      accuracy: 75,
    });
  });

  it("combines detailed learning progress and aggregate practice without inventing activity", () => {
    const summary = getProgressSummary({
      content: [
        { status: "completed", correctCount: 3, incorrectCount: 1 },
        { status: "needs_review", correctCount: 0, incorrectCount: 2 },
      ],
      attempts: [{ totalQuestions: 4, correctAnswers: 3 }],
      daily: [{ isComplete: true }, { isComplete: false }],
    });

    expect(summary).toEqual({
      completed: 1,
      answered: 10,
      correct: 6,
      accuracy: 60,
      days: 1,
    });
  });
});
