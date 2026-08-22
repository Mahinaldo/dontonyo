import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BATCH_PAGES, PIPELINE_VERSION, buildBatch } from "../scripts/prepare_validated_batch_0629_0633.mjs";

const root = "/home/ubuntu/dontonyo";
const work = "/home/ubuntu/dontonyo-work/batch-0629-0633";

describe("validated pages 629–633 import contract", () => {
  it("locks the reviewed range, OCR provenance, and no-MCQ source boundary", async () => {
    const { audit, counts } = await buildBatch();
    const review = await fs.readFile(path.join(work, "visual_review_629_633.md"), "utf8");
    expect(BATCH_PAGES).toEqual([629, 630, 631, 632, 633]);
    expect(audit.pipeline_version).toBe(PIPELINE_VERSION);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts.review_tiles).toBe(35);
    expect(counts.eligible_mcqs).toBe(0);
    expect(review).toContain("All 35 overlap-safe tiles were reviewed in exact manifest order");
    expect(review).toContain("no MCQ block or answer grid");
  });

  it("preserves only bounded verified or source-attributed claims", async () => {
    const { audit, sql } = await buildBatch();
    const decisions = await fs.readFile(path.join(work, "classification_decisions.md"), "utf8");
    expect(audit.generated_facts).toBe(16);
    expect(audit.generated_notes).toBe(5);
    expect(audit.verification_counts).toEqual({ verified: 8, conflicting: 0, source_attributed: 13 });
    expect(sql).toContain("Martin Luther King Jr.");
    expect(sql).toContain("Statue of Liberty");
    expect(decisions).toContain("No MCQ is imported");
    expect(decisions).toContain("current-most-recent Democratic/Republican president lines");
  });

  it("uses current batch provenance and permitted tags only", async () => {
    const { sql } = await buildBatch();
    expect(sql).toContain("batch-0629-0633-quality-pipeline");
    expect(sql).toContain("batch0629-0633:fact:");
    expect(sql).toContain("batch0629-0633:note:");
    expect(sql).not.toContain("batch0624-0628");
    expect(sql).not.toContain("conflicting_source");
    expect(sql).toContain("'domain'");
    expect(sql).toContain("'content_type'");
    expect(sql).toContain("'quality'");
  });
});
