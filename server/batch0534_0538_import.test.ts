import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 534–538 import contract", () => {
  it("locks the exact five-page source boundary and reviewed visual anomalies", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0534_0538.mjs"), "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [534, 535, 536, 537, 538]");
    expect(generator).toContain("Physical PDF pages 534–538 retain book footers 477–481.");
    expect(generator).toContain("Pages 535, 536, and 538 retain only MCQs whose question and all four visually reviewed options are available; page 536 questions 26 and 27 are withheld because an option is unreadable.");
    expect(generator).toContain("Page 537 preserves reviewed 1931 Iqbal and 1979 Sharia readings");
  });

  it("requires source-complete MCQs with all four options and the printed visual answer-key corrections", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0534_0538.mjs"), "utf8");
    expect(generator).toContain('mcq(535,"12","ভারত কর্তৃক সিকিম সংযুক্ত হয়-",["১৯৭০","১৯৭২","১৯৭৫","১৯৭৭"],"গ"');
    expect(generator).toContain('mcq(536,"31","সাউথ এশিয়ান বিশ্ববিদ্যালয় কোথায় অবস্থিত?",["বাংলাদেশ","ভারত","নেপাল","ভুটান"],"খ"');
    expect(generator).toContain("generated_options: mcqs.length * 4");
    expect(generator).toContain("gk_mcq_options");
    expect(generator).toContain("Printed answer key retained as source-attributed material");
  });

  it("records selected direct corroboration and preserves the Dehradun error as a conflict", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0534_0538.mjs"), "utf8");
    expect(generator).toContain("দেরাদুনের অবস্থান (source-printed conflicting statement)");
    expect(generator).toContain('"conflicting", "medium"');
    expect(generator).toContain("https://www.nobelprize.org/prizes/physics/1979/salam/biographical/");
    expect(generator).toContain("https://www.nobelprize.org/prizes/peace/2014/yousafzai/facts/");
    expect(generator).toContain("https://www.sikkim.gov.in/departments/sikkim-legislative-assembly");
  });
});
