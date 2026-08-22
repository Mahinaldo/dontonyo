import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { BATCH_PAGES, PIPELINE_VERSION, buildBatch } from "../scripts/prepare_validated_batch_0614_0618.mjs";
const root="/home/ubuntu/dontonyo", work="/home/ubuntu/dontonyo-work/batch-0614-0618";
describe("validated pages 614–618 import contract",()=>{
 it("locks source range and completed image review",async()=>{const a=JSON.parse(await fs.readFile(path.join(root,"supabase/batch-0614-0618/batch_audit.json"),"utf8"));const r=await fs.readFile(path.join(work,"visual_review_614_618.md"),"utf8");expect(BATCH_PAGES).toEqual([614,615,616,617,618]);expect(a.pipeline_version).toBe(PIPELINE_VERSION);expect(a.source_pages.every((x:{review_status:string})=>x.review_status==="completed_image_grounded_review")).toBe(true);expect(r).toContain("All 35 ordered overlap-safe tiles");});
 it("imports only approved facts, notes, and source-keyed MCQs",async()=>{const {audit,sql}=await buildBatch();const d=await fs.readFile(path.join(work,"classification_decisions.md"),"utf8");expect(audit.generated_facts).toBe(16);expect(audit.generated_notes).toBe(5);expect(audit.generated_mcqs).toBe(2);expect(audit.generated_options).toBe(8);expect(sql).toContain("কোন সালে রাশিয়া ক্রিমিয়া দখল করে?");expect(sql).toContain("কোন দেশে এডলফ হিটলার জন্মগ্রহণ করেন?");expect(d).toContain("Chernobyl line is excluded");});
});
