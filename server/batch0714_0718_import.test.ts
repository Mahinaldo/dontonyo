import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0714_0718.mjs";

describe("validated pages 714–718 import contract", () => {
  it("locks the reviewed source range and conservative record totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([714, 715, 716, 717, 718]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts).toMatchObject({
      review_tiles: 35,
      eligible_facts: 3,
      eligible_notes: 0,
      eligible_mcqs: 2,
      eligible_mcq_options: 8,
      withheld_mcqs: 4,
      derived_records: 5,
    });
    expect(audit.verification_counts).toEqual({ verified: 5, conflicting: 0, source_attributed: 0 });
  });

  it("keeps only verified historic facts and fully source-keyed MCQs", async () => {
    const { sql } = await buildBatch();
    expect(sql).toContain("Bretton Woods Conference — 1944");
    expect(sql).toContain("Treaty of Versailles and World War I");
    expect(sql).toContain("প্রথম বিশ্বযুদ্ধের সমাপ্তিতে কোন চুক্তি স্বাক্ষরিত হয়?");
    expect(sql).toContain("প্রথম মহাযুদ্ধ কোন সনে শুরু হয়?");
    expect(sql).toContain("batch-0714-0718-quality-pipeline");
    expect(sql).toContain("batch0714-0718:mcq:");
    expect(sql).toContain("https://www.worldbank.org/en/archive/history/exhibits/Bretton-Woods-and-the-Birth-of-the-World-Bank");
    expect(sql).toContain("https://history.state.gov/milestones/1914-1920/paris-peace");
    expect(sql).toContain("https://history.delaware.gov/world-war-i/");
  });
});
