import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("validated pages 474–478 Supabase import contract", () => {
  it("locks the authorized five-page range and preserves source-linked typed content", async () => {
    const generator = await readFile(path.join(projectRoot, "scripts/prepare_validated_batch_0474_0478.mjs"), "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [474, 475, 476, 477, 478]");
    expect(generator).toContain("Do not extend this batch without explicit user instruction");
    expect(generator).toContain("printed_book_page");
    expect(generator).toContain("roads-and-railways");
    expect(generator).toContain("waterways-and-aviation");
    expect(generator).toContain("bridges-and-flyovers");
    expect(generator).toContain("ON CONFLICT (canonical_hash)");
  });

  it("keeps all printed MCQ options while flagging the page-478 asterisk answer rather than guessing", async () => {
    const generator = await readFile(path.join(projectRoot, "scripts/prepare_validated_batch_0474_0478.mjs"), "utf8");
    expect(generator).toContain("generated_options: mcqs.length * 4");
    expect(generator).toContain("মিবার্ড");
    expect(generator).toContain("হাতিরদিয়া");
    expect(generator).toContain('"*", "16 BCS", "source_attributed", "low"');
    expect(generator).toContain("low-confidence-answer");
    expect(generator).toContain("WHERE NOT EXISTS");
  });
});
