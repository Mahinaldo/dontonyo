import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 564–568 import contract", () => {
  it("locks the exact source range, successful OCR audit, and complete ordered image review", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0564_0568.mjs"), "utf8");
    const audit = await readFile("/home/ubuntu/dontonyo-work/batch-0564-0568/audit.json", "utf8");
    const review = await readFile("/home/ubuntu/dontonyo-work/batch-0564-0568/visual_review_564_568.md", "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [564, 565, 566, 567, 568]");
    expect(generator).toContain("All five pages were rendered at 300 DPI");
    expect(audit).toContain('"completed_pages": 5');
    expect(audit).toContain('"failed_pages": 0');
    expect(review).toContain("All 35 ordered overlap-safe tiles in pages 564–568 have now been reviewed.");
    expect(review).toContain("Page 568 visual review complete");
  });

  it("imports only visually eligible MCQs with four reviewed options and excludes unsafe items", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0564_0568.mjs"), "utf8");
    expect(generator).toContain("Every imported MCQ has four visually reviewed options and one printed key.");
    for (const number of ["01", "02", "03", "04", "06"]) expect(generator).toContain(`mcq(565, "${number}"`);
    expect(generator).not.toContain('mcq(565, "05"');
    for (const number of ["01", "02", "03"]) expect(generator).toContain(`mcq(566, "${number}"`);
    expect(generator).not.toContain('mcq(566, "04"');
    for (const number of ["01", "02"]) expect(generator).toContain(`mcq(567, "${number}"`);
    expect(generator).not.toContain('mcq(567, "03"');
    expect(generator).toContain("generated_options: mcqs.length * 4");
    expect(generator).toContain("low-confidence-option");
    expect(generator).toContain("institutional-premise");
  });

  it("preserves corroboration links, attribution boundaries, source conflicts, and correct China tagging", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0564_0568.mjs"), "utf8");
    const classification = await readFile("/home/ubuntu/dontonyo-work/batch-0564-0568/classification_decisions.md", "utf8");
    const verification = await readFile("/home/ubuntu/dontonyo-work/batch-0564-0568/external_verification.md", "utf8");
    expect(generator).toContain("https://www.ktb.gov.tr/EN-103908/biography-of-ataturk.html");
    expect(generator).toContain("https://whc.unesco.org/en/list/849/");
    expect(generator).toContain("https://saudipedia.com/en/why-is-the-saudi-national-flag-not-flown-at-half-mast");
    expect(generator).toContain("https://www.britannica.com/biography/Imru-al-Qays-Arab-poet");
    expect(generator).toContain("const region = page => page === 568 ? \"asia\" : \"west-asia\"");
    expect(generator).toContain("source-attributed");
    expect(generator).toContain("time-sensitive");
    expect(generator).not.toContain('fact(564, "Caliphate abolition');
    expect(classification).toContain("Syria Q04");
    expect(classification).toContain("Page 567 contains sacred-place");
    expect(verification).toContain("conflicting_source");
    expect(verification).toContain("do not present a changing superlative as a timeless fact");
  });
});
