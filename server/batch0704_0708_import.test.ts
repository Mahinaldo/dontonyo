import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0704_0708.mjs";

describe("validated pages 704–708 import contract", () => {
  it("locks the reviewed range and conservative content totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([704, 705, 706, 707, 708]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts).toMatchObject({
      review_tiles: 35,
      eligible_facts: 5,
      eligible_notes: 0,
      eligible_mcqs: 5,
      eligible_mcq_options: 20,
      withheld_mcqs: 21,
      derived_records: 10,
    });
    expect(audit.verification_counts).toEqual({ verified: 10, conflicting: 0, source_attributed: 0 });
  });

  it("keeps only complete, printed-keyed, authority-backed candidates with batch-local provenance", async () => {
    const { sql } = await buildBatch();
    expect(sql).toContain("১৯৯৫ সালে প্রথম COP সম্মেলন অনুষ্ঠিত হয় কোন শহরে?");
    expect(sql).toContain("জার্মানির বার্লিন");
    expect(sql).toContain("https://www.un.org/en/conferences/environment/stockholm1972");
    expect(sql).toContain("batch-0704-0708-quality-pipeline");
    expect(sql).toContain("batch0704-0708:mcq:");
    expect(sql).toContain("BETWEEN 704 AND 708");
    expect(sql.match(/INSERT INTO public\.gk_mcqs/g)).toHaveLength(5);
    expect(sql).not.toContain("INSERT INTO public.gk_notes");
  });
});
