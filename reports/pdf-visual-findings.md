# GK PDF Visual Inspection Findings

The source PDF contains 925 pages and is predominantly scanned imagery rather than a usable text layer. `pdftotext` returned only the repeated watermark `Educationblog24.Com` for the inspected opening pages, and `pdffonts` reported only a non-embedded Helvetica object, so OCR fallback is required for educational content.

Representative page 20 is a table-of-contents-style page with two columns, Bangla chapter/topic headings, dotted leaders, Bengali numerals, and several chapter banners such as `Chapter 04`, `Chapter 05`, `Chapter 06`, and `Chapter 07`. It is useful for chapter boundary and topic inventory detection but should not be treated as ordinary educational content.

Representative page 100 is a scanned Bangla MCQ page. It has numbered questions, four options arranged in two columns, handwritten/check marks near selected answers, exam-origin metadata in parentheses or brackets, and an answer-key table at the bottom. The question and option text is legible at high resolution, but OCR must preserve reading order, Bengali numerals, option labels, answer keys, and source metadata separately. The answer key can be used to validate the question-level marked answers where page associations are clear.

The watermark `Educationblog24.Com` appears across page headers and must be removed or excluded during normalization. Page footers may include the book title and page/chapter markers. The importer should retain the original PDF page number and avoid treating table-of-contents pages, advertisements, blank pages, and watermark-only pages as educational records.
