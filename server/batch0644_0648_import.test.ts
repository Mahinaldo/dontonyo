import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0644_0648.mjs";

describe("validated pages 644–648 import contract", () => {
  it("locks the reviewed range, source-derived counts, and complete MCQ gate", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([644, 645, 646, 647, 648]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts.review_tiles).toBe(35);
    expect(counts.eligible_facts).toBe(18);
    expect(counts.eligible_notes).toBe(5);
    expect(counts.eligible_mcqs).toBe(3);
    expect(counts.eligible_mcq_options).toBe(12);
    expect(counts.withheld_mcqs).toBe(9);
  });

  it("preserves safe historic scope and batch-isolated derived records", async () => {
    const { audit, sql } = await buildBatch();
    expect(audit.verification_counts).toEqual({ verified: 12, conflicting: 0, source_attributed: 14 });
    expect(sql).toContain("Sir John A. Macdonald");
    expect(sql).toContain("Dilma Rousseff");
    expect(sql).toContain("batch-0644-0648-quality-pipeline");
    expect(sql).toContain("batch0644-0648:mcq:");
    expect(sql).toContain("historic-scope");
    expect(sql).toContain("Only three source-keyed questions");
  });
});
