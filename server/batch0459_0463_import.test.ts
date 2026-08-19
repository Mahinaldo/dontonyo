import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("validated pages 459–463 Supabase import contract", () => {
  it("locks the user-authorized range and preserves the physical-page audit boundary", async () => {
    const generator = await readFile(path.join(projectRoot, "scripts/prepare_validated_batch_0459_0463.mjs"), "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [459, 460, 461, 462, 463]");
    expect(generator).toContain("Do not extend this batch without explicit user instruction");
    expect(generator).toContain("physical_source_page");
    expect(generator).toContain("page_number_mismatch");
    expect(generator).toContain("WHERE NOT EXISTS");
    expect(generator).toContain("ON CONFLICT (canonical_hash)");
  });

  it("preserves both verified and conflicting claims without silently normalizing the batch MCQs", async () => {
    const generator = await readFile(path.join(projectRoot, "scripts/prepare_validated_batch_0459_0463.mjs"), "utf8");
    expect(generator).toContain("verificationUrls.btrc");
    expect(generator).toContain("verificationUrls.surjya");
    expect(generator).toContain("conflicting-verification");
    expect(generator).toContain("'সূর্যদীঘল বাড়ী' চলচ্চিত্রের পরিচালক কে?");
    expect(generator).toContain("generated_options: mcqs.length * 4");
  });
});
