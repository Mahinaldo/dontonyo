import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 494–498 Supabase import contract", () => {
  it("locks the five-page boundary and keeps former-colony lists, historical facts, and past-exam MCQs distinct", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0494_0498.mjs"), "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [494, 495, 496, 497, 498]");
    expect(generator).toContain("Do not extend this batch without explicit user instruction");
    expect(generator).toContain("world-countries-colonies");
    expect(generator).toContain("british-former-colonies");
    expect(generator).toContain("colonial-history-past-exam-mcqs");
    expect(generator).toContain("ON CONFLICT (canonical_hash)");
    expect(generator).toContain("printed_book_page");
  });

  it("preserves source anomalies, all four options, answer keys, and only direct external verification states", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0494_0498.mjs"), "utf8");
    expect(generator).toContain("১৯৭৫ আগে");
    expect(generator).toContain("ডোমিনিকান প্রজাতন্ত্র");
    expect(generator).toContain('mcq("07"');
    expect(generator).toContain("generated_options: mcqs.length * 4");
    expect(generator).toContain("refs.soviet");
    expect(generator).toContain("refs.palau");
    expect(generator).toContain("refs.timor");
    expect(generator).toContain("WHERE NOT EXISTS");
  });
});
