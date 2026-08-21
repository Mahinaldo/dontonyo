import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BATCH_PAGES, PIPELINE_VERSION, buildBatch } from "../scripts/prepare_validated_batch_0604_0608.mjs";

const root = "/home/ubuntu/dontonyo";
const workDir = "/home/ubuntu/dontonyo-work/batch-0604-0608";

describe("validated pages 604–608 import contract", () => {
  it("locks the exact source range, rotated recovery, and ordered image review", async () => {
    const audit = JSON.parse(await fs.readFile(path.join(root, "supabase/batch-0604-0608/batch_audit.json"), "utf8"));
    const review = await fs.readFile(path.join(workDir, "visual_review_604_608.md"), "utf8");
    expect(BATCH_PAGES).toEqual([604, 605, 606, 607, 608]);
    expect(audit.pipeline_version).toBe(PIPELINE_VERSION);
    expect(audit.source_pages.map((page: { page: number }) => page.page)).toEqual(BATCH_PAGES);
    expect(audit.source_pages.every((page: { review_status: string }) => page.review_status === "completed_image_grounded_review")).toBe(true);
    expect(review).toContain("All 33 content-bearing/blank tiles across pages 605–608 and all 5 counterclockwise-rotated page-604 tiles were inspected in manifest order.");
    expect(review).toContain("Page 604 required the rotated OCR retry");
    expect(review).toContain("The model-credit balance no longer permits additional vision retries.");
  });

  it("imports only source-complete MCQs with printed keys and excludes unsafe questions", async () => {
    const { audit, sql } = await buildBatch();
    const decisions = await fs.readFile(path.join(workDir, "classification_decisions.md"), "utf8");
    const mcqSql = sql.slice(sql.indexOf("INSERT INTO public.exam_sources"), sql.indexOf("INSERT INTO public.content_tags"));
    expect(audit.generated_facts).toBe(18);
    expect(audit.generated_notes).toBe(6);
    expect(audit.generated_mcqs).toBe(12);
    expect(audit.generated_options).toBe(48);
    expect(mcqSql).toContain("‘পেরেস্ত্রোইকা’র উদ্ভাবক কে?");
    expect(mcqSql).toContain("বীর আলেকজান্ডারের শিক্ষক কে ছিলেন?");
    expect(mcqSql).toContain("'02',3,'high'");
    expect(mcqSql).toContain("'12',3,'high'");
    expect(mcqSql).not.toContain("রাশিয়ার পূর্বাঞ্চলের সর্ববৃহৎ শহর কোনটি?");
    expect(mcqSql).not.toContain("পৃথিবীর প্রথম সমাজতান্ত্রিক দেশের নাম কী?");
    expect(mcqSql).not.toContain("হেরোডোটাস-এর জন্মভূমি");
    expect(decisions).toContain("Q01 incomplete option");
    expect(decisions).toContain("historically inconsistent printed key");
  });

  it("keeps political and historical claims bounded with schema-safe statuses and tags", async () => {
    const { audit, sql } = await buildBatch();
    const verification = await fs.readFile(path.join(workDir, "external_verification.md"), "utf8");
    expect(audit.verification_counts).toEqual({ verified: 24, conflicting: 0, source_attributed: 12 });
    expect(verification).toContain("Italian Ministry of Defence");
    expect(verification).toContain("Republic of Armenia MFA");
    expect(sql).toContain("Italy — 1946 republic transition");
    expect(sql).toContain("Classical quotation panel — exclusion boundary");
    expect(sql).not.toContain("'conflicting_source'");
    expect(sql).toContain("'domain'");
    expect(sql).toContain("'content_type'");
    expect(sql).toContain("'quality'");
  });
});
