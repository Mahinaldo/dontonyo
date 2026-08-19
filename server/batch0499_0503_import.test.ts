import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

describe("validated pages 499–503 Supabase import contract", () => {
  it("locks the five-page source boundary and keeps regional capital-and-currency content as structured notes", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0499_0503.mjs"), "utf8");
    expect(generator).toContain("export const BATCH_PAGES = [499, 500, 501, 502, 503]");
    expect(generator).toContain("Capital-and-currency rows stay in structured source tables");
    expect(generator).toContain("asia-capitals-currencies");
    expect(generator).toContain("africa-capitals-currencies");
    expect(generator).toContain("europe-capitals-currencies");
    expect(generator).toContain("ON CONFLICT (canonical_hash)");
    expect(generator).toContain("x.source_page::integer");
    expect(generator).toContain("x.display_order::integer");
    expect(generator).toContain('["asia", "Asia", "domain"');
  });

  it("preserves printed-page anomalies and explicit verified/conflicting source statuses without silent geopolitical normalization", async () => {
    const generator = await readFile(path.join(root, "scripts/prepare_validated_batch_0499_0503.mjs"), "utf8");
    expect(generator).toContain("printed_book_page");
    expect(generator).toContain("নুসানতারা");
    expect(generator).toContain("দক্ষিণ আফ্রিকা");
    expect(generator).toContain("embassies.gov.il/cyprus/en/node/9946");
    expect(generator).toContain("Source-table wording retained without silent correction");
    expect(generator).toContain("batch0499-0503:note:");
  });
});
