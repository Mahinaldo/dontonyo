import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 484–488 Supabase import contract", () => {
  it("locks the five-page boundary and preserves sports facts, biographies, and past-exam MCQs as distinct content", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0484_0488.mjs"), "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [484, 485, 486, 487, 488]");
    expect(generator).toContain("Do not extend this batch without explicit user instruction");
    expect(generator).toContain("bangladesh-sports");
    expect(generator).toContain("bangladesh-treaties");
    expect(generator).toContain("bangladesh-sports-biographies");
    expect(generator).toContain("ON CONFLICT (canonical_hash)");
    expect(generator).toContain("printed_book_page");
  });

  it("retains all four MCQ options, image-grounded metadata corrections, and only directly corroborated verification states", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0484_0488.mjs"), "utf8");
    expect(generator).toContain("generated_options: mcqs.length * 4");
    expect(generator).toContain("DU ঙ ০৩-০৪/চবি-ঘ, ০৭-০৮");
    expect(generator).toContain('"30 BCS"');
    expect(generator).toContain("refs.womensTest");
    expect(generator).toContain("refs.testStatus");
    expect(generator).toContain("WHERE NOT EXISTS");
  });
});
