import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 509–513 Supabase import contract", () => {
  it("locks the consecutive five-page boundary and retains table content as notes separate from facts and MCQs", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0509_0513.mjs"), "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [509, 510, 511, 512, 513]");
    expect(generator).toContain("The next batch begins at page 514");
    expect(generator).toContain('note(510, "ভাষা ও ভাষার ব্যবহারকারী দেশ"');
    expect(generator).toContain('note(512, "এক কক্ষবিশিষ্ট আইনসভা"');
    expect(generator).toContain('note(513, "দ্বি-কক্ষ বিশিষ্ট আইনসভা"');
    expect(generator).toContain("ON CONFLICT (canonical_hash)");
  });

  it("requires source-preserved MCQ options, answer keys, verification states, and stable derived keys", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0509_0513.mjs"), "utf8");
    expect(generator).toContain("generated_options: mcqs.length * 4");
    expect(generator).toContain('const keys = ["ক", "খ", "গ", "ঘ"]');
    expect(generator).toContain('"পেলাউর রাজধানী"');
    expect(generator).toContain('"সিয়েরা লিওনে অন্যতম রাষ্ট্রভাষা হিসেবে স্বীকৃতি পায়- বাংলা ভাষা।", "conflicting"');
    expect(generator).toContain("batch0509-0513:mcq:");
    expect(generator).toContain("https://www.bssnews.net/fact-check/248438");
    expect(generator).toContain("https://commonslibrary.parliament.uk/myanmar-military-takeover-and-international-response/");
  });
});
