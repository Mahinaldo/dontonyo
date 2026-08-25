import { describe, expect, it } from "vitest";
import { BATCH_PAGES, PIPELINE_VERSION, buildBatch } from "../scripts/prepare_validated_batch_0854_0858.mjs";

describe("validated pages 854–858 selective-admission import contract", () => {
  it("locks range, selective-admission totals, and verification statuses", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([854, 855, 856, 857, 858]);
    expect(audit.pipeline_version).toBe(PIPELINE_VERSION);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts).toMatchObject({ review_tiles: 35, eligible_facts: 3, eligible_notes: 0, eligible_mcqs: 0, eligible_mcq_options: 0, withheld_mcqs: 13, derived_records: 3 });
    expect(audit.verification_counts).toEqual({ verified: 3, conflicting: 0, source_attributed: 0 });
  });

  it("retains idempotent provenance, verified facts, and no MCQ or note inserts", async () => {
    const { sql } = await buildBatch();
    expect(sql).toContain("war-theory-exam-reference-boundary-854");
    expect(sql).toContain("picasso-monet-art-reference-boundary-858");
    expect(sql).toContain("Leonardo da Vinci — Mona Lisa");
    expect(sql).toContain("Michelangelo Buonarroti — David");
    expect(sql).toContain("Vincent van Gogh — Sunflowers");
    expect(sql).toContain("batch0854-0858:fact:");
    expect(sql).toContain("WHERE NOT EXISTS (SELECT 1 FROM public.import_runs");
    expect(sql).not.toContain("INSERT INTO public.gk_notes");
    expect(sql).not.toContain("INSERT INTO public.gk_mcqs");
  });
});
