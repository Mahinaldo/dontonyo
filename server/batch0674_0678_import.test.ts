import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0674_0678.mjs";

describe("validated pages 674–678 import contract", () => {
  it("locks the reviewed range, conservative content totals, and withheld answer-keyed questions", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([674, 675, 676, 677, 678]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts.review_tiles).toBe(35);
    expect(counts.eligible_facts).toBe(10);
    expect(counts.eligible_notes).toBe(5);
    expect(counts.eligible_mcqs).toBe(0);
    expect(counts.withheld_mcqs).toBe(15);
    expect(counts.derived_records).toBe(15);
  });

  it("preserves source boundaries, allowed verification totals, and batch-isolated derived keys", async () => {
    const { audit, sql } = await buildBatch();
    expect(audit.verification_counts).toEqual({ verified: 10, conflicting: 0, source_attributed: 5 });
    expect(sql).toContain("Printed-MCQ quality boundary");
    expect(sql).toContain("Political-history boundary");
    expect(sql).toContain("batch-0674-0678-quality-pipeline");
    expect(sql).toContain("batch0674-0678:fact:");
    expect(sql).toContain("BETWEEN 674 AND 678");
  });
});
