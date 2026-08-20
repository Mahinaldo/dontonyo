import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 549–553 import contract", () => {
  it("locks the exact source range, completed visual review, and reviewed input checksum", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0549_0553.mjs"), "utf8");
    const audit = await readFile("/home/ubuntu/dontonyo-work/batch-0549-0553/audit.json", "utf8");
    const counts = await readFile("/home/ubuntu/dontonyo-work/batch-0549-0553/import_input_counts.json", "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [549, 550, 551, 552, 553]");
    expect(generator).toContain("All 35 ordered overlapping dense-image tiles were reviewed.");
    expect(audit).toContain('"completed_pages": 5');
    expect(audit).toContain('"failed_pages": 0');
    expect(counts).toContain('"eligible_mcqs": 12');
    expect(counts).toContain('"eligible_mcq_options": 48');
  });

  it("imports only reviewed MCQs with a single printed key and withholds unsafe source material", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0549_0553.mjs"), "utf8");
    expect(generator).toContain("Every imported MCQ has four visually reviewed source options and one printed key.");
    expect(generator).toContain('mcq(549, "02"');
    expect(generator).toContain('mcq(549, "11"');
    expect(generator).toContain('mcq(551, "03"');
    expect(generator).toContain('mcq(552, "04"');
    expect(generator).not.toContain('mcq(549, "01"');
    expect(generator).not.toContain('mcq(549, "05"');
    expect(generator).not.toContain('mcq(549, "06"');
    expect(generator).not.toContain('mcq(549, "07"');
    expect(generator).not.toContain('mcq(551, "01"');
    expect(generator).not.toContain('mcq(551, "02"');
    expect(generator).not.toContain('mcq(551, "04"');
    expect(generator).not.toContain('mcq(551, "05"');
    expect(generator).toContain("generated_options: mcqs.length * 4");
  });

  it("preserves official sources and explicit source-status caveats for sensitive content", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0549_0553.mjs"), "utf8");
    expect(generator).toContain("https://history.state.gov/historicaldocuments/frus1955-57v22/d157");
    expect(generator).toContain("https://2001-2009.state.gov/outofdate/bgn/m/26156.htm");
    expect(generator).toContain("https://www.unrwa.org/what-mandate-unrwa-0");
    expect(generator).toContain("https://www.un.org/unispal/document/auto-insert-187149/");
    expect(generator).toContain("source-attributed");
    expect(generator).toContain("conflicting-source");
    expect(generator).toContain("politically sensitive Palestine material");
  });
});
