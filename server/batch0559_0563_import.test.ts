import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 559–563 import contract", () => {
  it("locks the exact source range, OCR audit, visual review, and reviewed input counts", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0559_0563.mjs"), "utf8");
    const audit = await readFile("/home/ubuntu/dontonyo-work/batch-0559-0563/audit.json", "utf8");
    const review = await readFile("/home/ubuntu/dontonyo-work/batch-0559-0563/visual_review_559_563.md", "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [559, 560, 561, 562, 563]");
    expect(generator).toContain("All 35 ordered overlapping dense-image tiles were reviewed.");
    expect(audit).toContain('"completed_pages": 5');
    expect(audit).toContain('"failed_pages": 0');
    expect(review).toContain("Page 563 visual review complete");
  });

  it("imports only visually eligible MCQs with one printed key and excludes unsafe questions", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0559_0563.mjs"), "utf8");
    expect(generator).toContain("Every imported MCQ has four visually reviewed source options and one printed key.");
    for (const number of ["01", "02", "06", "07", "08", "12"]) expect(generator).toContain(`mcq(560, "${number}"`);
    for (const number of ["03", "04", "05", "09", "10", "11"]) expect(generator).not.toContain(`mcq(560, "${number}"`);
    for (const number of ["01", "02", "04", "05"]) expect(generator).toContain(`mcq(563, "${number}"`);
    expect(generator).not.toContain('mcq(563, "03"');
    expect(generator).toContain("generated_options: mcqs.length * 4");
    expect(generator).toContain("option-mismatched");
    expect(generator).toContain("dual-key");
  });

  it("preserves verification URLs, source attribution, and political-content caveats", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0559_0563.mjs"), "utf8");
    const classification = await readFile("/home/ubuntu/dontonyo-work/batch-0559-0563/classification_decisions.md", "utf8");
    const verification = await readFile("/home/ubuntu/dontonyo-work/batch-0559-0563/external_verification.md", "utf8");
    expect(generator).toContain("https://www.un.org/unispal/document/auto-insert-193242/");
    expect(generator).toContain("https://peacekeeping.un.org/sites/default/files/past/uniimog.htm");
    expect(generator).toContain("https://www.georgewbushlibrary.gov/research/topic-guides/the-iraq-war");
    expect(generator).toContain("source-attributed");
    expect(generator).toContain("time-sensitive");
    expect(classification).toContain("Turkey is absent from the options");
    expect(classification).toContain("Hostile");
    expect(verification).toContain("conflicting_source");
    expect(verification).toContain("Do not normalize slogans");
  });
});
