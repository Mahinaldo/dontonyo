import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BATCH_PAGES, PIPELINE_VERSION, buildBatch } from "../scripts/prepare_validated_batch_0609_0613.mjs";

const root = "/home/ubuntu/dontonyo";
const workDir = "/home/ubuntu/dontonyo-work/batch-0609-0613";

describe("validated pages 609–613 import contract", () => {
  it("locks the exact range, all 35 ordered tiles, and readable clockwise recovery", async () => {
    const audit = JSON.parse(await fs.readFile(path.join(root, "supabase/batch-0609-0613/batch_audit.json"), "utf8"));
    const review = await fs.readFile(path.join(workDir, "visual_review_609_613.md"), "utf8");
    expect(BATCH_PAGES).toEqual([609, 610, 611, 612, 613]);
    expect(audit.pipeline_version).toBe(PIPELINE_VERSION);
    expect(audit.source_pages.map((page: { page: number }) => page.page)).toEqual(BATCH_PAGES);
    expect(audit.source_pages.every((page: { review_status: string }) => page.review_status === "completed_image_grounded_review")).toBe(true);
    expect(review).toContain("All 35 ordered overlap-safe tiles");
    expect(review).toContain("clockwise** recovery copy");
    expect(review).toContain("former Yugoslavia timeline/map");
  });

  it("imports only complete printed-key MCQs and withholds unsafe Spain/Catalonia questions", async () => {
    const { audit, sql } = await buildBatch();
    const decisions = await fs.readFile(path.join(workDir, "classification_decisions.md"), "utf8");
    const mcqSql = sql.slice(sql.indexOf("INSERT INTO public.exam_sources"), sql.indexOf("INSERT INTO public.content_tags"));
    expect(audit.generated_facts).toBe(27);
    expect(audit.generated_notes).toBe(6);
    expect(audit.generated_mcqs).toBe(8);
    expect(audit.generated_options).toBe(32);
    expect(mcqSql).toContain("‘The lady with the Lamp’ নামে পরিচিত");
    expect(mcqSql).toContain("ভ্যাটিকান কী?");
    expect(mcqSql).not.toContain("CATA কোন অঞ্চল স্বাধীনতার জন্য বর্তমানে আন্দোলন করছে?");
    expect(mcqSql).not.toContain("Light House of the Europe");
    expect(decisions).toContain("Spain/Catalonia Q01–Q04");
    expect(decisions).toContain("current-Pope material");
  });

  it("uses only schema-safe verification statuses and allowed tag categories", async () => {
    const { audit, sql } = await buildBatch();
    const verification = await fs.readFile(path.join(workDir, "external_verification.md"), "utf8");
    expect(audit.verification_counts).toEqual({ verified: 31, conflicting: 0, source_attributed: 10 });
    expect(verification).toContain("U.S. Office of the Historian");
    expect(verification).toContain("Official Nordic Cooperation");
    expect(sql).not.toContain("conflicting_source");
    expect(sql).toContain("'domain'");
    expect(sql).toContain("'content_type'");
    expect(sql).toContain("'quality'");
    expect(sql).not.toContain("'country'");
  });
});
