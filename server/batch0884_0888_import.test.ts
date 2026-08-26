import { describe, expect, it } from "vitest";
import { BATCH_PAGES, PIPELINE_VERSION, buildBatch } from "../scripts/prepare_validated_batch_0884_0888.mjs";

describe("validated pages 884–888 provenance-only import contract", () => {
  it("locks range, tile review, and zero-admission totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([884, 885, 886, 887, 888]);
    expect(audit.pipeline_version).toBe(PIPELINE_VERSION);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts).toMatchObject({ review_tiles: 35, eligible_facts: 0, eligible_notes: 0, eligible_mcqs: 0, eligible_mcq_options: 0, derived_records: 0 });
    expect(audit.verification_counts).toEqual({ verified: 0, conflicting: 0, source_attributed: 0 });
  });

  it("retains transaction, idempotency, and no learner-content inserts", async () => {
    const { sql } = await buildBatch();
    expect(sql).toContain("BEGIN;");
    expect(sql).toContain("COMMIT;");
    expect(sql).toContain("WHERE NOT EXISTS (SELECT 1 FROM public.import_runs");
    expect(sql).not.toContain("INSERT INTO public.gk_facts");
    expect(sql).not.toContain("INSERT INTO public.gk_notes");
    expect(sql).not.toContain("INSERT INTO public.gk_mcqs");
    expect(sql).not.toContain("INSERT INTO public.gk_mcq_options");
    expect(sql).not.toContain("INSERT INTO public.fact_verifications");
    expect(sql).not.toContain("INSERT INTO public.flashcards");
    expect(sql).not.toContain("INSERT INTO public.search_documents");
  });
});
