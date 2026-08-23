import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0664_0668.mjs";

describe("validated pages 664–668 import contract", () => {
  it("locks the reviewed source range, no-MCQ gate, and conservative record totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([664, 665, 666, 667, 668]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts.review_tiles).toBe(35);
    expect(counts.eligible_facts).toBe(14);
    expect(counts.eligible_notes).toBe(5);
    expect(counts.eligible_mcqs).toBe(0);
    expect(counts.derived_records).toBe(19);
  });

  it("preserves verified ancient-history records and source-attributed scope boundaries", async () => {
    const { audit, sql } = await buildBatch();
    expect(audit.verification_counts).toEqual({ verified: 10, conflicting: 0, source_attributed: 9 });
    expect(sql).toContain("Hammurapi’s law-code");
    expect(sql).toContain("Egyptian civil calendar");
    expect(sql).toContain("Mesopotamian superlative boundary");
    expect(sql).toContain("batch-0664-0668-quality-pipeline");
    expect(sql).toContain("batch0664-0668:fact:");
  });
});
