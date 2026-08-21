import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BATCH_PAGES, PIPELINE_VERSION, buildBatch } from "../scripts/prepare_validated_batch_0599_0603.mjs";

const root = "/home/ubuntu/dontonyo";
const workDir = "/home/ubuntu/dontonyo-work/batch-0599-0603";

describe("validated pages 599–603 import contract", () => {
  it("locks the exact source range, completed OCR audit, and full ordered image review", async () => {
    const audit = JSON.parse(await fs.readFile(path.join(root, "supabase/batch-0599-0603/batch_audit.json"), "utf8"));
    const review = await fs.readFile(path.join(workDir, "visual_review_599_603.md"), "utf8");
    expect(BATCH_PAGES).toEqual([599, 600, 601, 602, 603]);
    expect(audit.pipeline_version).toBe(PIPELINE_VERSION);
    expect(audit.source_pages.map((page: { page: number }) => page.page)).toEqual(BATCH_PAGES);
    expect(audit.source_pages.every((page: { review_status: string }) => page.review_status === "completed_image_grounded_review")).toBe(true);
    expect(review).toContain("All 35 ordered overlap-safe tiles in pages 599–603 have been reviewed.");
    expect(review).toContain("Page 603 visual review complete");
  });

  it("imports only source-complete and historically bounded MCQs", async () => {
    const { audit, sql } = await buildBatch();
    const decisions = await fs.readFile(path.join(workDir, "classification_decisions.md"), "utf8");
    const mcqSql = sql.slice(sql.indexOf("INSERT INTO public.exam_sources"), sql.indexOf("INSERT INTO public.content_tags"));
    expect(audit.generated_facts).toBe(38);
    expect(audit.generated_notes).toBe(8);
    expect(audit.generated_mcqs).toBe(7);
    expect(audit.generated_options).toBe(28);
    expect(mcqSql).toContain("বার্লিন প্রাচীর কোন সালে নির্মিত হয়েছিল?");
    expect(mcqSql).toContain("বিস্মার্ক কে ছিলেন?");
    expect(mcqSql).toContain("'01',3,'high'");
    expect(mcqSql).toContain("'08',3,'high'");
    expect(mcqSql).not.toContain("হিটলারের দলের নাম");
    expect(mcqSql).not.toContain("নিম্নে জার্মানির কোন রাজা");
    expect(mcqSql).not.toContain("জার্মানির প্রথম মহিলা চ্যান্সেলর কে?");
    expect(decisions).toContain("Q07, Q09, Q10, Q11, Q12");
    expect(decisions).toContain("corrupted/duplicative Nazi-party wording");
  });

  it("preserves historic scope, source-status boundaries, and explicit withholding of false source claims", async () => {
    const { audit, sql } = await buildBatch();
    const verification = await fs.readFile(path.join(workDir, "external_verification.md"), "utf8");
    expect(audit.verification_counts).toEqual({ verified: 13, conflicting: 0, source_attributed: 40 });
    expect(verification).toContain("Berlin Wall Foundation");
    expect(verification).toContain("National Security Archive");
    expect(sql).toContain("Stalin/Mussolini");
    expect(sql).toContain("Great Terror — Stalin-era historic context");
    expect(sql).not.toContain("'conflicting_source'");
    expect(sql).toContain("'domain'");
    expect(sql).toContain("'content_type'");
    expect(sql).toContain("'quality'");
  });
});
