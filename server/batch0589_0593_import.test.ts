import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BATCH_PAGES, PIPELINE_VERSION, buildBatch } from "../scripts/prepare_validated_batch_0589_0593.mjs";

const root = "/home/ubuntu/dontonyo";
const workDir = "/home/ubuntu/dontonyo-work/batch-0589-0593";

describe("validated pages 589–593 import contract", () => {
  it("locks the exact source range, successful OCR audit, and full ordered image review", async () => {
    const audit = JSON.parse(await fs.readFile(path.join(root, "supabase/batch-0589-0593/batch_audit.json"), "utf8"));
    const review = await fs.readFile(path.join(workDir, "visual_review_589_593.md"), "utf8");
    expect(BATCH_PAGES).toEqual([589, 590, 591, 592, 593]);
    expect(audit.pipeline_version).toBe(PIPELINE_VERSION);
    expect(audit.source_pages.map((page: { page: number }) => page.page)).toEqual(BATCH_PAGES);
    expect(audit.source_pages.every((page: { review_status: string }) => page.review_status === "completed_image_grounded_review")).toBe(true);
    expect(review).toContain("All 35 ordered overlap-safe tiles in pages 589–593 have been reviewed.");
    expect(review).toContain("Page 593 visual review complete");
  });

  it("imports only source-complete MCQs and withholds all unsafe source-question decisions", async () => {
    const { audit, sql } = await buildBatch();
    const decisions = await fs.readFile(path.join(workDir, "classification_decisions.md"), "utf8");
    expect(audit.generated_facts).toBe(14);
    expect(audit.generated_notes).toBe(5);
    expect(audit.generated_mcqs).toBe(18);
    expect(audit.generated_options).toBe(72);
    expect(sql).toContain("শিল্প বিপ্লব সংঘটিত হয় কোন শতকে?");
    expect(sql).toContain("‘Workshop of the World’ বলা হতো—");
    expect(sql).toContain(",'02',3,");
    expect(sql).toContain(",'26',3,");
    expect(sql).not.toContain(",'01',3,");
    expect(sql).not.toContain(",'09',3,");
    expect(sql).not.toContain(",'14',3,");
    expect(sql).not.toContain(",'24',3,");
    expect(decisions).toContain("Corrupted/duplicated option text");
    expect(decisions).toContain("historically and socially reductive");
  });

  it("preserves verification status boundaries and maps the conflict ledger label to the permitted database value", async () => {
    const { audit, sql } = await buildBatch();
    const verification = await fs.readFile(path.join(workDir, "external_verification.md"), "utf8");
    expect(audit.verification_counts).toEqual({ verified: 12, conflicting: 1, source_attributed: 24 });
    expect(verification).toContain("false 21 January 1793 Robespierre line");
    expect(verification).toContain("Robespierre founded the club");
    expect(sql).toContain("'conflicting'");
    expect(sql).not.toContain("'conflicting_source'::confidence_level");
    expect(sql).toContain("category,description");
    expect(sql).toContain("'domain'");
  });
});
