import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0699_0703.mjs";

describe("validated pages 699–703 import contract", () => {
  it("locks the reviewed range and conservative content totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([699, 700, 701, 702, 703]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts).toMatchObject({ review_tiles: 35, eligible_facts: 6, eligible_notes: 5, eligible_mcqs: 10, eligible_mcq_options: 40, withheld_mcqs: 14, derived_records: 21 });
    expect(audit.verification_counts).toEqual({ verified: 16, conflicting: 0, source_attributed: 5 });
  });

  it("keeps only source-keyed, authority-backed candidates with batch-local provenance", async () => {
    const { sql } = await buildBatch();
    expect(sql).toContain("ইউ.এন.সি.এইচ.ই.");
    expect(sql).toContain("কার্টাগোনা প্রটোকল");
    expect(sql).toContain("batch-0699-0703-quality-pipeline");
    expect(sql).toContain("batch0699-0703:mcq:");
    expect(sql).toContain("BETWEEN 699 AND 703");
  });
});
