import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0689_0693.mjs";

describe("validated pages 689–693 import contract", () => {
  it("locks the reviewed range, conservative content totals, and no-MCQ boundary", async () => {
    const { audit, counts } = await buildBatch();
    expect(BATCH_PAGES).toEqual([689, 690, 691, 692, 693]);
    expect(audit.source_pages).toHaveLength(5);
    expect(counts.review_tiles).toBe(35);
    expect(counts.eligible_facts).toBe(1);
    expect(counts.eligible_notes).toBe(5);
    expect(counts.eligible_mcqs).toBe(0);
    expect(counts.eligible_mcq_options).toBe(0);
    expect(counts.withheld_mcqs).toBe(0);
    expect(counts.derived_records).toBe(6);
  });

  it("preserves the ICRC-verified Geneva chronology and batch-isolated safety boundary", async () => {
    const { audit, sql } = await buildBatch();
    expect(audit.verification_counts).toEqual({ verified: 1, conflicting: 0, source_attributed: 5 });
    expect(sql).toContain("Geneva Conventions — 1949 structure");
    expect(sql).toContain("Security-sensitive arms-control, nuclear-policy, territorial, diplomatic");
    expect(sql).toContain("batch-0689-0693-quality-pipeline");
    expect(sql).toContain("batch0689-0693:fact:");
    expect(sql).toContain("BETWEEN 689 AND 693");
    expect(sql).not.toContain("correct_option=EXCLUDED.correct_option");
  });
});
