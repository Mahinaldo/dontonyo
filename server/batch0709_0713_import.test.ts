import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0709_0713.mjs";

describe("validated pages 709–713 import contract", () => {
  it("locks the reviewed range and conservative content totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([709, 710, 711, 712, 713]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts).toMatchObject({
      review_tiles: 35,
      eligible_facts: 1,
      eligible_notes: 0,
      eligible_mcqs: 0,
      eligible_mcq_options: 0,
      withheld_mcqs: 4,
      derived_records: 1,
    });
    expect(audit.verification_counts).toEqual({ verified: 1, conflicting: 0, source_attributed: 0 });
  });

  it("keeps only the verified Black Tuesday fact with batch-local provenance", async () => {
    const { sql } = await buildBatch();
    expect(sql).toContain("Black Tuesday — 29 October 1929");
    expect(sql).toContain("https://www.federalreservehistory.org/essays/stock-market-crash-of-1929");
    expect(sql).toContain("batch-0709-0713-quality-pipeline");
    expect(sql).toContain("batch0709-0713:fact:");
    expect(sql).toContain("BETWEEN 709 AND 713");
    expect(sql).not.toContain("INSERT INTO public.gk_mcqs");
    expect(sql).not.toContain("INSERT INTO public.gk_notes");
  });
});
