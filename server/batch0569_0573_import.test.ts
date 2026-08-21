import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 569–573 import contract", () => {
  it("locks the exact source range, successful OCR audit, and full ordered image review", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0569_0573.mjs"), "utf8");
    const audit = await readFile("/home/ubuntu/dontonyo-work/batch-0569-0573/audit.json", "utf8");
    const review = await readFile("/home/ubuntu/dontonyo-work/batch-0569-0573/visual_review_569_573.md", "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [569, 570, 571, 572, 573]");
    expect(generator).toContain("vision-quality-gated-batch-0569-0573-v1");
    expect(audit).toContain('"completed_pages": 5');
    expect(audit).toContain('"failed_pages": 0');
    expect(review).toContain("All 35 ordered overlap-safe tiles in pages 569–573 have been reviewed");
    expect(review).toContain("Page 573 visual review complete");
  });

  it("imports only eligible page-573 MCQs with four reviewed options and excludes each unsafe item", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0569_0573.mjs"), "utf8");
    for (const number of ["01", "02", "03", "06", "07", "09", "12", "14", "15", "16"]) expect(generator).toContain(`mcq("${number}"`);
    for (const number of ["04", "05", "08", "10", "11", "13"]) expect(generator).not.toContain(`mcq("${number}"`);
    expect(generator).toContain("generated_options: mcqs.length * 4");
    expect(generator).toContain("Every imported MCQ has four visually reviewed options and one printed key.");
    expect(generator).toContain("No corrupted, ambiguous, time-bound governance, or historically unsafe MCQ is imported.");
  });

  it("preserves source-attribution and conflict boundaries for China, Tibet, Hong Kong, Taiwan, and Xinjiang", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0569_0573.mjs"), "utf8");
    const classification = await readFile("/home/ubuntu/dontonyo-work/batch-0569-0573/classification_decisions.md", "utf8");
    const verification = await readFile("/home/ubuntu/dontonyo-work/batch-0569-0573/external_verification.md", "utf8");
    expect(generator).toContain("https://digitallibrary.un.org/record/192054?ln=en");
    expect(generator).toContain("https://www.nobelprize.org/prizes/peace/1989/summary/");
    expect(generator).toContain("https://whc.unesco.org/en/list/438/");
    expect(generator).toContain("source-attributed");
    expect(generator).toContain("time-sensitive");
    expect(generator).not.toContain('fact(572, "Mao was first president');
    expect(classification).toContain("Page 569 says socialism was established in China in **1971**");
    expect(classification).toContain("04, 05, 08, 10, 11, 13");
    expect(verification).toContain("conflicting_source");
    expect(verification).toContain("no independent status adjudication is made");
  });
});
