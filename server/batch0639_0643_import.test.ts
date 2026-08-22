import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0639_0643.mjs";

describe("validated pages 639–643 import contract", () => {
  it("locks the reviewed range and intentionally conservative no-MCQ gate", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([639, 640, 641, 642, 643]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts.review_tiles).toBe(35);
    expect(counts.eligible_facts).toBe(12);
    expect(counts.eligible_notes).toBe(5);
    expect(counts.eligible_mcqs).toBe(0);
  });

  it("preserves verified historic records and source-error boundary", async () => {
    const { audit, sql } = await buildBatch();
    expect(audit.verification_counts).toEqual({ verified: 11, conflicting: 0, source_attributed: 6 });
    expect(sql).toContain("NASA — 1958 establishment");
    expect(sql).toContain("The source’s 1863 slavery-abolition key is excluded");
    expect(sql).toContain("batch-0639-0643-quality-pipeline");
    expect(sql).not.toContain("current 47th president");
  });
});
