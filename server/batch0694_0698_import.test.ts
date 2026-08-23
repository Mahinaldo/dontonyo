import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0694_0698.mjs";

describe("validated pages 694–698 import contract", () => {
  it("locks the reviewed range and conservative content totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([694, 695, 696, 697, 698]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts.review_tiles).toBe(35);
    expect(counts.eligible_facts).toBe(3);
    expect(counts.eligible_notes).toBe(5);
    expect(counts.eligible_mcqs).toBe(3);
    expect(counts.eligible_mcq_options).toBe(12);
    expect(counts.withheld_mcqs).toBe(13);
    expect(counts.derived_records).toBe(11);
  });

  it("preserves only reviewed, authority-backed MCQs with batch-local provenance", async () => {
    const { audit, sql } = await buildBatch();
    expect(audit.verification_counts).toEqual({ verified: 6, conflicting: 0, source_attributed: 5 });
    expect(sql).toContain("সার্বজনীন মানবাধিকার ঘোষণা");
    expect(sql).toContain("কোন চুক্তির মাধ্যমে ইউরোপের “Thirty year’s war” এর সমাপ্তি ঘটে?");
    expect(sql).toContain("নারীর প্রতি সকল রকম বৈষম্য নির্মূল কনভেনশন স্বাক্ষরিত হয়-");
    expect(sql).toContain("batch-0694-0698-quality-pipeline");
    expect(sql).toContain("batch0694-0698:mcq:");
    expect(sql).toContain("BETWEEN 694 AND 698");
  });
});
