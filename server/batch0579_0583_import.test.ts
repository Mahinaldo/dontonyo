import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 579–583 import contract", () => {
  it("locks the exact source range, successful OCR audit, and full ordered image review", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0579_0583.mjs"), "utf8");
    const audit = await readFile("/home/ubuntu/dontonyo-work/batch-0579-0583/audit.json", "utf8");
    const review = await readFile("/home/ubuntu/dontonyo-work/batch-0579-0583/visual_review_579_583.md", "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [579, 580, 581, 582, 583]");
    expect(generator).toContain("vision-quality-gated-batch-0579-0583-v1");
    expect(audit).toContain('"completed_pages": 5');
    expect(audit).toContain('"failed_pages": 0');
    expect(review).toContain("All 35 ordered overlap-safe tiles in pages 579–583 have been reviewed.");
    expect(review).toContain("Page 583 visual review complete");
  });

  it("imports only complete eligible MCQs with four reviewed options and excludes the five unsafe questions", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0579_0583.mjs"), "utf8");
    for (const number of ["01", "02", "05", "06"]) expect(generator).toContain(`mcq(579, "${number}"`);
    for (const number of ["01", "03"]) expect(generator).toContain(`mcq(582, "${number}"`);
    expect(generator).not.toContain('mcq(579, "03"');
    expect(generator).not.toContain('mcq(579, "04"');
    expect(generator).not.toContain('mcq(582, "02"');
    expect(generator).not.toContain('mcq(582, "04"');
    expect(generator).not.toContain('mcq(582, "05"');
    expect(generator).toContain("generated_options: mcqs.length * 4");
    expect(generator).toContain("Every imported MCQ has four visually reviewed options and one printed key.");
  });

  it("preserves verified, source-attributed, and conflicting boundaries across Asia and Europe", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0579_0583.mjs"), "utf8");
    const classification = await readFile("/home/ubuntu/dontonyo-work/batch-0579-0583/classification_decisions.md", "utf8");
    const verification = await readFile("/home/ubuntu/dontonyo-work/batch-0579-0583/external_verification.md", "utf8");
    expect(generator).toContain("https://www.nlb.gov.sg/main/article-detail?cmsuuid=dc1efe7a-8159-40b2-9244-cdb078755013");
    expect(generator).toContain("https://history.state.gov/countries/qatar");
    expect(generator).toContain("https://www.nationalarchives.gov.uk/explore-the-collection/explore-by-time-period/georgians/1833-abolition-of-slavery-act-and-compensation-claims/");
    expect(generator).toContain("source-attributed");
    expect(generator).toContain("time-sensitive");
    expect(classification).toContain("Page 582 calls Mount Elbrus the Alps’ highest peak");
    expect(classification).toContain("Page 583’s slavery sentence");
    expect(verification).toContain("conflicting_source");
    expect(verification).toContain("source_attributed");
  });
});
