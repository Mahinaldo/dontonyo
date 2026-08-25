import { describe, expect, it } from "vitest";
import { BATCH_PAGES, PIPELINE_VERSION, buildBatch } from "../scripts/prepare_validated_batch_0859_0863.mjs";

describe("validated pages 859–863 provenance-only import contract", () => {
  it("locks range and zero-admission totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([859, 860, 861, 862, 863]);
    expect(audit.pipeline_version).toBe(PIPELINE_VERSION);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts).toMatchObject({ review_tiles: 35, eligible_facts: 0, eligible_notes: 0, eligible_mcqs: 0, eligible_mcq_options: 0, derived_records: 0 });
    expect(audit.verification_counts).toEqual({ verified: 0, conflicting: 0, source_attributed: 0 });
  });

  it("retains transaction and idempotent provenance boundaries", async () => {
    const { sql } = await buildBatch();
    expect(sql).toContain("BEGIN;");
    expect(sql).toContain("COMMIT;");
    expect(sql).toContain("WHERE NOT EXISTS (SELECT 1 FROM public.import_runs");
    expect(sql).not.toContain("INSERT INTO public.gk_facts");
    expect(sql).not.toContain("INSERT INTO public.gk_notes");
    expect(sql).not.toContain("INSERT INTO public.gk_mcqs");
  });
});
