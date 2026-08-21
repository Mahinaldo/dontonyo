import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 584–588 import contract", () => {
  it("locks the exact source range, successful OCR audit, and full ordered image review", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0584_0588.mjs"), "utf8");
    const audit = await readFile("/home/ubuntu/dontonyo-work/batch-0584-0588/audit.json", "utf8");
    const review = await readFile("/home/ubuntu/dontonyo-work/batch-0584-0588/visual_review_584_588.md", "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [584, 585, 586, 587, 588]");
    expect(generator).toContain("vision-quality-gated-batch-0584-0588-v1");
    expect(audit).toContain('"completed_pages": 5');
    expect(audit).toContain('"failed_pages": 0');
    expect(review).toContain("All 35 ordered overlap-safe tiles in pages 584–588 have been reviewed.");
    expect(review).toContain("Page 588 visual review complete");
  });

  it("imports no invented MCQ from non-MCQ reference pages and excludes unsafe source claims", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0584_0588.mjs"), "utf8");
    expect(generator).toContain("generated_mcqs: 0");
    expect(generator).toContain("No source-complete MCQ block appears in pages 584–588");
    expect(generator).not.toContain("gk_mcqs");
    expect(generator).not.toContain("31 August 1997");
    expect(generator).not.toContain("House of Lords-এর সদস্য সংখ্যা- ৭৮০");
    expect(generator).not.toContain("Downing Street built by Sir George Downing in 1680");
  });

  it("preserves verified, source-attributed, and conflicting status boundaries", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0584_0588.mjs"), "utf8");
    const classification = await readFile("/home/ubuntu/dontonyo-work/batch-0584-0588/classification_decisions.md", "utf8");
    const verification = await readFile("/home/ubuntu/dontonyo-work/batch-0584-0588/external_verification.md", "utf8");
    expect(generator).toContain("https://www.parliament.uk/magnacarta/");
    expect(generator).toContain("https://www.nobelprize.org/prizes/literature/1953/summary/");
    expect(generator).toContain("conflicting_source");
    expect(generator).toContain("source-attributed");
    expect(classification).toContain("Gladstone’s continuous `1868–94` range");
    expect(classification).toContain("Downing Street built by Sir George Downing in 1680");
    expect(verification).toContain("conflicting_source");
    expect(verification).toContain("source_attributed");
  });
});
