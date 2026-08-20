import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 539–543 import contract", () => {
  it("locks the exact five-page boundary and recovered page 540 provenance", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0539_0543.mjs"), "utf8");
    const audit = await readFile("/home/ubuntu/dontonyo-work/batch-0539-0543/audit.json", "utf8");
    expect(generator).toContain("export const BATCH_PAGES=[539,540,541,542,543]");
    expect(generator).toContain("Physical PDF pages 539–543 retain printed footers 482–486.");
    expect(generator).toContain("Page 540 was recovered by a targeted retry after a transient 502 gateway failure");
    expect(audit).toContain('"completed_pages": 5');
    expect(audit).toContain('"failed_pages": 0');
  });

  it("requires four source options and a single printed correct key for every imported MCQ", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0539_0543.mjs"), "utf8");
    expect(generator).toContain("Every imported MCQ has four reviewed source options and one printed correct key.");
    expect(generator).toContain("Bhutan page 540 MCQ Q1 is withheld because its printed answer key gives two alternatives (গ, ঘ).");
    expect(generator).not.toContain('mcq(540,"01"');
    expect(generator).toContain('mcq(540,"02"');
    expect(generator).toContain("generated_options:mcqs.length*4");
  });

  it("records selected direct corroboration while retaining political and damaged source material", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0539_0543.mjs"), "utf8");
    expect(generator).toContain("https://www.britannica.com/biography/Sirimavo-Bandaranaike");
    expect(generator).toContain("https://sos.noaa.gov/education/phenomenon-based-learning/underwater-cabinet-meeting/");
    expect(generator).toContain("Blurred Afghanistan, Sri Lanka, and Maldives spans are retained in source transcripts and not reconstructed as independent facts.");
    expect(generator).toContain("source-attributed material");
  });
});
