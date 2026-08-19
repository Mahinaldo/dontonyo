#!/usr/bin/env python3
"""Create auditable, page-level vision OCR artifacts for one authorized PDF batch.

This runner deliberately does not create database records.  It renders the exact
source pages, transcribes each image in Bangla, runs a second image-grounded
review, and preserves the raw model response, structured transcription, review,
and source-image checksum for downstream human/audit review.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import subprocess
import sys
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

from openai import OpenAI


CONTENT_TAGS = [
    "chapter_heading",
    "topic_heading",
    "note",
    "fact",
    "definition",
    "biography",
    "timeline",
    "table",
    "mcq",
    "mcq_option",
    "answer_key",
    "exam_metadata",
    "map_caption",
    "misc",
]


def checksum(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        for block in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def image_data_url(path: Path) -> str:
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:image/jpeg;base64,{encoded}"


def run_render(pdf: Path, page: int, out_image: Path, dpi: int) -> None:
    if out_image.exists():
        return
    out_image.parent.mkdir(parents=True, exist_ok=True)
    prefix = out_image.with_suffix("")
    command = [
        "pdftoppm",
        "-f",
        str(page),
        "-l",
        str(page),
        "-r",
        str(dpi),
        "-jpeg",
        "-jpegopt",
        "quality=92",
        "-singlefile",
        str(pdf),
        str(prefix),
    ]
    completed = subprocess.run(command, check=False, capture_output=True, text=True)
    if completed.returncode != 0 or not out_image.exists():
        raise RuntimeError(f"Could not render source page {page}: {completed.stderr.strip()}")


def schema(name: str, root_properties: dict[str, Any], required: list[str]) -> dict[str, Any]:
    return {
        "type": "json_schema",
        "json_schema": {
            "name": name,
            "strict": True,
            "schema": {
                "type": "object",
                "properties": root_properties,
                "required": required,
                "additionalProperties": False,
            },
        },
    }


TRANSCRIPTION_SCHEMA = schema(
    "source_page_transcription",
    {
        "source_page": {"type": "integer"},
        "verbatim_transcript": {"type": "string"},
        "blocks": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "order": {"type": "integer"},
                    "block_type": {"type": "string", "enum": CONTENT_TAGS},
                    "text": {"type": "string"},
                    "confidence": {"type": "string", "enum": ["high", "medium", "low"]},
                },
                "required": ["order", "block_type", "text", "confidence"],
                "additionalProperties": False,
            },
        },
        "content_tags": {"type": "array", "items": {"type": "string", "enum": CONTENT_TAGS}},
        "uncertain_spans": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "observed_text": {"type": "string"},
                    "reason": {"type": "string"},
                    "confidence": {"type": "string", "enum": ["high", "medium", "low"]},
                },
                "required": ["observed_text", "reason", "confidence"],
                "additionalProperties": False,
            },
        },
        "candidate_claims": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "claim_text": {"type": "string"},
                    "claim_category": {
                        "type": "string",
                        "enum": ["date", "person", "place", "institution", "event", "definition", "statistic", "other"],
                    },
                    "verification_priority": {"type": "string", "enum": ["none", "normal", "high"]},
                },
                "required": ["claim_text", "claim_category", "verification_priority"],
                "additionalProperties": False,
            },
        },
        "overall_confidence": {"type": "string", "enum": ["high", "medium", "low"]},
    },
    ["source_page", "verbatim_transcript", "blocks", "content_tags", "uncertain_spans", "candidate_claims", "overall_confidence"],
)


REVIEW_SCHEMA = schema(
    "source_page_quality_review",
    {
        "source_page": {"type": "integer"},
        "review_status": {"type": "string", "enum": ["accepted", "accepted_with_flags", "needs_manual_review"]},
        "verified_transcript": {"type": "string"},
        "corrections": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "transcribed_text": {"type": "string"},
                    "source_reading": {"type": "string"},
                    "reason": {"type": "string"},
                },
                "required": ["transcribed_text", "source_reading", "reason"],
                "additionalProperties": False,
            },
        },
        "accepted_content_tags": {"type": "array", "items": {"type": "string", "enum": CONTENT_TAGS}},
        "unresolved_spans": {"type": "array", "items": {"type": "string"}},
        "overall_confidence": {"type": "string", "enum": ["high", "medium", "low"]},
    },
    ["source_page", "review_status", "verified_transcript", "corrections", "accepted_content_tags", "unresolved_spans", "overall_confidence"],
)


def call_json(client: OpenAI, model: str, instruction: str, image_url: str, response_format: dict[str, Any]) -> tuple[dict[str, Any], str]:
    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "system",
                "content": "You are a meticulous Bangla document-transcription auditor. Never invent text or facts. Preserve uncertainty explicitly.",
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": instruction},
                    {"type": "image_url", "image_url": {"url": image_url, "detail": "high"}},
                ],
            },
        ],
        response_format=response_format,
        max_tokens=24000,
    )
    raw = response.choices[0].message.content or ""
    return json.loads(raw), raw


def transcribe_page(client: OpenAI, model: str, source_page: int, image: Path) -> dict[str, Any]:
    transcription_prompt = f"""Transcribe source page {source_page} of a scanned Bangla general-knowledge book.

Read the supplied image directly. Return the printed Bangla text in correct reading order. Preserve original spelling, punctuation, numerals, option labels, headings, and question numbering exactly as visible. Do not translate, summarize, complete missing text, or silently repair words. Mark any unreadable or ambiguous text in uncertain_spans. Classify every meaningful block with one or more correct content tags, keeping MCQs, their options, answer keys, explanations, tables, headings, dates, biographies, and ordinary notes distinct. Extract only claims actually visible on the page; do not verify them yet."""
    transcription, raw_transcription = call_json(client, model, transcription_prompt, image_data_url(image), TRANSCRIPTION_SCHEMA)
    review_prompt = f"""You are performing an independent visual quality review of source page {source_page}.

Compare the page image against this proposed transcript, which may contain Bangla OCR or reading mistakes:

{json.dumps(transcription, ensure_ascii=False)}

Return an image-grounded review. Correct only text that is clearly wrong when compared with the image. Do not normalize facts or invent likely wording. Keep unresolved material flagged. Confirm the correct content tags so that notes, facts, headings, MCQs, MCQ options, answer keys, exam metadata, tables, timelines, definitions, and biographies cannot be mixed."""
    review, raw_review = call_json(client, model, review_prompt, image_data_url(image), REVIEW_SCHEMA)
    return {
        "source_page": source_page,
        "source_image": str(image),
        "source_image_sha256": checksum(image),
        "model": model,
        "transcription": transcription,
        "review": review,
        "raw_model_responses": {"transcription": raw_transcription, "review": raw_review},
        "created_at": datetime.now(UTC).isoformat(),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf", type=Path, required=True)
    parser.add_argument("--start-page", type=int, required=True)
    parser.add_argument("--end-page", type=int, required=True)
    parser.add_argument("--out-dir", type=Path, required=True)
    parser.add_argument("--dpi", type=int, default=220)
    parser.add_argument("--model", default="gemini-3-flash-preview")
    args = parser.parse_args()

    if args.start_page < 1 or args.end_page < args.start_page:
        raise SystemExit("Use a valid inclusive source-page range.")
    if not args.pdf.is_file():
        raise SystemExit(f"Source PDF was not found: {args.pdf}")

    args.out_dir.mkdir(parents=True, exist_ok=True)
    render_dir = args.out_dir / "rendered"
    artifact_dir = args.out_dir / "pages"
    artifact_dir.mkdir(parents=True, exist_ok=True)
    client = OpenAI()
    audit: dict[str, Any] = {
        "source_pdf": str(args.pdf),
        "source_pdf_sha256": checksum(args.pdf),
        "requested_range": [args.start_page, args.end_page],
        "model": args.model,
        "dpi": args.dpi,
        "pages": [],
        "failures": [],
        "started_at": datetime.now(UTC).isoformat(),
    }

    for page in range(args.start_page, args.end_page + 1):
        image = render_dir / f"page_{page:04d}.jpg"
        artifact_path = artifact_dir / f"page_{page:04d}.json"
        try:
            run_render(args.pdf, page, image, args.dpi)
            record = transcribe_page(client, args.model, page, image)
            artifact_path.write_text(json.dumps(record, ensure_ascii=False, indent=2), encoding="utf-8")
            audit["pages"].append(
                {
                    "source_page": page,
                    "artifact": str(artifact_path),
                    "status": record["review"]["review_status"],
                    "confidence": record["review"]["overall_confidence"],
                    "tags": record["review"]["accepted_content_tags"],
                }
            )
            print(f"Completed source page {page}: {record['review']['review_status']}", flush=True)
        except Exception as error:
            audit["failures"].append({"source_page": page, "error": repr(error)})
            print(f"Failed source page {page}: {error!r}", file=sys.stderr, flush=True)

    audit["completed_at"] = datetime.now(UTC).isoformat()
    audit["completed_pages"] = len(audit["pages"])
    audit["failed_pages"] = len(audit["failures"])
    (args.out_dir / "audit.json").write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"completed_pages": audit["completed_pages"], "failed_pages": audit["failed_pages"]}), flush=True)
    if audit["failures"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
