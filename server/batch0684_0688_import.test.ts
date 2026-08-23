import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0684_0688.mjs";

describe("validated pages 684–688 import contract", () => {
  it("locks the reviewed range, quality-gated totals, and withheld-question boundary", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([684, 685, 686, 687, 688]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts.review_tiles).toBe(35);
    expect(counts.eligible_facts).toBe(7);
    expect(counts.eligible_notes).toBe(5);
    expect(counts.eligible_mcqs).toBe(4);
    expect(counts.eligible_mcq_options).toBe(16);
    expect(counts.withheld_mcqs).toBe(10);
    expect(counts.derived_records).toBe(16);
  });

  it("preserves only fully reconciled MCQs and batch-isolated provenance", async () => {
    const { audit, sql } = await buildBatch();
    expect(audit.verification_counts).toEqual({ verified: 11, conflicting: 0, source_attributed: 5 });
    expect(sql).toContain("‘মনট্রিয়েল প্রোটোকল’ যার সঙ্গে সম্পর্কিত-");
    expect(sql).toContain("আফিম-যুদ্ধ কোন রাষ্ট্রসমূহের মধ্যে সংঘটিত হয়েছিল?");
    expect(sql).toContain("ওয়াটার-লু যুদ্ধ কোন সালে হয়েছিল?");
    expect(sql).toContain("কোরীয় যুদ্ধ কোন সনে আরম্ভ হয়?");
    expect(sql).toContain("batch-0684-0688-quality-pipeline");
    expect(sql).toContain("batch0684-0688:mcq:");
    expect(sql).toContain("BETWEEN 684 AND 688");
  });
});
