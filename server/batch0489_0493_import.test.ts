import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 489–493 Supabase import contract", () => {
  it("locks the five-page boundary and keeps abbreviation, international-affairs, and Earth content in distinct source taxonomy", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0489_0493.mjs"), "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [489, 490, 491, 492, 493]");
    expect(generator).toContain("Do not extend this batch without explicit user instruction");
    expect(generator).toContain("bangladesh-abbreviations");
    expect(generator).toContain("international-affairs");
    expect(generator).toContain("earth-reference-material");
    expect(generator).toContain("ON CONFLICT (canonical_hash)");
    expect(generator).toContain("printed_book_page");
  });

  it("preserves visible page-489 anomalies, all four page-493 MCQ options, source answer keys, and only direct verification links", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0489_0493.mjs"), "utf8");
    expect(generator).toContain("Annual Development Programmer");
    expect(generator).toContain("BJMA Bangladesh Jute Mills Corporation");
    expect(generator).toContain("source-typo-preserved");
    expect(generator).toContain("generated_options: mcqs.length * 4");
    expect(generator).toContain("দ. আফ্রিকা");
    expect(generator).toContain("The second Largest continent on Earth is-");
    expect(generator).toContain("refs.mariana");
    expect(generator).toContain("refs.guinnessHot");
    expect(generator).toContain("WHERE NOT EXISTS");
  });
});
