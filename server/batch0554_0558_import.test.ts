import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 554–558 import contract", () => {
  it("locks the exact source range, OCR audit, visual review, and reviewed input checksum", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0554_0558.mjs"), "utf8");
    const audit = await readFile("/home/ubuntu/dontonyo-work/batch-0554-0558/audit.json", "utf8");
    const counts = await readFile("/home/ubuntu/dontonyo-work/batch-0554-0558/import_input_counts.json", "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [554, 555, 556, 557, 558]");
    expect(generator).toContain("All 35 ordered overlapping dense-image tiles were reviewed.");
    expect(audit).toContain('"completed_pages": 5');
    expect(audit).toContain('"failed_pages": 0');
    expect(counts).toContain('"eligible_mcqs": 8');
    expect(counts).toContain('"eligible_mcq_options": 32');
  });

  it("imports only the eight reviewed MCQs with one printed key and excludes unsafe source questions", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0554_0558.mjs"), "utf8");
    expect(generator).toContain("Every imported MCQ has four visually reviewed source options and one printed key.");
    for (const number of ["01", "02", "03", "04", "06", "07", "10", "11"]) expect(generator).toContain(`mcq(555, \"${number}\"`);
    for (const number of ["05", "08", "09"]) expect(generator).not.toContain(`mcq(555, \"${number}\"`);
    expect(generator).toContain("generated_options: mcqs.length * 4");
    expect(generator).toContain("historically inconsistent MCQ");
  });

  it("preserves official sources, source caveats, and the withheld conflicting Golan claim", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0554_0558.mjs"), "utf8");
    const classification = await readFile("/home/ubuntu/dontonyo-work/batch-0554-0558/classification_decisions.md", "utf8");
    expect(generator).toContain("https://www.un.org/unispal/document/auto-insert-205528/");
    expect(generator).toContain("https://www.un.org/unispal/document/auto-insert-193242/");
    expect(generator).toContain("https://www.nobelprize.org/prizes/peace/1994/summary/");
    expect(generator).toContain("https://history.state.gov/milestones/1945-1952/arab-israeli-war");
    expect(generator).toContain("source-attributed");
    expect(generator).toContain("conflicting-source");
    expect(generator).toContain("Golan সংক্রান্ত ২০১৮ UN-বক্তব্যের উৎস-সতর্কতা");
    expect(classification).toContain("Hebron casualty figure");
    expect(classification).toContain("source-attributed");
  });
});
