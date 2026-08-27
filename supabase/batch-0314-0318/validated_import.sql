BEGIN;
INSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) SELECT 'Jubayer''sgk.pdf','f440ea9063a782e892a3055b2af4bf32d92c8404a02d0ce17904c3da92f76742','local-ocr-quality-gated-recovery-batch-0314-0318-v1','completed',now(),'{"batch_pages":[314,315,316,317,318],"pipeline_version":"local-ocr-quality-gated-recovery-batch-0314-0318-v1","generated_facts":0,"generated_notes":0,"generated_mcqs":0,"generated_options":0,"generated_flashcards":0,"source_pages":[{"page":314,"review_status":"completed_image_grounded_review","image_sha256":"9ffd6731ec4a25fd0bf33a088d19bfa98665d8b95f44c05f65f100bfb486c214","overall_confidence":"medium"},{"page":315,"review_status":"completed_image_grounded_review","image_sha256":"370be220faeba387e88c99c9c9b127510f53f0ad8f1d4ae3f04dc1de857a9add","overall_confidence":"medium"},{"page":316,"review_status":"completed_image_grounded_review","image_sha256":"cd1a8097bfc47c85022c6298ec760c293f74693c046b61d44be5c69b03e5167e","overall_confidence":"medium"},{"page":317,"review_status":"completed_image_grounded_review","image_sha256":"4e72d6811ddcca937a690cac58e25c8920d69e2f87678cef6dd92454b2e7cca2","overall_confidence":"medium"},{"page":318,"review_status":"completed_image_grounded_review","image_sha256":"0de746fd5adde4152925580a0467874e3fa9da97ca9432a18dc8e17a37e8f773","overall_confidence":"medium"}],"verification_counts":{"verified":0,"conflicting":0,"source_attributed":0},"source_anomalies":["All 35 ordered overlap-safe recovery tiles were reviewed.","Local Bangla-English OCR was reconciled with visual evidence; image evidence controlled.","OCR degradation, names, dates, source corrections, historical claims, and numeric assertions were preserved without silent correction.","University, historical, political-history, named-person, architectural, artistic-attribution, numerical, and institutional-first claims were withheld."],"quality_gates":["Only recovery source pages 314–318 are included.","No reviewed claim clears the conservative quality, policy-safety, internal-consistency, source-note, and authority-verification boundary.","Only reviewed source provenance and page-local topic boundaries are admitted."]}'::jsonb WHERE NOT EXISTS (SELECT 1 FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0314-0318-v1');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'ঢাকা বিশ্ববিদ্যালয়: সম্মানসূচক ডিগ্রি ও রবীন্দ্রনাথ প্রসঙ্গ','recovery-0314-dhaka-university-honorary-degrees-rabindranath','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',314,314 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='recovery-0314-dhaka-university-honorary-degrees-rabindranath');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'ঢাকা বিশ্ববিদ্যালয়: দিবস, চেয়ার ও মুক্তিযুদ্ধ প্রসঙ্গ','recovery-0315-dhaka-university-days-chairs-liberation-war','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',315,315 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='recovery-0315-dhaka-university-days-chairs-liberation-war');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'ঢাকা বিশ্ববিদ্যালয়: সমাধি ও সমাধিসৌধ','recovery-0316-dhaka-university-graves-memorials','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',316,316 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='recovery-0316-dhaka-university-graves-memorials');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'ঢাকা বিশ্ববিদ্যালয়: ভাস্কর্য, স্থাপত্য ও তোরণ','recovery-0317-dhaka-university-sculptures-architecture-arch','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',317,317 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='recovery-0317-dhaka-university-sculptures-architecture-arch');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'ঢাকা বিশ্ববিদ্যালয়ের প্রথমসমূহ','recovery-0318-dhaka-university-firsts','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',318,318 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='recovery-0318-dhaka-university-firsts');
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0314-0318-v1' ORDER BY started_at DESC LIMIT 1),b.id,314,'educational'::page_kind,'Educationblog24.Com
> aS oH ১৯২ a চে
| ৯ অধ্যক্ষ হরপ্রসাদ শাস্ত্ী- ১৯২৭ এ
> স্বার জগদীশচন্দ্র বস. ১৯৩৬ ১
> রবীন্দ্রনাথ ঠাকুর- ১৯৩৬ তা |
> শরত্চন্দ্র চট্টোপাধ্যায়- ১৯৩৬ স্যার জগদ bY বসু, ১৯৩৬ |
> এ. কে. ফজলুল হক- ১৯৫৬ টি,
> সত্যেন্ত্রনাথ বসু- ১৯৭৪ @ -
> ডঙ্বর মুহম্মদ শহীদুল্লাহ ১৯৭৪ >
৯ কাজী নজরুল ইসলাম-. ১৯৭৪ aN &
> ড.মুহাম্মদ কুদরত-ই-খুদা- ১৯৭৪ রবীন্দ্রনাথ ঠাকুর, ১৯৩৬ |
> ছ. কাজী মোতাহের হোসেন- ১৯৭৪ -
> প্রফেসর আবুস সালাম- ১৯৯৩
| > প্রফেসর ড.অমত্্য সেন- ১৯৯৯ দত ও
| > ড. Weed মোহাম্মদ- 2008 |
| A J 4 |
| ৮ ড.মুহাম্মদ ইউনৃস- ২০০৭ কাজী নজরুল ইসলাম, ১৯৭৪
* রুবীন্দ্রনাথ ঠাকুর ঢাকা বিশ্ববিদ্যালয়ে এসেছিলেন- ১ বার (১৯২৬ সালে)।
* ১৯২৬ সালে রবীন্দ্রনাথ ঠাকুর বক্তৃতা করেন- কার্জন হলে ।
& রবীন্দ্রনাথ ঠাকুর জগন্নাথ হলের “বাসস্তিকা” পত্রিকার জন্য যে কবিতা লিখেন- এই
11 কথাটি মনে রেখো।
nm. £. ee
কল | চি পত্রিকার জন্য কবির
সি ৮৮১৬৯ লুল || “এই কথাটি মনে
ভে বদ চলত হতেই দে হেন মার
pe বিশৃবিদ্যালয়ে আসেন ২বার। প্রথমবার আসেন ১৯২৬ সালে এবং দ্বিতীয়বার আসেন
[১৯৮৮ সালে কিন টি ভুল ate ঠাকুর ঢাকায় এসেছিলেন বার ১৮৯৮ সালে এবং
1৯৯২৬ সালে। কিন্তু ঢাকা বিশ্ববিদ্যালয়ে এসেছিলেন ১বার, ৭ ফেব্রুয়ারি, ১৯২৬ সালে।
ae ঠাকুরকে ঢাকা বিশ্ববিদ্যালয় হতে ১৯৩৬ সালে সম্মানসূচক ডি লিট উপাধি দেয়া
লে wae জন্য তিনি সে সময় ঢাকা বিশ্ববিদ্যালয়ে উপস্থিত থাকতে গারেননি। তার
mee বিশেষ সমাবর্তনে তাকে এই উপাধি প্রদান করা হয়। উল্লেখ, এ সমাবর্তনেই
দার ভ্রগদীশচন্দ্র বসু, স্যার প্রফুল্র চন্দ্র রায়, স্যার জদুনাথ সরকার এবং কথা সাহিত্যিক শরৎচন্দ্র
চ্টাপাধ্যায়কেও সম্মানসূচক ডি লিট উপাধি প্রদান করা হয়।
| তথ্যসূত্র: প্রথম আলো ও TAG গবেষক Fees মিত্রের ''ঢাকা বিশ্ববিদ্যালয় এবং TY বন্ধ |
ই | i Zubair’s GK - ২৫৭ | |
(3 camscanner
','University of Dhaka source boundary','recovery-0314-dhaka-university-honorary-degrees-rabindranath','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":314,"source_image_sha256":"9ffd6731ec4a25fd0bf33a088d19bfa98665d8b95f44c05f65f100bfb486c214","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0314-0318/visual_review_314_318.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0314-0318/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0314-0318/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=314);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0314-0318-v1' ORDER BY started_at DESC LIMIT 1),b.id,315,'educational'::page_kind,'্ Educationblog24.Com
ঢাকা বিশ্ববিদ্যালয়ের কালো দিবস ও শোক দিবস
২০০৭ সালে তত্ত্বাবধায়ক সরকারের প্রশাসনের সাথে ঢাবি |
Berta সংঘর্ষে জড়িয়ে গড়ে। খেলার মাঠে এক শিক্ষার্থীকে
এক সেনা সদস্য শারীরিকভাবে MS করলে এই ঘটনার শুরু [নার =a oa
হয়। ২০-২৩ আগস্ট সেনাবাহিনী ও পুলিশের হাতে শিক্ষক, | ৮৮৮৮;
শিক্ষার্থী ও কর্মচারী নিপীড়নের ঘটনা ঘটে | তাই ২৩ আগস্টকে
''ঢাকা বিশ্ববিদ্যালয়ের ''কালো দিবস'' হিসেবে পালন করা হয়। | :
1১৯৮৫ সালের ১৫ অক্টোবর জগন্নাথ হলের একটি আবাসিক [0 মার
ভবনের ছাদ ধসে পড়লে মর্মান্তিক দুর্ঘটনা ঘটে | এতে ৩৯
জন ছাত্র, কর্মচারী ও অতিথি প্রাণ হারায়। এই দিনটিকে [ee
ঢাকা বিশ্ববিদ্যালয়ের ''শোক দিবস'' হিসেবে পালন করা হয়। ঢাবির জগন্নাথ হল |
Fe ড. আহমদ শরীফ চেয়ার- বাংলা বিভাগে |
© বোস চেয়ার- পদার্থবিজ্ঞান বিভাগে | |
৬ আব্দুর রাজ্জাক চেয়ার- রাষ্ট্রবিজ্ঞান বিভাগে | |
৬ বেগম রোকেয়া চেয়ার- উইমেন এন্ড জেন্ডার স্ট্যাডিজ বিভাগে | |
@ মোকারম হোসেন খন্দকার চেয়ার- রসায়ন বিভাগে |
চি লাভা এত য় সব বইতে দা ছে বার
রয়েছে ঢাকা বিশ্ববিদ্যালয়ের বাংলা বিভাগে; তথ্যটি ভুল। পদার্থ বিজ্ঞানী সত্যেন্দ্রনাথ বোসের |
৬ মুক্তিযুদ্ধে ঢাকা বিশ্ববিদ্যালয়ের শিক্ষক নিহত হয়- ১৯ জন।
* মুক্তিযুদ্ধের সময় ঢাকা বিশ্ববিদ্যালয়ের যে দার্শনিক শহিদ হন- অধ্যাপক গোবিন্দচন্দ্র দেব
৬ গোবিন্দচন্দ্র দেব যে বিভাগের শিক্ষক ছিলেন- দর্শন বিভাগ | |
* মুক্তিযুদ্ধে নিহত ঢাকা বিশ্ববিদ্যালয়ের মেডিকেল অফিসার- ডা. মোহাম্মদ WaT |
* মুক্তিযুদ্ধে নিহত ঢাকা বিশ্ববিদ্যালয় ল্যাবরেটরি কুলের শিক্ষক- মোহাম্মদ সাদেক।
* দেশদ্রোহিতার অভিযোগে টিক্কা খান সরকার কারাদণ্ড দেয়- অধ্যাপক আব্দুর
রাজ্জাককে (১৪ বছর)। |
* স্থাধানতার পর বিশ্ববিদ্যালয় থেকে চাকুরিচ্যুত করা হয়- উপাচার্য ড. সাজ্জাদ হোসায়েনকে।
|* ২৫ মার্চ রাতে নৃসংশ হত্যাকান্ড চালানো হয়- জহুরুল হক হল ও জগন্নাথ হলে।
* ২৫ মার্চ রাতে নিহত শাহনেওয়াজ এর নামে ছাত্রাবাস আছে- ঢাবির মুহসীন হলে। | .
| @ মুক্তিযুদ্ধের সময় ঢাকা বিশ্ববিদ্যালয় এলাকা যে সেক্টরের অধীনে ছিল- ২নং CHAS | :
| | 7ubair’s GK - 24% a | }
(3 camscanner
','University of Dhaka source boundary','recovery-0315-dhaka-university-days-chairs-liberation-war','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":315,"source_image_sha256":"370be220faeba387e88c99c9c9b127510f53f0ad8f1d4ae3f04dc1de857a9add","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0314-0318/visual_review_314_318.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0314-0318/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0314-0318/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=315);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0314-0318-v1' ORDER BY started_at DESC LIMIT 1),b.id,316,'educational'::page_kind,'‘oa _. Educationblog24.Gom
৯ জাতীয় কৰি কাজী নজরুল ইসলাম | > শেরে বাংলা এ.কে, ফজলুল হক
৯ শিল্পাচার্য জয়নুল আবেদিন ৮ খাজা নাজিমুদ্দান
৯ AGA কামরুল হাসান > হোসেন শহিদ সোহরাওয়ার্দী
> শরীফ ওসমান বিন হাদি > ড. মোহাম্মদ শহীদুল্লাহ
| Ty মাতা ছা | ’ | |
[১ ক ie

& A Ie BS 7 : £ nog i f
৯ 18 BS সিসির hae ৮ = :
2০০০ ৮4 Ee 7 নী . 2
৮০০২০ A) a eres Se =?
কাজী নজরুল ইসলামের সমাধি জয়নুল আবেদিনের সমাধি কামরুল হাসানের সমাধি
| রঃ |
wat. | ২.1
1. A & 9252 ভে ve gol
D4 os » ae রা
us ০০৮ || ১১৮ . - Se
তিন নেতার মাজার ড. মুহম্মদ শহীদুল্লাহর সমাধি
| দোয়েল চত্বরের পাশে তিন নেতার ড. মুহম্মদ শহীদুল্রাহ ১৯৬৯ সালে
মাজার; যেখানে শায়িত আছেন মারা গেলে এ একই বছরে তার সঙ্গানার্থে
খাজা নাজিমুদ্দীন, হোসেন শহিদ ঢাকা বিশ্ববিদ্যালয়ের “ঢাকা হল''-এর নাম
সোহরাওয়ার্দী ও এ. কে. ফজলুল হক। পরিবর্তন করে “শহীদুল্লাহ হল'' রাখা হয়।
* ঢাবিতে অবস্থিত সমাধিসৌধ-
| ১৮ তিন নেতার মাজার (ছুগতি- মাসুদ আহমেদ)।
| > কাজী নজরুল ইসলাম সমাধিসৌধ (ছ্থপতি- মাজহারুল ইসলাম) |
> ড. মোহাম্মদ শহীদুল্লাহ্র সমাধি |
* ফজলুল হুক, খাজা নাজিমুদদীন ও সোহ্রাওয়ার্দীর সমাধি রয়েছে- তিন নেতার মাজারে।
1৪ ড. মুহম্মদ শহীদুল্লাহ এর সমাধি রয়েছে- শহীদুল্লাহ হল গেটে ।
: Zubair’s GK ২৫৯
(3 camscanner
','University of Dhaka source boundary','recovery-0316-dhaka-university-graves-memorials','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":316,"source_image_sha256":"cd1a8097bfc47c85022c6298ec760c293f74693c046b61d44be5c69b03e5167e","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0314-0318/visual_review_314_318.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0314-0318/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0314-0318/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=316);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0314-0318-v1' ORDER BY started_at DESC LIMIT 1),b.id,317,'educational'::page_kind,'7 Educationblog2e4.Com
ঢাবিতে উল্লেখযোগ্য SST, SHA ও অবস্থান |
১ [be ee
কলাভবনের সামনে | সৈয়দ আন্দুল্লাহ খালেদ
সবোপার্জিত স্বাধীনতা. | টিএসসি চত্বরে | শামীম শিকদার. |
were [eae ;শামীমশিকদার_. 7]
[যাও শি
> ঢাকা গেট /. মুসা খানের সাধিসীধ ছে A
> মুসা খানের মসজিদ হলের ভেতরে। _২ /
[> পি.জে হার্টস ইন্টারন্যাশনাল হল
|
$ নির্মাণকাল- ১৯ ফেব্রুয়ারি, ১৯০৪। 5০:15 sic Il
২ মুক্তি ও গণতন্ত্র তোরণ |
ঢাকা বিশ্ববিদ্যালয়ের নীলক্ষেত RE প্রবেশমুখে অবস্থিত HS ও;
নন; RE তোরণ'' গেটটি। এটি ''ঢাকা তোরণ'' নামেও পরিচিত। মুক্ত
০৫১ | ও গণতন্ত্র তোরণের BAS রবিউল হোসাইন। মুক্তি ও sree]
মই তোরণে লেখা রয়েছে জাতীয় কবি কাজী নজরুল ইসলামের একটি |.
মুক্তি ও WEN তোরণ কবিতার অশ- ৃ
এর নকশা প্রয়ন TOF WH বিশ্বে
রবিউল হুসাইন। জয় নিপড়ি পরাণ!
জয় নব অভিযান |
জয় নব উত্থান |” |
Zubair’sGK-280,
(3 camscanner
','University of Dhaka source boundary','recovery-0317-dhaka-university-sculptures-architecture-arch','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":317,"source_image_sha256":"4e72d6811ddcca937a690cac58e25c8920d69e2f87678cef6dd92454b2e7cca2","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0314-0318/visual_review_314_318.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0314-0318/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0314-0318/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=317);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0314-0318-v1' ORDER BY started_at DESC LIMIT 1),b.id,318,'educational'::page_kind,'Educationblog24.Com
ঢাকা বিশ্ববিদ্যালয়ের প্রথম

সো রে
কলর কা
ববি
জনসন
১১
তত লিগের অন
2
বলটা টির তক
পপ
Pate fe ভি লাকা
মেতা লে
ধন
we
১5
করিস
ech a
eater __ কোমআজিজুনেসা |
১5555

প্রথম একাডেমিক ক্যালেন্ডার চালু হয় ১৯৯৩ সালে :
PORE
জল
দল [asm id
০০০৬০

| 7ubair’s GK - ২৬১
(3 camscanner
','University of Dhaka source boundary','recovery-0318-dhaka-university-firsts','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":318,"source_image_sha256":"0de746fd5adde4152925580a0467874e3fa9da97ca9432a18dc8e17a37e8f773","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0314-0318/visual_review_314_318.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0314-0318/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0314-0318/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=318);
INSERT INTO public.content_tags (slug,label,category,description) VALUES ('source-provenance','Source provenance','quality','Source-preserved record without learner-facing claim admission.'),('dhaka-university-reference','University of Dhaka reference','domain','Institutional material retained as reviewed source provenance.'),('historical-institutional-reference','Historical institutional reference','domain','Historical institution material retained as reviewed source provenance.') ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;
COMMIT;