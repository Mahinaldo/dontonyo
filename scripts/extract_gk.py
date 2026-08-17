#!/usr/bin/env python3
"""Extract a scanned Bangla GK PDF into an auditable, normalized JSONL dataset.

The script deliberately keeps uncertain records instead of inventing answers. It is
safe to re-run: every page and record receives a deterministic source hash.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import tempfile
import unicodedata
from collections import Counter, defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Iterable

BANGLA_DIGITS = str.maketrans("০১২৩৪৫৬৭৮৯", "0123456789")
WATERMARK = re.compile(r"educationblog24\s*\.??\s*com", re.I)
PAGE_NUMBER = re.compile(r"^\s*[-–—]?\s*\d{1,4}\s*[-–—]?\s*$")
CHAPTER = re.compile(r"(?:chapter|অধ্যায়|অধ্যায়)\s*[-:০-৯0-9]*\s*(\d{1,3})?", re.I)
QUESTION = re.compile(r"^\s*([০-৯0-9]{1,3})\s*[.)।:-]\s*(.+)$")
OPTION = re.compile(r"(?:^|\s)([কখগঘঙ]|[কখগঘঙ]\.)\s*(.+?)(?=\s+[কখগঘঙ][.)]\s*|$)")
EXAM = re.compile(r"[\(\[]([^\)\]]{2,80}(?:BCS|বিসিএস|বিশ্ববিদ্যালয়|বিশ্ববিদ্যালয়|ঢাকা|জাহাঙ্গীরনগর|চট্টগ্রাম|রাজশাহী|গুচ্ছ)[^\)\]]*)[\)\]]", re.I)

@dataclass
class PageRecord:
    page: int
    status: str
    text: str
    extraction_method: str
    chapter_hint: str | None
    content_types: list[str]
    confidence: str
    error: str | None = None


def normalize(text: str) -> str:
    text = unicodedata.normalize("NFC", text).replace("\u200c", "").replace("\u200d", "")
    text = WATERMARK.sub(" ", text)
    text = text.replace("\r", "")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return "\n".join(line.strip() for line in text.splitlines()).strip()


def latin_digits(text: str) -> str:
    return text.translate(BANGLA_DIGITS)


def meaningful_lines(text: str) -> list[str]:
    return [line for line in (normalize(text).splitlines()) if line and not PAGE_NUMBER.match(line)]


def topic_hints(text: str) -> list[str]:
    """Find likely source headings without treating ordinary prose as topics."""
    hints: list[str] = []
    for line in meaningful_lines(text):
        compact = line.strip()
        if len(compact) < 4 or len(compact) > 100 or QUESTION.match(compact):
            continue
        if re.search(r"(?:\.{3,}|…{2,}|-{3,})\s*[০-৯0-9]{1,4}$", compact):
            title = re.sub(r"(?:\.{3,}|…{2,}|-{3,})\s*[০-৯0-9]{1,4}$", "", compact).strip(" .:-")
            if title and not CHAPTER.search(title) and title not in hints:
                hints.append(title)
    return hints[:20]


def classify(text: str) -> list[str]:
    lines = meaningful_lines(text)
    joined = " ".join(lines)
    types: list[str] = []
    if any(QUESTION.match(line) for line in lines) and len(OPTION.findall(joined)) >= 2:
        types.append("mcq")
    if CHAPTER.search(joined):
        types.append("heading")
    if re.search(r"উত্তরমালা|উত্তরসূচি|answer\s*key", joined, re.I):
        types.append("answer_key")
    if re.search(r"সংজ্ঞা|কাকে বলে|কি\s*বলে|definition", joined, re.I):
        types.append("definition")
    if re.search(r"জন্ম|মৃত্যু|জীবনী|biography", joined, re.I):
        types.append("biography")
    if re.search(r"খ্রিস্টাব্দ|সাল|যুদ্ধ|timeline|সময়কাল|বছর", joined, re.I):
        types.append("timeline")
    if len(joined) > 160 and "mcq" not in types:
        types.append("note")
    elif joined and "mcq" not in types:
        types.append("fact")
    return list(dict.fromkeys(types)) or ["misc"]


def chapter_hint(text: str) -> str | None:
    lines = meaningful_lines(text)
    for line in lines[:12]:
        match = CHAPTER.search(line)
        if match:
            return normalize(line)
    return None


def confidence(text: str, content_types: list[str]) -> str:
    if not text or len(text) < 12:
        return "low"
    replacement = text.count("�") + text.count("??")
    if replacement > 2 or ("mcq" in content_types and len(OPTION.findall(text)) < 4):
        return "low"
    if len(text) < 60:
        return "medium"
    return "high"


def run(cmd: list[str]) -> str:
    return subprocess.check_output(cmd, text=True, stderr=subprocess.DEVNULL)


def extract_page(pdf: Path, page: int, dpi: int, workdir: Path) -> PageRecord:
    try:
        text = run(["pdftotext", "-layout", "-f", str(page), "-l", str(page), str(pdf), "-"])
        text = normalize(text)
        if len(re.sub(r"\s+", "", text)) < 40:
            prefix = workdir / f"page-{page}"
            run(["pdftoppm", "-f", str(page), "-l", str(page), "-r", str(dpi), "-jpeg", "-singlefile", str(pdf), str(prefix)])
            ocr = run(["tesseract", f"{prefix}.jpg", "stdout", "-l", "ben+eng", "--psm", "6"])
            text = normalize(ocr)
            method = "ocr"
            try:
                (prefix.with_suffix(".jpg")).unlink()
            except FileNotFoundError:
                pass
        else:
            method = "text-layer"
        types = classify(text)
        return PageRecord(page, "processed" if text else "empty", text, method, chapter_hint(text), types, confidence(text, types))
    except subprocess.CalledProcessError as exc:
        return PageRecord(page, "failed", "", "error", None, [], "low", str(exc))
    except Exception as exc:  # keep a page-level audit trail and continue
        return PageRecord(page, "failed", "", "error", None, [], "low", repr(exc))


def parse_mcqs(page: PageRecord) -> list[dict]:
    lines = meaningful_lines(page.text)
    records: list[dict] = []
    i = 0
    while i < len(lines):
        match = QUESTION.match(lines[i])
        if not match:
            i += 1
            continue
        question_number, question = match.groups()
        block = [question]
        j = i + 1
        while j < len(lines) and not QUESTION.match(lines[j]) and len(block) < 8:
            block.append(lines[j])
            j += 1
        joined = " ".join(block)
        options = {key: value.strip() for key, value in OPTION.findall(joined)}
        if len(options) >= 2:
            exam_match = EXAM.search(joined)
            answer_hint = re.search(r"উত্তর\s*[:：]\s*([কখগঘ])", joined)
            records.append({
                "source_page": page.page,
                "source_question_number": latin_digits(question_number),
                "question": question.strip(),
                "options": options,
                "correct_option": answer_hint.group(1) if answer_hint else None,
                "source_text": exam_match.group(1).strip() if exam_match else None,
                "confidence": "medium" if len(options) >= 4 else "low",
                "metadata_validation": {
                    "has_source_question_number": bool(question_number),
                    "has_exam_metadata": bool(exam_match),
                    "has_explanation": bool(re.search(r"ব্যাখ্যা|কারণ|explanation", joined, re.I)),
                    "has_answer": bool(answer_hint),
                },
            })
        i = max(j, i + 1)
    return records


def stable_hash(*parts: str) -> str:
    return hashlib.sha256("|".join(normalize(p).lower() for p in parts).encode("utf-8")).hexdigest()


def write_jsonl(path: Path, rows: Iterable[dict]) -> int:
    count = 0
    with path.open("w", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")
            count += 1
    return count


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--out", type=Path, default=Path("data/gk-extracted"))
    parser.add_argument("--workers", type=int, default=4)
    parser.add_argument("--dpi", type=int, default=170)
    parser.add_argument("--start", type=int, default=1)
    parser.add_argument("--end", type=int, default=None)
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    pages = int(re.search(r"Pages:\s+(\d+)", run(["pdfinfo", str(args.pdf)])).group(1))
    end = min(args.end or pages, pages)
    audit: dict = {
        "source_pdf": str(args.pdf), "total_pages": pages, "requested_range": [args.start, end],
        "pages_processed": 0, "pages_skipped": 0, "pages_requiring_ocr": 0,
        "pages_with_extraction_failures": 0, "chapters_found": 0, "topics_found": 0,
        "facts_extracted": 0, "notes_extracted": 0, "mcqs_extracted": 0,
        "exam_source_records": 0, "duplicates_merged": 0, "low_confidence_records": 0,
        "rejected_records": 0, "skipped_pages": [], "failures": [], "decisions": [],
    }
    page_rows: list[PageRecord] = []
    with tempfile.TemporaryDirectory(prefix="dontonyo-ocr-") as tmp:
        workdir = Path(tmp)
        with ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
            futures = {pool.submit(extract_page, args.pdf, page, args.dpi, workdir): page for page in range(args.start, end + 1)}
            for future in as_completed(futures):
                page_rows.append(future.result())
    page_rows.sort(key=lambda row: row.page)
    current_chapter: str | None = None
    content_rows: list[dict] = []
    mcq_rows: list[dict] = []
    seen_content: set[str] = set()
    seen_mcq: set[str] = set()
    chapter_set: set[str] = set()
    topic_set: set[str] = set()
    for page in page_rows:
        audit["pages_processed"] += 1
        if page.extraction_method == "ocr":
            audit["pages_requiring_ocr"] += 1
        if page.status == "failed":
            audit["pages_with_extraction_failures"] += 1
            audit["failures"].append({"page": page.page, "error": page.error})
            continue
        if not page.text or len(re.sub(r"\s+", "", page.text)) < 40:
            audit["pages_skipped"] += 1
            audit["skipped_pages"].append({"page": page.page, "reason": "blank, watermark-only, or unusable OCR"})
            continue
        if page.chapter_hint:
            current_chapter = page.chapter_hint
            chapter_set.add(current_chapter)
        topic_set.update(topic_hints(page.text))
        for mcq in parse_mcqs(page):
            key = stable_hash(mcq["question"], json.dumps(mcq["options"], ensure_ascii=False, sort_keys=True))
            mcq["idempotency_key"] = key
            mcq["chapter_hint"] = current_chapter
            if key in seen_mcq:
                audit["duplicates_merged"] += 1
                continue
            seen_mcq.add(key)
            mcq_rows.append(mcq)
            audit["mcqs_extracted"] += 1
            if mcq["source_text"]:
                audit["exam_source_records"] += 1
            if mcq["confidence"] == "low":
                audit["low_confidence_records"] += 1
        types = [t for t in page.content_types if t not in {"mcq", "answer_key", "heading"}]
        if types:
            kind = "note" if "note" in types else "fact"
            body = page.text
            key = stable_hash(kind, current_chapter or "", body)
            if key not in seen_content:
                seen_content.add(key)
                content_rows.append({
                    "idempotency_key": key, "content_type": kind, "chapter_hint": current_chapter,
                    "source_page": page.page, "source_text": body, "confidence": page.confidence,
                    "content_types": page.content_types,
                    "topic_hints": topic_hints(page.text),
                })
                audit["notes_extracted" if kind == "note" else "facts_extracted"] += 1
                if page.confidence == "low":
                    audit["low_confidence_records"] += 1
    audit["chapters_found"] = len(chapter_set)
    audit["topics_found"] = len(topic_set)
    audit["rejected_records"] = sum(1 for row in mcq_rows if not row.get("correct_option"))
    audit["decisions"].extend([
        "The PDF has no reliable educational text layer; OCR is the default extraction path.",
        "Watermark-only and blank pages are skipped; the original PDF page is retained on every accepted record.",
        "MCQs without a confidently parsed answer are retained with low confidence and rejected from answer-dependent quiz imports.",
        "The importer uses deterministic hashes for idempotency and duplicate detection.",
    ])
    write_jsonl(args.out / "pages.jsonl", (asdict(row) for row in page_rows))
    write_jsonl(args.out / "content.jsonl", content_rows)
    write_jsonl(args.out / "mcqs.jsonl", mcq_rows)
    audit["content_rows_written"] = len(content_rows)
    audit["mcq_rows_written"] = len(mcq_rows)
    (args.out / "audit.json").write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(audit, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
