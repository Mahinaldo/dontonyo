import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0804_0808.mjs";

describe("validated pages 804–808 import contract", () => {
  it("locks provenance-only totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([804, 805, 806, 807, 808]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts).toMatchObject({ review_tiles: 35, eligible_facts: 0, eligible_notes: 0, eligible_mcqs: 0, eligible_mcq_options: 0, withheld_mcqs: 0, derived_records: 0 });
    expect(audit.verification_counts).toEqual({ verified: 0, conflicting: 0, source_attributed: 0 });
  });

  it("retains batch-local provenance only", async () => {
    const { sql } = await buildBatch();
    expect(sql).toContain("quotation-question-boundary-804");
    expect(sql).toContain("intercontinental-straits-boundary-808");
    expect(sql).toContain("WHERE NOT EXISTS (SELECT 1 FROM public.import_runs");
    expect(sql).not.toContain("INSERT INTO public.gk_facts");
    expect(sql).not.toContain("INSERT INTO public.gk_notes");
    expect(sql).not.toContain("INSERT INTO public.gk_mcqs");
  });
});
