import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("validated pages 469–473 Supabase import contract", () => {
  it("locks the user-authorized source boundary and preserves separate typed records", async () => {
    const generator = await readFile(path.join(projectRoot, "scripts/prepare_validated_batch_0469_0473.mjs"), "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [469, 470, 471, 472, 473]");
    expect(generator).toContain("Do not extend this batch without explicit user instruction");
    expect(generator).toContain("printed_book_page");
    expect(generator).toContain("location-reference");
    expect(generator).toContain("definition");
    expect(generator).toContain("bangladesh-operations");
    expect(generator).toContain("ON CONFLICT (canonical_hash)");
  });

  it("records high-priority external verification without overclaiming the source-attributed material", async () => {
    const generator = await readFile(path.join(projectRoot, "scripts/prepare_validated_batch_0469_0473.mjs"), "utf8");
    expect(generator).toContain("refs.seaAngel");
    expect(generator).toContain("থান্ডার বোল্ট");
    expect(generator).toContain("source_attributed");
    expect(generator).toContain("externally-verified");
    expect(generator).toContain("verification_status");
  });
});
