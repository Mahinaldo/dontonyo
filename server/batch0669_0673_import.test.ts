import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0669_0673.mjs";

describe("validated pages 669–673 import contract", () => {
  it("locks reviewed range, no-MCQ gate, and conservative content totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([669, 670, 671, 672, 673]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts.review_tiles).toBe(35);
    expect(counts.eligible_facts).toBe(15);
    expect(counts.eligible_notes).toBe(5);
    expect(counts.eligible_mcqs).toBe(0);
    expect(counts.derived_records).toBe(20);
  });

  it("retains bounded historical records and explicit question-bank exclusions", async () => {
    const { audit, sql } = await buildBatch();
    expect(audit.verification_counts).toEqual({ verified: 6, conflicting: 0, source_attributed: 14 });
    expect(sql).toContain("Indus civilization — regional scope");
    expect(sql).toContain("Greek source-superlative boundary");
    expect(sql).toContain("Question-bank exclusion boundary");
    expect(sql).toContain("batch-0669-0673-quality-pipeline");
    expect(sql).toContain("batch0669-0673:fact:");
  });
});
