import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 479–483 Supabase import contract", () => {
  it("locks the two-authorized five-page boundary and preserves typed international-relations and treaty content", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0479_0483.mjs"), "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [479, 480, 481, 482, 483]");
    expect(generator).toContain("Do not extend this batch without explicit user instruction");
    expect(generator).toContain("bangladesh-international-relations");
    expect(generator).toContain("bangladesh-treaties");
    expect(generator).toContain("ON CONFLICT (canonical_hash)");
    expect(generator).toContain("printed_book_page");
  });

  it("retains all printed MCQ options, exact answer keys, and the visible HANA source typo without guessing", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0479_0483.mjs"), "utf8");
    expect(generator).toContain("generated_options: mcqs.length * 4");
    expect(generator).toContain("Humanitarain Assistance Needs Assessment");
    expect(generator).toContain("source-typo-preserved");
    expect(generator).toContain("১৭ সেপ্টেম্বর, ১৯৭৪");
    expect(generator).toContain('kind === "mcq" && page === 480');
    expect(generator).toContain("WHERE NOT EXISTS");
  });
});
