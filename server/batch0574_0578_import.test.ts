import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 574–578 import contract", () => {
  it("locks the exact source range, successful OCR audit, and full ordered image review", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0574_0578.mjs"), "utf8");
    const audit = await readFile("/home/ubuntu/dontonyo-work/batch-0574-0578/audit.json", "utf8");
    const review = await readFile("/home/ubuntu/dontonyo-work/batch-0574-0578/visual_review_574_578.md", "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [574, 575, 576, 577, 578]");
    expect(generator).toContain("vision-quality-gated-batch-0574-0578-v1");
    expect(audit).toContain('"completed_pages": 5');
    expect(audit).toContain('"failed_pages": 0');
    expect(review).toContain("All 35 ordered overlap-safe tiles in pages 574–578 have been reviewed.");
    expect(review).toContain("Page 578 visual review complete");
  });

  it("imports only complete eligible page-574 MCQs with four reviewed options and excludes unsafe questions", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0574_0578.mjs"), "utf8");
    for (const number of ["17", "18", "21", "22", "25", "29", "30"]) expect(generator).toContain(`mcq("${number}"`);
    for (const number of ["19", "20", "23", "24", "26", "27", "28", "31"]) expect(generator).not.toContain(`mcq("${number}"`);
    expect(generator).toContain("generated_options: mcqs.length * 4");
    expect(generator).toContain("Every imported MCQ has four visually reviewed options and one printed key.");
    expect(generator).toContain("No corrupted, ambiguous, territorial/citizenship, unbounded time-sensitive, or historically unsafe MCQ is imported.");
  });

  it("preserves verification and conflict boundaries across China, Korea, Japan, and Singapore", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0574_0578.mjs"), "utf8");
    const classification = await readFile("/home/ubuntu/dontonyo-work/batch-0574-0578/classification_decisions.md", "utf8");
    const verification = await readFile("/home/ubuntu/dontonyo-work/batch-0574-0578/external_verification.md", "utf8");
    expect(generator).toContain("https://sg75.pa.gov.sg/the-singapore-story/");
    expect(generator).toContain("https://www.archives.gov/milestone-documents/armistice-agreement-restoration-south-korean-state");
    expect(generator).toContain("https://www.kunaicho.go.jp/kids/about/syocho.html");
    expect(generator).toContain("source-attributed");
    expect(generator).toContain("time-sensitive");
    expect(generator).not.toContain('mcq("31"');
    expect(classification).toContain("Page 574 MCQ 19 equates");
    expect(classification).toContain("Page 578’s 31 August 1963 independence wording");
    expect(verification).toContain("conflicting_source");
    expect(verification).toContain("source_attributed");
  });
});
