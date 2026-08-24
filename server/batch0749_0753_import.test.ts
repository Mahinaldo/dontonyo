import { describe, expect, it } from "vitest";
import { BATCH_PAGES, buildBatch } from "../scripts/prepare_validated_batch_0749_0753.mjs";
describe("validated pages 749–753 import contract", () => {
  it("locks provenance-only totals", async () => { const { audit, counts } = await buildBatch(); expect(BATCH_PAGES).toEqual([749,750,751,752,753]); expect(audit.source_pages).toHaveLength(5); expect(counts).toMatchObject({ review_tiles:35,eligible_facts:0,eligible_notes:0,eligible_mcqs:0,eligible_mcq_options:0,withheld_mcqs:0,derived_records:0 }); expect(audit.verification_counts).toEqual({ verified:0,conflicting:0,source_attributed:0 }); });
  it("retains only batch-local provenance", async () => { const { sql } = await buildBatch(); expect(sql).toContain("un-examination-boundary-749"); expect(sql).toContain("commonwealth-boundary-753"); expect(sql).toContain("BETWEEN 749 AND 753"); expect(sql).not.toContain("INSERT INTO public.gk_facts"); expect(sql).not.toContain("INSERT INTO public.gk_notes"); expect(sql).not.toContain("INSERT INTO public.gk_mcqs"); expect(sql).not.toContain("INSERT INTO public.fact_verifications"); });
});
