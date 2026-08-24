import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0789_0793.mjs";

describe("validated pages 789–793 import contract", () => {
  it("locks conservative mixed-admission totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([789, 790, 791, 792, 793]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts).toMatchObject({ review_tiles: 35, eligible_facts: 3, eligible_notes: 0, eligible_mcqs: 0, eligible_mcq_options: 0, withheld_mcqs: 0, derived_records: 3 });
    expect(audit.verification_counts).toEqual({ verified: 3, conflicting: 0, source_attributed: 0 });
  });

  it("retains batch-local provenance and verified fact contracts", async () => {
    const { sql } = await buildBatch();
    expect(sql).toContain("philosophy-boundary-789");
    expect(sql).toContain("politics-economics-boundary-793");
    expect(sql).toContain("Isaac Newton — three laws of motion");
    expect(sql).toContain("Charles Darwin — On the Origin of Species");
    expect(sql).toContain("Stephen Hawking — A Brief History of Time");
    expect(sql).toContain("batch0789-0793:fact:");
    expect(sql).toContain("WHERE NOT EXISTS (SELECT 1 FROM public.import_runs");
    expect(sql).not.toContain("INSERT INTO public.gk_notes");
    expect(sql).not.toContain("INSERT INTO public.gk_mcqs");
  });
});
