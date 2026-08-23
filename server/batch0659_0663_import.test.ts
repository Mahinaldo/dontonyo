import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0659_0663.mjs";

describe("validated pages 659–663 import contract", () => {
  it("locks reviewed range, no-MCQ gate, and conservative content totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([659, 660, 661, 662, 663]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts.review_tiles).toBe(35);
    expect(counts.eligible_facts).toBe(5);
    expect(counts.eligible_notes).toBe(5);
    expect(counts.eligible_mcqs).toBe(0);
    expect(counts.withheld_mcqs).toBe(12);
  });

  it("retains only bounded historic or formal concepts and excludes conflict practice", async () => {
    const { audit, sql } = await buildBatch();
    expect(audit.verification_counts).toEqual({ verified: 3, conflicting: 0, source_attributed: 7 });
    expect(sql).toContain("Persona non grata");
    expect(sql).toContain("Watergate break-in");
    expect(sql).toContain("Conflict-MCQ exclusion");
    expect(sql).toContain("batch-0659-0663-quality-pipeline");
    expect(sql).toContain("batch0659-0663:fact:");
  });
});
