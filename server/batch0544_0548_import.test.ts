import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 544–548 import contract", () => {
  it("locks the exact five-page boundary and page-548 recovery provenance", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0544_0548.mjs"), "utf8");
    const audit = await readFile("/home/ubuntu/dontonyo-work/batch-0544-0548/audit.json", "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [544, 545, 546, 547, 548]");
    expect(generator).toContain("Physical PDF pages 544–548 have printed footers 847–491");
    expect(generator).toContain("Page 548 was recovered by a targeted gpt-5-mini retry at 200 DPI after three earlier empty-completion failures.");
    expect(audit).toContain("Targeted gpt-5-mini retry at 200 DPI after three earlier empty-completion failures.");
    expect(audit).toContain('"completed_pages": 5');
    expect(audit).toContain('"failed_pages": 0');
  });

  it("requires four source options and a single printed key for every imported MCQ", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0544_0548.mjs"), "utf8");
    expect(generator).toContain("Every imported MCQ has four reviewed source options and one printed correct key.");
    expect(generator).toContain("Maldives page 544 MCQ Q4 is withheld because its printed answer key is * rather than a single answer.");
    expect(generator).not.toContain('mcq(544, "04"');
    expect(generator).not.toContain('mcq(544, "4"');
    expect(generator).toContain('mcq(544, "01"');
    expect(generator).toContain('mcq(546, "05"');
    expect(generator).toContain("generated_options: mcqs.length * 4");
  });

  it("preserves direct corroboration and status-marks sensitive source material", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0544_0548.mjs"), "utf8");
    expect(generator).toContain("https://history.state.gov/historicaldocuments/frus1969-76v42/d70");
    expect(generator).toContain("https://history.state.gov/historicaldocuments/frus1961-63v23/d49");
    expect(generator).toContain("https://www.hrw.org/report/2021/06/07/island-jail-middle-sea/bangladeshs-relocation-rohingya-refugees-bhasan-char");
    expect(generator).toContain("The unclear ‘মাউ মাউ’ general-name reading is withheld from independent factual import.");
    expect(generator).toContain("The unusual ‘The Tiger of Bicycle’ phrase is preserved only in the Vietnam source note");
    expect(generator).toContain("source-attributed material");
  });
});
