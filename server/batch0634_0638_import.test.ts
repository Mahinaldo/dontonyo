import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0634_0638.mjs";

describe("validated pages 634–638 import contract", () => {
  it("locks the reviewed source range and no-answer-key MCQ boundary", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([634, 635, 636, 637, 638]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts.review_tiles).toBe(35);
    expect(counts.eligible_mcqs).toBe(0);
    expect(counts.eligible_facts).toBe(12);
    expect(counts.eligible_notes).toBe(5);
  });

  it("retains only historically bounded verified or source-attributed records", async () => {
    const { audit, sql } = await buildBatch();
    expect(audit.verification_counts).toEqual({ verified: 6, conflicting: 0, source_attributed: 11 });
    expect(sql).toContain("Theodore Roosevelt — Nobel Peace Prize");
    expect(sql).toContain("September 11 attacks — historical event");
    expect(sql).toContain("batch-0634-0638-quality-pipeline");
    expect(sql).not.toContain("current 47th president");
    expect(sql).toContain("Security and conflict boundary");
    expect(sql).not.toContain("current 47th president of the United States");
  });
});
