#!/usr/bin/env python3
"""Convert a Surya ``results.json`` chunk into auditable one-file-per-source-page artifacts.

The converter never invents text or structure. It retains every Surya block and its
layout confidence, while creating a plain-text reading order used by later, separate
normalization and relational-import stages.
"""

from __future__ import annotations

import argparse
import html
import json
import re
import unicodedata
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


BREAK_TAG = re.compile(r"<(?:br\s*/?|/p|/div|/li|/tr|/h[1-6]|/table)\s*>", re.IGNORECASE)
TAG = re.compile(r"<[^>]+>")
SPACE = re.compile(r"[ \t]+")
MULTI_NEWLINE = re.compile(r"\n{3,}")


def plain_text(value: str) -> str:
    """Decode Surya block HTML without adding or correcting any source text."""
    value = html.unescape(value or "")
    value = BREAK_TAG.sub("\n", value)
    value = TAG.sub(" ", value)
    value = unicodedata.normalize("NFC", value).replace("\u200c", "").replace("\u200d", "")
    value = SPACE.sub(" ", value).replace("\r", "")
    value = "\n".join(line.strip() for line in value.splitlines())
    return MULTI_NEWLINE.sub("\n\n", value).strip()


def normalized_block(block: dict[str, Any]) -> dict[str, Any]:
    return {
        "label": block.get("label"),
        "raw_label": block.get("raw_label"),
        "reading_order": block.get("reading_order"),
        "layout_confidence": block.get("confidence"),
        "html": block.get("html", ""),
        "text": plain_text(str(block.get("html", ""))),
        "bbox": block.get("bbox"),
        "polygon": block.get("polygon"),
        "skipped": bool(block.get("skipped", False)),
        "error": bool(block.get("error", False)),
    }


def page_confidence(blocks: list[dict[str, Any]], text: str) -> str:
    """Conservative confidence rating; Surya layout scores are retained separately."""
    scores = [float(block["layout_confidence"]) for block in blocks if isinstance(block.get("layout_confidence"), (int, float))]
    if len(text.replace(" ", "").replace("\n", "")) < 40 or not scores:
        return "low"
    if min(scores) < 0.75 or any(block["error"] for block in blocks):
        return "low"
    # A visual model's layout score is not a semantic OCR-accuracy guarantee.
    return "medium"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--result-json", required=True, type=Path)
    parser.add_argument("--source-pdf", required=True)
    parser.add_argument("--out-dir", required=True, type=Path)
    parser.add_argument("--start-page", required=True, type=int)
    parser.add_argument("--end-page", required=True, type=int)
    parser.add_argument("--extractor", default="surya-ocr-0.22.1-llama-cpp-local")
    parser.add_argument("--overwrite", action="store_true")
    args = parser.parse_args()

    if args.start_page < 1 or args.end_page < args.start_page:
        raise SystemExit("Source pages must be a valid 1-indexed inclusive range.")
    if not args.result_json.is_file():
        raise SystemExit(f"Surya result file not found: {args.result_json}")

    payload = json.loads(args.result_json.read_text(encoding="utf-8"))
    if not isinstance(payload, dict) or not payload:
        raise SystemExit("Surya result file does not contain a document-to-pages object.")
    document_key, pages = next(iter(payload.items()))
    if not isinstance(pages, list):
        raise SystemExit("Surya document pages are not a list.")

    requested = args.end_page - args.start_page + 1
    if len(pages) != requested:
        raise SystemExit(f"Expected {requested} pages from Surya, received {len(pages)}.")

    args.out_dir.mkdir(parents=True, exist_ok=True)
    generated_at = datetime.now(timezone.utc).isoformat()
    written: list[int] = []
    skipped_existing: list[int] = []
    blank_pages: list[int] = []

    for offset, raw_page in enumerate(pages):
        source_page = args.start_page + offset
        destination = args.out_dir / f"page_{source_page:04d}.json"
        if destination.exists() and not args.overwrite:
            skipped_existing.append(source_page)
            continue
        raw_blocks = raw_page.get("blocks", []) if isinstance(raw_page, dict) else []
        blocks = [normalized_block(block) for block in raw_blocks if isinstance(block, dict)]
        ordered_text = "\n".join(block["text"] for block in blocks if block["text"]).strip()
        if not ordered_text:
            blank_pages.append(source_page)
        record = {
            "source_page": source_page,
            "status": "processed" if ordered_text else "empty",
            "text": ordered_text,
            "blocks": blocks,
            "extraction_method": args.extractor,
            "confidence": page_confidence(blocks, ordered_text),
            "source_pdf": args.source_pdf,
            "surya_document_key": document_key,
            "surya_output_page": raw_page.get("page") if isinstance(raw_page, dict) else None,
            "generated_at": generated_at,
        }
        destination.write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
        written.append(source_page)

    audit = {
        "source_pdf": args.source_pdf,
        "source_result_json": str(args.result_json),
        "source_page_range": [args.start_page, args.end_page],
        "expected_pages": requested,
        "surya_pages_received": len(pages),
        "written_pages": written,
        "skipped_existing_pages": skipped_existing,
        "empty_output_pages": blank_pages,
        "extractor": args.extractor,
        "generated_at": generated_at,
    }
    audit_path = args.out_dir / f"chunk_audit_{args.start_page:04d}_{args.end_page:04d}.json"
    audit_path.write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(audit, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
