BEGIN;
INSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) SELECT 'Jubayer''sgk.pdf','fb3ae6c6a1e9c947573229e034750bb7668d4cfcd3fffed8027bb92fb318b1e4','local-ocr-quality-gated-batch-0849-0853-v1','completed',now(),'{"batch_pages":[849,850,851,852,853],"pipeline_version":"local-ocr-quality-gated-batch-0849-0853-v1","generated_facts":0,"generated_notes":0,"generated_mcqs":0,"generated_options":0,"generated_flashcards":0,"source_pages":[{"page":849,"review_status":"completed_image_grounded_review","image_sha256":"a14bbbcc54e4e13f2cff20193348af53bb895cca74ae0f644d1c4172b4d92f97","overall_confidence":"medium"},{"page":850,"review_status":"completed_image_grounded_review","image_sha256":"32ed7cfa9ed47c7e72953c92c39cc2d057afbb25f7711e7ff406c4f6a50c2c8a","overall_confidence":"medium"},{"page":851,"review_status":"completed_image_grounded_review","image_sha256":"063f63e6e33990fa3f076a5b637958471842d38af95302122b0e754ee5327aa5","overall_confidence":"medium"},{"page":852,"review_status":"completed_image_grounded_review","image_sha256":"2cffa7d3683e94bcd03f8c45777756a96e291b7d63184f7943ef990b79fc7941","overall_confidence":"medium"},{"page":853,"review_status":"completed_image_grounded_review","image_sha256":"dbf02abe162f9372205f82169030331e255ab8a33995a4ffd70ec03e2a2e00f2","overall_confidence":"medium"}],"verification_counts":{"verified":0,"conflicting":0,"source_attributed":0},"source_anomalies":["All 35 ordered overlap-safe source tiles were reviewed.","Local Bangla-English OCR was reconciled with visual evidence; image evidence controlled.","Political, religious, identity, military/security, historical-attribution, ranking and source-imprecise claims were withheld."],"quality_gates":["Only source pages 849–853 are included.","No reviewed claim clears the conservative quality and safety boundary.","Only reviewed source provenance and page-local topic boundaries are admitted."]}'::jsonb WHERE NOT EXISTS (SELECT 1 FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-batch-0849-0853-v1');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Women firsts and world reference source boundary','women-firsts-world-reference-boundary-849','Source-derived content with completed visual review, conservative classification, and recorded verification.',849,849 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics z WHERE z.chapter_id=c.id AND z.slug='women-firsts-world-reference-boundary-849');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'World firsts reference source boundary','world-firsts-reference-boundary-850','Source-derived content with completed visual review, conservative classification, and recorded verification.',850,850 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics z WHERE z.chapter_id=c.id AND z.slug='world-firsts-reference-boundary-850');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'World first persons reference source boundary','world-first-persons-reference-boundary-851','Source-derived content with completed visual review, conservative classification, and recorded verification.',851,851 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics z WHERE z.chapter_id=c.id AND z.slug='world-first-persons-reference-boundary-851');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Founders and inventors reference source boundary','founders-inventors-reference-boundary-852','Source-derived content with completed visual review, conservative classification, and recorded verification.',852,852 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics z WHERE z.chapter_id=c.id AND z.slug='founders-inventors-reference-boundary-852');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Theories and world cities reference source boundary','theories-world-cities-reference-boundary-853','Source-derived content with completed visual review, conservative classification, and recorded verification.',853,853 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics z WHERE z.chapter_id=c.id AND z.slug='theories-world-cities-reference-boundary-853');
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-batch-0849-0853-v1' ORDER BY started_at DESC LIMIT 1),b.id,849,'educational'::page_kind,'Educationbloge4.Com
এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন
]১,. কোন দেশ প্রথম নারীদের ভোটাধিকার দান করে? IDL প 90-94)
ক) নিউজিল্যান্ড 4) acer 1) Yea 4) YOR
] ২. প্রথম নারী ধিনি মাউন্ট এভারেস্ট ভায় করেছিলেন? (DU * ১৮-১৭)

ক) ভ্যালিনটিনা তেরেশকোতা 4) গ্রনকো তাবেই

গ) ক্যারোলিন মিকেলসন ঘ) কেউই নন
©, মুসলিম বিশবর আইনসভার প্রথম নারী স্পিকার” (DU ঘ ০৮-০৯)

ক) মালিহা লোদী থ) ড. ফাহমিদা মির্ভা গ) ফাহমিদা নদী. ay ফাহমিদা পল
8. কোন দেশের নারীরা সর্বধথম ভোটাধিকার লাভ করে? (DU 4 ৯৭-৮৮:271/09)

ক) USA খ) নিউজিল্যান্ড গ) বাহামা ৭) পুর ারপ্যন
৫. জনগণের ভোটে নির্বাচিত প্রথম নারী সরকার প্রধানের নাম- (DU « ০-০৫)

ক) শ্রীমাভো বন্দরনায়েকে খ) ইন্দিরা গান্ধী. গ) মার্গারেট প্যাচার ৭) Cee
৬. বিশ্বের প্রথম নারী প্রধানমন্ত্রী কে ছিলেন?

ক) গোল্ডা মায়ার 4) ইন্দিরা গান্ধী  গ)শ্রীমাভে ব্দরনার়েকে ৭) মার্গারেট oo
৯কাহব্বাতব্বান্ভববাভক্বাভদ a
BS | বিবর. লাক্ি।
Cart | GACH, ইতালি |লোহা___] এশিয়া মাইনর (Ga)

7, 3521 | ae aN রাখ Shs dln ; _- ইয়েস স্যার! |
| গানা আছেকি! | [পৃথিবীর প্রথম সংবাদপত্র চাল হয় চীনে। |
i
সির ! : if & \
3 : Zubair’s GK - 490 ৃ |
(3 camscanner
','World history','women-firsts-world-reference-boundary-849','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; local OCR reconciled with visual evidence; only classified records imported.','{"physical_source_page":849,"source_image_sha256":"a14bbbcc54e4e13f2cff20193348af53bb895cca74ae0f644d1c4172b4d92f97","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0849-0853/visual_review_849_853.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0849-0853/classification_decisions.md"}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages z WHERE z.book_id=b.id AND z.source_page=849);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-batch-0849-0853-v1' ORDER BY started_at DESC LIMIT 1),b.id,850,'educational'::page_kind,'| Educationblog24.Com
টু 7
a বিশের ey eee &
bs ১. শিরোদ দিসি পিস নিট বর init এ sip নিচ লিন বি এ
 [1্াটউব দে 7 পপ উন
(ধানের কোন (১৯৮গালে |
aaa বিড়াল... are কপি (পিসি) রর
বিরল সক
ক্লোন ভেড়া উদ... টি
। ক্লোন মানব শিশু | ইভ (২৬ ডিসে্রর ২০০১)
৷ কারধনুক্ত শহর | মাসদার (সংযুক্ত আরব আমিরাত)...
/গরকারি পরিকা......._| দ্য বোস্টন নিউজলেটার (১৭০৪)
রঙিন টেলিভিশন চালু 1 ৩ জুলাই ১৯২৮
বিশুকাপ ক্রিকেট অনুষ্ঠিত হয় ১৯৭৫ সালে, ল্যাডে_
বিশৃকাপ ফুটবল অনুষ্ঠিত হয়... | উরুগুয়ে (১৯৩০).
sen বিশুকাপ ফুটবল অনুষ্ঠিত. | yea ১৯৯১)
| | 4 [নিক অলিম্পিক অনঠিত ১৮৯৬ সালে (গিসে) | |
| | [চলচ্চিত্র নির্দাণ___..___ 1১৮৯৫ TH
টিকেটের eet | অসি ere eons
[cee বোমাহামপা____[ছিেশিমা তে অন 9980)
86] টি
: I টা / | \ ie * ৬ han wet a
45 ১ র । ‘
|) মহাকাশযান ভোস্টক-এ করে প্রথম ১৮৯৫ সালে লুমিয়ার ব্রাদার্স নামে ||
11 মহাকাশ ভ্রমণ করে রাশিয়ার পরিচিত দুই ভাই প্রথম “ওয়ার্কার্স লিভিং :
(1 eft গ্যাগারিন ১৯৬১ সালে দ্য লুমিয়্যার ফ্যাক্টরি'' নামে
Bee | | co সেকেন্ডের চলচ্চিত্র নির্মাণ করেন |
রা “Zubair''sGk-9>) ign
L- =
(3 camscanner
','World history','world-firsts-reference-boundary-850','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; local OCR reconciled with visual evidence; only classified records imported.','{"physical_source_page":850,"source_image_sha256":"32ed7cfa9ed47c7e72953c92c39cc2d057afbb25f7711e7ff406c4f6a50c2c8a","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0849-0853/visual_review_849_853.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0849-0853/classification_decisions.md"}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages z WHERE z.book_id=b.id AND z.source_page=850);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-batch-0849-0853-v1' ORDER BY started_at DESC LIMIT 1),b.id,851,'educational'::page_kind,'Educationblog24.Com
coco Reet | Raver aa (ae)
are te Ee টি
(3 camscanner
','World history','world-first-persons-reference-boundary-851','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; local OCR reconciled with visual evidence; only classified records imported.','{"physical_source_page":851,"source_image_sha256":"063f63e6e33990fa3f076a5b637958471842d38af95302122b0e754ee5327aa5","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0849-0853/visual_review_849_853.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0849-0853/classification_decisions.md"}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages z WHERE z.book_id=b.id AND z.source_page=851);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-batch-0849-0853-v1' ORDER BY started_at DESC LIMIT 1),b.id,852,'educational'::page_kind,'Educationblog24.Com
০০০

আকন | Rew মারতে [ace [ore

em [kaon win ia

eee [roe eee ante ||

টু  আনিরওআনাক |

[ফিস wes [SR rae

(3 camscanner
','World history','founders-inventors-reference-boundary-852','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; local OCR reconciled with visual evidence; only classified records imported.','{"physical_source_page":852,"source_image_sha256":"2cffa7d3683e94bcd03f8c45777756a96e291b7d63184f7943ef990b79fc7941","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0849-0853/visual_review_849_853.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0849-0853/classification_decisions.md"}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages z WHERE z.book_id=b.id AND z.source_page=852);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-batch-0849-0853-v1' ORDER BY started_at DESC LIMIT 1),b.id,853,'educational'::page_kind,'টনি | Educationblog24.Com
Free” নল উরি ০৯ কনের লে টার নাজ চা
৷ || fests fanart
নাজ _াশাঙ্গ ওর [wor
|. | লত্জ__ পপ Ac
| [erates [লিন মান | errs মশল |
| worm = [জনমিল_ [ভোক্তার eye |
| | aging theo জন
[অভাব সাম্যের. [হ্যা সিংগার_ jaa |
a
এক নজরে গণতন্ত্র
পত্র সতিগর |
| make শাসিত সরকার ব্যবছার Cee | মুক্তরাজ্য
|
তর লক... কেস দ্য
আধুনিক গণতগ্রের জনক... | জন লক (যুক্তরাজ্য) |.
| aa tie fo a eee |
(3 camscanner
','World history','theories-world-cities-reference-boundary-853','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; local OCR reconciled with visual evidence; only classified records imported.','{"physical_source_page":853,"source_image_sha256":"dbf02abe162f9372205f82169030331e255ab8a33995a4ffd70ec03e2a2e00f2","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0849-0853/visual_review_849_853.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0849-0853/classification_decisions.md"}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages z WHERE z.book_id=b.id AND z.source_page=853);
COMMIT;