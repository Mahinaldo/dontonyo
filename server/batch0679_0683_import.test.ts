import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0679_0683.mjs";

describe("validated pages 679–683 import contract", () => {
  it("locks the reviewed range, conservative record totals, and answer-key gate", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([679, 680, 681, 682, 683]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts.review_tiles).toBe(35);
    expect(counts.eligible_facts).toBe(8);
    expect(counts.eligible_notes).toBe(5);
    expect(counts.eligible_mcqs).toBe(1);
    expect(counts.eligible_mcq_options).toBe(4);
    expect(counts.withheld_mcqs).toBe(13);
    expect(counts.derived_records).toBe(14);
  });

  it("preserves the independently corroborated Civil War MCQ and isolated provenance", async () => {
    const { audit, sql } = await buildBatch();
    expect(audit.verification_counts).toEqual({ verified: 9, conflicting: 0, source_attributed: 5 });
    expect(sql).toContain("আমেরিকার গৃহযুদ্ধের মেয়াদ-");
    expect(sql).toContain("১৮৬১-১৮৬৫ সালে");
    expect(sql).toContain("batch-0679-0683-quality-pipeline");
    expect(sql).toContain("batch0679-0683:mcq:");
    expect(sql).toContain("BETWEEN 679 AND 683");
  });
});
