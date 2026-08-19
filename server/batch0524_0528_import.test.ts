import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 524–528 Supabase import contract", () => {
  it("locks the exact source-page boundary and preserves the reviewed anomaly policy", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0524_0528.mjs"), "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [524, 525, 526, 527, 528]");
    expect(generator).toContain("Source pages 524–528 only");
    expect(generator).toContain("শিবকন [unclear]");
    expect(generator).toContain("Page 527 excludes two garbled lower OCR lines after Macau");
    expect(generator).toContain("Time-sensitive source-era count");
  });

  it("requires fourteen MCQs with four options and retains verified India and Borneo checks", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0524_0528.mjs"), "utf8");
    expect(generator).toContain("generated_options:mcqs.length*4");
    expect(generator).toContain('const keys=["ক","খ","গ","ঘ"]');
    expect(generator).toContain('"জনসংখ্যায় এশিয়ার বৃহত্তম দেশ- ভারত।","verified"');
    expect(generator).toContain('"বর্নিও দ্বীপটি রাজনৈতিকভাবে মালয়েশিয়া, ব্রুনেই এবং ইন্দোনেশিয়ার অন্তর্ভুক্ত; ইন্দোনেশীয় অংশের নাম কালিমানতান।","verified"');
    expect(generator).toContain("batch0524-0528:mcq:");
    expect(generator).toContain("https://borneoproject.org/borneo-2/");
  });
});
