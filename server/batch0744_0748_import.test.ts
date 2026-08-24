import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0744_0748.mjs";

describe("validated pages 744–748 import contract", () => {
  it("locks the reviewed range and provenance-only record totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([744, 745, 746, 747, 748]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts).toMatchObject({ review_tiles: 35, eligible_facts: 0, eligible_notes: 0, eligible_mcqs: 0, eligible_mcq_options: 0, withheld_mcqs: 0, derived_records: 0 });
    expect(audit.verification_counts).toEqual({ verified: 0, conflicting: 0, source_attributed: 0 });
  });

  it("retains only batch-local source-page and topic provenance", async () => {
    const { sql } = await buildBatch();
    expect(sql).toContain("sdg-policy-boundary-744");
    expect(sql).toContain("past-exam-un-institutions-boundary-748");
    expect(sql).toContain("local-ocr-quality-gated-batch-0744-0748-v1");
    expect(sql).toContain("BETWEEN 744 AND 748");
    expect(sql).not.toContain("INSERT INTO public.gk_facts");
    expect(sql).not.toContain("INSERT INTO public.gk_notes");
    expect(sql).not.toContain("INSERT INTO public.gk_mcqs");
    expect(sql).not.toContain("INSERT INTO public.fact_verifications");
  });
});
