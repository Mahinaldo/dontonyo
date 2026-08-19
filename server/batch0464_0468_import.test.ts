import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("validated pages 464–468 Supabase import contract", () => {
  it("locks the user-authorized source boundary and persists content-type separation", async () => {
    const generator = await readFile(path.join(projectRoot, "scripts/prepare_validated_batch_0464_0468.mjs"), "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [464, 465, 466, 467, 468]");
    expect(generator).toContain("Do not extend this batch without explicit user instruction");
    expect(generator).toContain("nested_artifact_page_number");
    expect(generator).toContain("biography");
    expect(generator).toContain("table");
    expect(generator).toContain("definition");
    expect(generator).toContain("ON CONFLICT (canonical_hash)");
  });

  it("preserves the printed conflicting claims and complete four-option MCQs", async () => {
    const generator = await readFile(path.join(projectRoot, "scripts/prepare_validated_batch_0464_0468.mjs"), "utf8");
    expect(generator).toContain("স্যার রোনাল্ড");
    expect(generator).toContain("sর্বপ্রথম টেলিফোন ব্যবস্থা".replace("s", "স"));
    expect(generator).toContain("conflicting-verification");
    expect(generator).toContain("generated_options: mcqs.length * 4");
    expect(generator).toContain("WHERE NOT EXISTS");
  });
});
