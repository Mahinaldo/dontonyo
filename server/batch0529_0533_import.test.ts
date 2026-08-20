import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 529–533 Supabase import contract", () => {
  it("locks the exact source-page boundary and the reviewed anomaly policy", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0529_0533.mjs"), "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [529, 530, 531, 532, 533]");
    expect(generator).toContain("Source pages 529–533 only");
    expect(generator).toContain("দৌহিত্র");
    expect(generator).toContain("Page 533 is accepted with flags and low confidence");
    expect(generator).toContain("unreadable map labels and broken table alignments are not reconstructed into facts");
  });

  it("requires explicit verified, conflicting, and source-attributed records with citation evidence", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0529_0533.mjs"), "utf8");
    expect(generator).toContain('"মাদার তেরেসার নোবেল শান্তি পুরস্কার", "মাদার তেরেসা ১৯৭৯ সালে নোবেল শান্তি পুরস্কার লাভ করেন।", "verified"');
    expect(generator).toContain('"রাজীব গান্ধীর হত্যাকাণ্ড", "রাজীব গান্ধী ২১ মে ১৯৯১ সালে LTTE-সংশ্লিষ্ট আত্মঘাতী বোমা হামলায় নিহত হন।", "verified"');
    expect(generator).toContain('"মনমোহন সিংয়ের মেয়াদ (source-printed conflicting date)"');
    expect(generator).toContain('"conflicting", "medium", [refs.pmManmohan]');
    expect(generator).toContain("https://www.nobelprize.org/prizes/economic-sciences/1998/summary/");
    expect(generator).toContain("https://www.pmindia.gov.in/en/former_pm/dr-manmohan-singh-2/");
  });

  it("imports no invented MCQs while still deriving auditable study records", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0529_0533.mjs"), "utf8");
    expect(generator).toContain("generated_mcqs: 0");
    expect(generator).toContain("generated_options: 0");
    expect(generator).toContain("batch0529-0533:fact:");
    expect(generator).toContain("batch0529-0533:note:");
    expect(generator).toContain("fact_verifications");
  });
});
