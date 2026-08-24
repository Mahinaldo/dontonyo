import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0799_0803.mjs";

describe("validated pages 799–803 import contract", () => {
  it("locks conservative mixed-admission totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([799, 800, 801, 802, 803]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts).toMatchObject({ review_tiles: 35, eligible_facts: 3, eligible_notes: 0, eligible_mcqs: 0, eligible_mcq_options: 0, withheld_mcqs: 0, derived_records: 3 });
    expect(audit.verification_counts).toEqual({ verified: 3, conflicting: 0, source_attributed: 0 });
  });

  it("retains batch-local provenance, unique verified fact contracts, and idempotent derived records", async () => {
    const { sql } = await buildBatch();
    expect(sql).toContain("literary-reference-boundary-799");
    expect(sql).toContain("quotation-attribution-boundary-803");
    expect(sql).toContain("Johann Wolfgang von Goethe — Faust");
    expect(sql).toContain("Ernest Hemingway — The Old Man and the Sea");
    expect(sql).toContain("J. K. Rowling — Harry Potter");
    expect(sql).toContain("batch0799-0803:fact:");
    expect(sql).toContain("WHERE NOT EXISTS (SELECT 1 FROM public.import_runs");
    expect(sql).toContain("ON CONFLICT (canonical_hash) DO UPDATE");
    expect(sql).not.toContain("INSERT INTO public.gk_notes");
    expect(sql).not.toContain("INSERT INTO public.gk_mcqs");
  });
});
