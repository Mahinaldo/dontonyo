import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0649_0653.mjs";

describe("validated pages 649–653 import contract", () => {
  it("locks reviewed range, exact safe counts, and answer-keyed MCQ completeness", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([649, 650, 651, 652, 653]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts.review_tiles).toBe(35);
    expect(counts.eligible_facts).toBe(15);
    expect(counts.eligible_notes).toBe(5);
    expect(counts.eligible_mcqs).toBe(2);
    expect(counts.eligible_mcq_options).toBe(8);
    expect(counts.withheld_mcqs).toBe(5);
  });

  it("preserves historic scope and rejects the Soviet-colony source error", async () => {
    const { audit, sql } = await buildBatch();
    expect(audit.verification_counts).toEqual({ verified: 9, conflicting: 0, source_attributed: 13 });
    expect(sql).toContain("New Zealand women’s suffrage");
    expect(sql).toContain("Great Barrier Reef");
    expect(sql).toContain("batch-0649-0653-quality-pipeline");
    expect(sql).toContain("batch0649-0653:mcq:");
    expect(sql).toContain("12 successor states of the Soviet Union were British colonies is rejected");
  });
});
