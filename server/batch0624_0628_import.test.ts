import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BATCH_PAGES, PIPELINE_VERSION, buildBatch } from "../scripts/prepare_validated_batch_0624_0628.mjs";

const root = "/home/ubuntu/dontonyo";
const workDir = "/home/ubuntu/dontonyo-work/batch-0624-0628";

describe("validated pages 624–628 import contract", () => {
  it("locks the exact range, 35 ordered review tiles, and upright local OCR provenance", async () => {
    const audit = JSON.parse(await fs.readFile(path.join(root, "supabase/batch-0624-0628/batch_audit.json"), "utf8"));
    const review = await fs.readFile(path.join(workDir, "visual_review_624_628.md"), "utf8");
    expect(BATCH_PAGES).toEqual([624, 625, 626, 627, 628]);
    expect(audit.pipeline_version).toBe(PIPELINE_VERSION);
    expect(audit.source_pages.map((page: { page: number }) => page.page)).toEqual(BATCH_PAGES);
    expect(audit.source_pages.every((page: { review_status: string }) => page.review_status === "completed_image_grounded_review")).toBe(true);
    expect(review).toContain("All 35 overlap-safe tiles were reviewed in exact manifest order");
    expect(audit.source_anomalies.join(" ")).toContain("upright local OCR");
  });

  it("imports only complete source-keyed MCQs and excludes unsafe or false premises", async () => {
    const { audit, sql } = await buildBatch();
    const decisions = await fs.readFile(path.join(workDir, "classification_decisions.md"), "utf8");
    const mcqSql = sql.slice(sql.indexOf("INSERT INTO public.exam_sources"), sql.indexOf("INSERT INTO public.content_tags"));
    expect(audit.generated_facts).toBe(22);
    expect(audit.generated_notes).toBe(5);
    expect(audit.generated_mcqs).toBe(12);
    expect(audit.generated_options).toBe(48);
    expect(mcqSql).toContain("দারফুর অঞ্চলটি কেন সুপরিচিত");
    expect(mcqSql).toContain("উগান্ডা কবে স্বাধীনতা অর্জন করে");
    expect(mcqSql).toContain("Which is the official name of Nigeria");
    expect(mcqSql).not.toContain("গাদ্দাফি-বিরোধী আন্দোলনের জন্য");
    expect(mcqSql).not.toContain("বাংলাকে অন্যতম রাষ্ট্রভাষার মর্যাদা");
    expect(mcqSql).not.toContain("জনসংখ্যার দিক দিয়ে আফ্রিকার বৃহত্তম দেশ");
    expect(decisions).toContain("Q02, Q09, and Q11 are withheld");
    expect(decisions).toContain("Bangla has state-language status in Sierra Leone");
  });

  it("uses schema-safe verification statuses and allowed tag categories with a derived record per approved entity", async () => {
    const { audit, sql } = await buildBatch();
    const verification = await fs.readFile(path.join(workDir, "external_verification.md"), "utf8");
    expect(audit.verification_counts).toEqual({ verified: 14, conflicting: 0, source_attributed: 25 });
    expect(audit.generated_flashcards).toBe(39);
    expect(verification).toContain("Libya and Operation Unified Protector");
    expect(verification).toContain("Sierra Leone Bangla-language claim");
    expect(sql).not.toContain("conflicting_source");
    expect(sql).toContain("'domain'");
    expect(sql).toContain("'content_type'");
    expect(sql).toContain("'quality'");
    expect(sql).toContain("'exam_source'");
    expect(sql).not.toContain("'country'");
    expect(sql).toContain("batch0624-0628:note:");
    expect(sql).toContain("batch0624-0628:mcq:");
  });
});
