import { describe, expect, it } from "vitest";
import { BATCH_PAGES, PIPELINE_VERSION, buildBatch } from "../scripts/prepare_validated_batch_0814_0818.mjs";

describe("validated pages 814–818 provenance-only import contract", () => {
  it("locks the reviewed physical range and zero-admission totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([814, 815, 816, 817, 818]);
    expect(audit.pipeline_version).toBe(PIPELINE_VERSION);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts).toMatchObject({ review_tiles: 35, eligible_facts: 0, eligible_notes: 0, eligible_mcqs: 0, eligible_mcq_options: 0, derived_records: 0 });
  });

  it("retains only source-page boundaries with transaction and import-run idempotency", async () => {
    const { sql } = await buildBatch();
    expect(sql).toContain("BEGIN;");
    expect(sql).toContain("COMMIT;");
    expect(sql).toContain("batch-0814-0818");
    expect(sql).toContain("WHERE NOT EXISTS (SELECT 1 FROM public.import_runs");
    expect(sql).not.toContain("INSERT INTO public.gk_facts");
    expect(sql).not.toContain("INSERT INTO public.gk_notes");
    expect(sql).not.toContain("INSERT INTO public.gk_mcqs");
  });
});
