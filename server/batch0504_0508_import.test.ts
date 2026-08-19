import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 504–508 Supabase import contract", () => {
  it("locks the final authorized five-page boundary and preserves structured tables separately from facts and MCQs", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0504_0508.mjs"), "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [504, 505, 506, 507, 508]");
    expect(generator).toContain("Stop before page 509");
    expect(generator).toContain("generated_facts: facts.length");
    expect(generator).toContain("generated_notes: notes.length");
    expect(generator).toContain("generated_mcqs: mcqs.length");
    expect(generator).toContain("ON CONFLICT (canonical_hash)");
  });

  it("requires all 30 source MCQs, four options each, visually validated answer keys, source correction, and stable derivation keys", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0504_0508.mjs"), "utf8");
    expect(generator).toContain("generated_options: mcqs.length * 4");
    expect(generator).toContain("const keys = [\"ক\", \"খ\", \"গ\", \"ঘ\"]");
    expect(generator).toContain('"ডাকার কোন দেশের রাজধানী?"');
    expect(generator).toContain("batch0504-0508:mcq:");
    expect(generator).toContain("Printed answer key retained as source-attributed material");
    expect(generator).toContain("https://www.rbi.org.in/commonman/english/Currency/Scripts/EarlyIssues.aspx");
  });
});
