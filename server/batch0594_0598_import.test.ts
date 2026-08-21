import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BATCH_PAGES, PIPELINE_VERSION, buildBatch } from "../scripts/prepare_validated_batch_0594_0598.mjs";

const root = "/home/ubuntu/dontonyo";
const workDir = "/home/ubuntu/dontonyo-work/batch-0594-0598";

describe("validated pages 594–598 import contract", () => {
  it("locks the exact source range, rendered OCR audit, and complete ordered image review", async () => {
    const audit = JSON.parse(await fs.readFile(path.join(root, "supabase/batch-0594-0598/batch_audit.json"), "utf8"));
    const review = await fs.readFile(path.join(workDir, "visual_review_594_598.md"), "utf8");
    expect(BATCH_PAGES).toEqual([594, 595, 596, 597, 598]);
    expect(audit.pipeline_version).toBe(PIPELINE_VERSION);
    expect(audit.source_pages.map((page: { page: number }) => page.page)).toEqual(BATCH_PAGES);
    expect(audit.source_pages.every((page: { review_status: string }) => page.review_status === "completed_image_grounded_review")).toBe(true);
    expect(review).toContain("All 35 ordered overlap-safe tiles in pages 594–598 have been reviewed.");
    expect(review).toContain("Page 598 visual review complete");
  });

  it("imports only the source-complete, historically bounded MCQ subset", async () => {
    const { audit, sql } = await buildBatch();
    const decisions = await fs.readFile(path.join(workDir, "classification_decisions.md"), "utf8");
    const mcqSql = sql.slice(sql.indexOf("INSERT INTO public.exam_sources"), sql.indexOf("INSERT INTO public.content_tags"));
    expect(audit.generated_facts).toBe(41);
    expect(audit.generated_notes).toBe(9);
    expect(audit.generated_mcqs).toBe(8);
    expect(audit.generated_options).toBe(32);
    expect(mcqSql).toContain("ফরাসি বিপ্লব কোন সালে শুরু হয়েছিল?");
    expect(mcqSql).toContain("নেপোলিয়ন কোথায় জন্মগ্রহণ করেন?");
    expect(mcqSql).toContain("'01',3,'high'");
    expect(mcqSql).toContain("'12',3,'high'");
    expect(mcqSql).not.toContain("বাল্টি দুর্গ");
    expect(mcqSql).not.toContain("ফরাসি বিপ্লবকে অনুপ্রাণিত করেন কোন লেখকরা?");
    expect(mcqSql).not.toContain("ফরাসি বিপ্লবের সমর্থ বা প্রলয় প্রকল্প");
    expect(decisions).toContain("Q05 and Q08");
    expect(decisions).toContain("Q10–Q11");
  });

  it("preserves source-attribution and sensitive historical boundaries using only approved tag categories", async () => {
    const { audit, sql } = await buildBatch();
    const verification = await fs.readFile(path.join(workDir, "external_verification.md"), "utf8");
    expect(audit.verification_counts).toEqual({ verified: 3, conflicting: 0, source_attributed: 55 });
    expect(verification).toContain("U.S. Holocaust Memorial Museum");
    expect(verification).toContain("National Army Museum");
    expect(sql).toContain("National Socialist German Workers");
    expect(sql).toContain("Nazi-era reference — safety boundary");
    expect(sql).not.toContain("'conflicting_source'");
    expect(sql).toContain("'domain'");
    expect(sql).toContain("'quality'");
    expect(sql).toContain("'content_type'");
  });
});
