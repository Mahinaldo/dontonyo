import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0719_0723.mjs";

describe("validated pages 719–723 import contract", () => {
  it("locks the reviewed source range and conservative record totals", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([719, 720, 721, 722, 723]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts).toMatchObject({
      review_tiles: 35,
      eligible_facts: 3,
      eligible_notes: 0,
      eligible_mcqs: 2,
      eligible_mcq_options: 8,
      withheld_mcqs: 14,
      derived_records: 5,
    });
    expect(audit.verification_counts).toEqual({ verified: 5, conflicting: 0, source_attributed: 0 });
  });

  it("keeps only verified historic facts and fully source-keyed MCQs", async () => {
    const { sql } = await buildBatch();
    expect(sql).toContain("Second World War — start date");
    expect(sql).toContain("Second World War — formal end date");
    expect(sql).toContain("United Nations — official beginning");
    expect(sql).toContain("দ্বিতীয় বিশ্বযুদ্ধ কখন শুরু হয়?");
    expect(sql).toContain("দ্বিতীয় বিশ্বযুদ্ধ শেষ হয়-");
    expect(sql).toContain("batch-0719-0723-quality-pipeline");
    expect(sql).toContain("batch0719-0723:mcq:");
    expect(sql).toContain("https://www.fdrlibrary.org/wwii-facts");
    expect(sql).toContain("https://encyclopedia.ushmm.org/content/en/article/world-war-ii-key-dates");
    expect(sql).toContain("https://www.un.org/en/about-us/history-of-the-un");
  });
});
