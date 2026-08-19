import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 519–523 Supabase import contract", () => {
  it("locks the recovered five-page boundary and preserves table anomalies without invented cells", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0519_0523.mjs"), "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [519, 520, 521, 522, 523]");
    expect(generator).toContain("Source pages 519–523 only");
    expect(generator).toContain("শাদ*");
    expect(generator).toContain("[rightmost cell unreadable]");
    expect(generator).toContain("[rightmost cell blank in image]");
    expect(generator).toContain("GPT vision fallback after earlier empty-completion errors.");
  });

  it("requires six source MCQs with four options, a verified flower claim, and a conflicting bird claim", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0519_0523.mjs"), "utf8");
    expect(generator).toContain("generated_options:mcqs.length*4");
    expect(generator).toContain('const keys=["ক","খ","গ","ঘ"]');
    expect(generator).toContain('"ভুটানের জাতীয় ফুল নীল পপি।", "verified"');
    expect(generator).toContain('"উৎসের কলআউটে ভুটানের জাতীয় পাখি কাক হিসেবে উল্লেখ করা হয়েছে।", "conflicting"');
    expect(generator).toContain("batch0519-0523:mcq:");
    expect(generator).toContain("https://nbc.gov.bt/the-national-flower-of-bhutan-found-to-be-a-new-species/");
  });
});
