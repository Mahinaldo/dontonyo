import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BATCH_PAGES, PIPELINE_VERSION, buildBatch } from "../scripts/prepare_validated_batch_0619_0623.mjs";

const root = "/home/ubuntu/dontonyo";
const workDir = "/home/ubuntu/dontonyo-work/batch-0619-0623";

describe("validated pages 619–623 import contract", () => {
  it("locks the exact range, all 35 ordered tiles, and reconciled upright source recovery", async () => {
    const audit = JSON.parse(await fs.readFile(path.join(root, "supabase/batch-0619-0623/batch_audit.json"), "utf8"));
    const review = await fs.readFile(path.join(workDir, "visual_review_619_623.md"), "utf8");
    expect(BATCH_PAGES).toEqual([619, 620, 621, 622, 623]);
    expect(audit.pipeline_version).toBe(PIPELINE_VERSION);
    expect(audit.source_pages.map((page: { page: number }) => page.page)).toEqual(BATCH_PAGES);
    expect(audit.source_pages.every((page: { review_status: string }) => page.review_status === "completed_image_grounded_review")).toBe(true);
    expect(review).toContain("All 35 overlap-safe tiles were reviewed in exact manifest order");
    expect(audit.source_anomalies.join(" ")).toContain("already upright");
  });

  it("imports only complete printed-key MCQs and withholds unsafe source premises", async () => {
    const { audit, sql } = await buildBatch();
    const decisions = await fs.readFile(path.join(workDir, "classification_decisions.md"), "utf8");
    const mcqSql = sql.slice(sql.indexOf("INSERT INTO public.exam_sources"), sql.indexOf("INSERT INTO public.content_tags"));
    expect(audit.generated_facts).toBe(24);
    expect(audit.generated_notes).toBe(5);
    expect(audit.generated_mcqs).toBe(17);
    expect(audit.generated_options).toBe(68);
    expect(mcqSql).toContain("লং ওয়াক টু ফ্রিডম গ্রন্থের রচয়িতা");
    expect(mcqSql).toContain("মিসর সুয়েজ খাল জাতীয়করণ করেছিল");
    expect(mcqSql).toContain("মিসরে রাজতন্ত্রের অবসান ঘটে কবে");
    expect(mcqSql).not.toContain("দক্ষিণ আফ্রিকার প্রধান আদিবাসীদের নাম কী");
    expect(mcqSql).not.toContain("মিসরের প্রেসিডেন্ট ড. মুরসির দলের নাম কী ছিল");
    expect(mcqSql).not.toContain("মিশর যে দেশের উপনিবেশ ছিল");
    expect(mcqSql).not.toContain("ব্রাদারহুড কোন দেশের রাজনৈতিক দল");
    expect(decisions).toContain("Q04 and Q05 are withheld");
    expect(decisions).toContain("Morsi-party MCQ is withheld");
  });

  it("uses schema-safe statuses, allowed tag categories, and derived records for every approved entity", async () => {
    const { audit, sql } = await buildBatch();
    const verification = await fs.readFile(path.join(workDir, "external_verification.md"), "utf8");
    expect(audit.verification_counts).toEqual({ verified: 39, conflicting: 0, source_attributed: 7 });
    expect(audit.generated_flashcards).toBe(46);
    expect(verification).toContain("Suez Canal Authority");
    expect(verification).toContain("Freedom and Justice Party");
    expect(sql).not.toContain("conflicting_source");
    expect(sql).toContain("'domain'");
    expect(sql).toContain("'content_type'");
    expect(sql).toContain("'quality'");
    expect(sql).toContain("'exam_source'");
    expect(sql).not.toContain("'country'");
    expect(sql).toContain("batch0619-0623:note:");
    expect(sql).toContain("batch0619-0623:mcq:");
  });
});
