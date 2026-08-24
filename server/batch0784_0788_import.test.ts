import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0784_0788.mjs";

describe("validated pages 784–788 import contract", () => {
  it("locks conservative mixed-admission totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([784, 785, 786, 787, 788]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts).toMatchObject({ review_tiles: 35, eligible_facts: 3, eligible_notes: 0, eligible_mcqs: 0, eligible_mcq_options: 0, withheld_mcqs: 9, derived_records: 3 });
    expect(audit.verification_counts).toEqual({ verified: 3, conflicting: 0, source_attributed: 0 });
  });

  it("retains batch-local provenance and verified fact contracts", async () => {
    const { sql } = await buildBatch();
    expect(sql).toContain("environmental-policy-boundary-784");
    expect(sql).toContain("literary-attribution-boundary-788");
    expect(sql).toContain("Ferdowsī — Shāh-nāmeh");
    expect(sql).toContain("William Shakespeare — Hamlet");
    expect(sql).toContain("Leo Tolstoy — War and Peace");
    expect(sql).toContain("batch0784-0788:fact:");
    expect(sql).toContain("WHERE NOT EXISTS (SELECT 1 FROM public.import_runs");
    expect(sql).not.toContain("INSERT INTO public.gk_notes");
    expect(sql).not.toContain("INSERT INTO public.gk_mcqs");
  });
});
