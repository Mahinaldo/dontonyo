import { describe, expect, it } from "vitest";
import {
  getGkDashboard,
  getSupabaseLibrary,
  getSupabasePracticeQuestions,
} from "./supabaseCatalog";

describe("Supabase GK catalog", () => {
  it("returns the real imported book, inventory, and a paginated chapter library", async () => {
    const [dashboard, library] = await Promise.all([
      getGkDashboard(),
      getSupabaseLibrary(1, 6),
    ]);

    expect(dashboard?.book.slug).toBe("jubayers-gk");
    expect(dashboard?.stats.facts).toBeGreaterThan(3_000);
    expect(dashboard?.stats.mcqs).toBeGreaterThan(400);
    expect(library?.items).toHaveLength(6);
    expect(library?.total).toBeGreaterThan(60);
  });

  it("returns practice questions with a complete four-option source contract", async () => {
    const questions = await getSupabasePracticeQuestions(4);

    expect(questions).toHaveLength(4);
    for (const question of questions) {
      expect(question.options).toHaveLength(4);
      expect(question.options.filter(option => option.isCorrect)).toHaveLength(1);
    }
  });
});
