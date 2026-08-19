import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("validated five-page Supabase import contract", () => {
  it("defines source-preserving audit, tags, and verification tables", async () => {
    const migration = await readFile(
      path.join(projectRoot, "supabase/migrations/20260819_002_batch_audit_taxonomy.sql"),
      "utf8"
    );
    expect(migration).toContain("review_metadata");
    expect(migration).toContain("content_tags");
    expect(migration).toContain("fact_verifications");
    expect(migration).toContain("ENABLE ROW LEVEL SECURITY");
  });

  it("locks the user-authorized range to exactly five source pages and rejects duplicate record generation", async () => {
    const generator = await readFile(
      path.join(projectRoot, "scripts/prepare_validated_batch_0454_0458.mjs"),
      "utf8"
    );
    expect(generator).toContain("export const BATCH_PAGES = [454, 455, 456, 457, 458]");
    expect(generator).toContain("WHERE NOT EXISTS");
    expect(generator).toContain("ON CONFLICT (canonical_hash)");
    expect(generator).toContain("d.source_page::integer");
    expect(generator).toContain("generated_mcqs: mcqRows.length");
    expect(generator).toContain("source-attributed");
    expect(generator).toContain("conflicting-verification");
  });
});
