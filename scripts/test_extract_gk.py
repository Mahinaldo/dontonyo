import unittest
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
from extract_gk import PageRecord, parse_mcqs, topic_hints


class ExtractionTests(unittest.TestCase):
    def test_topic_hints_only_keep_dotted_leader_source_lines(self):
        text = "বাংলাদেশের ইতিহাস........ ১২\nসাধারণ বাক্য নয়"
        self.assertEqual(topic_hints(text), ["বাংলাদেশের ইতিহাস"])

    def test_mcq_metadata_validation_is_explicit(self):
        page = PageRecord(
            page=100,
            status="processed",
            text="1. বাংলাদেশের রাজধানী? ক. ঢাকা খ. চট্টগ্রাম গ. খুলনা ঘ. রাজশাহী (ঢাকা বিশ্ববিদ্যালয় ২০২০)",
            extraction_method="ocr",
            chapter_hint="Chapter 1",
            content_types=["mcq"],
            confidence="high",
        )
        rows = parse_mcqs(page)
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["source_question_number"], "1")
        self.assertTrue(rows[0]["metadata_validation"]["has_source_question_number"])
        self.assertTrue(rows[0]["metadata_validation"]["has_exam_metadata"])
        self.assertFalse(rows[0]["metadata_validation"]["has_explanation"])


if __name__ == "__main__":
    unittest.main()
