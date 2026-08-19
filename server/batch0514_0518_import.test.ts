import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 514–518 Supabase import contract", () => {
  it("locks the reviewed five-page source boundary and keeps historical and institutional tables as structured notes", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0514_0518.mjs"), "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [514, 515, 516, 517, 518]");
    expect(generator).toContain("Source pages 514–518 only");
    expect(generator).toContain('note(515, "দেশের পূর্বনাম ও বর্তমান নাম"');
    expect(generator).toContain('note(517, "বিভিন্ন দেশের বিখ্যাত বাসভবন"');
    expect(generator).toContain('note(518, "বিভিন্ন দেশের সচিবালয়"');
    expect(generator).toContain("ON CONFLICT (canonical_hash)");
  });

  it("requires all source MCQs, four options, printed answer keys, correction metadata, and explicit conflicting evidence", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0514_0518.mjs"), "utf8");
    expect(generator).toContain("generated_options:mcqs.length*4");
    expect(generator).toContain('const keys=["ক","খ","গ","ঘ"]');
    expect(generator).toContain('"স্টেট ডুমা যে দেশের আইনসভা-"');
    expect(generator).toContain('"ফ্লাশিং মিডোস, নিউইয়র্ককে জাতিসংঘের মূল সভাস্থল হিসেবে উৎসে উল্লেখ করা হয়েছে।", "conflicting"');
    expect(generator).toContain("batch0514-0518:mcq:");
    expect(generator).toContain("https://www.un.org/en/exhibits/page/about-us");
    expect(generator).toContain("তুসাসিক");
  });
});
