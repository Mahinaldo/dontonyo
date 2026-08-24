import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0794_0798.mjs";

describe("validated pages 794–798 import contract", () => {
  it("locks conservative mixed-admission totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([794, 795, 796, 797, 798]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts).toMatchObject({ review_tiles: 35, eligible_facts: 3, eligible_notes: 0, eligible_mcqs: 0, eligible_mcq_options: 0, withheld_mcqs: 0, derived_records: 3 });
    expect(audit.verification_counts).toEqual({ verified: 3, conflicting: 0, source_attributed: 0 });
  });

  it("retains batch-local provenance, unique verified fact contracts, and idempotent derived records", async () => {
    const { sql } = await buildBatch();
    expect(sql).toContain("mixed-association-boundary-794");
    expect(sql).toContain("literary-attribution-boundary-798");
    expect(sql).toContain("John Keats — Isabella");
    expect(sql).toContain("Charles Dickens — A Tale of Two Cities");
    expect(sql).toContain("Daniel Defoe — Robinson Crusoe");
    expect(sql).toContain("batch0794-0798:fact:");
    expect(sql).toContain("WHERE NOT EXISTS (SELECT 1 FROM public.import_runs");
    expect(sql).toContain("ON CONFLICT (canonical_hash) DO UPDATE");
    expect(sql).not.toContain("INSERT INTO public.gk_notes");
    expect(sql).not.toContain("INSERT INTO public.gk_mcqs");
  });
});
