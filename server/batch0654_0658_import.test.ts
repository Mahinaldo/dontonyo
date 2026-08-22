import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0654_0658.mjs";

describe("validated pages 654–658 import contract", () => {
  it("locks the reviewed range, conservative counts, and complete MCQ gate", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([654, 655, 656, 657, 658]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts.review_tiles).toBe(35);
    expect(counts.eligible_facts).toBe(12);
    expect(counts.eligible_notes).toBe(5);
    expect(counts.eligible_mcqs).toBe(4);
    expect(counts.eligible_mcq_options).toBe(16);
    expect(counts.withheld_mcqs).toBe(12);
  });

  it("preserves historic scope and the narcotics-security exclusion", async () => {
    const { audit, sql } = await buildBatch();
    expect(audit.verification_counts).toEqual({ verified: 6, conflicting: 0, source_attributed: 15 });
    expect(sql).toContain("Commonwealth of Independent States");
    expect(sql).toContain("Asian Tigers");
    expect(sql).toContain("batch-0654-0658-quality-pipeline");
    expect(sql).toContain("batch0654-0658:mcq:");
    expect(sql).toContain("Narcotics and trafficking exclusion");
  });
});
