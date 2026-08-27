BEGIN;
INSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) SELECT 'Jubayer''sgk.pdf','485c82545bc78eddf85dc1cbca402adaac35f15c0cc5e915d41e1792d4d2150b','local-ocr-quality-gated-recovery-batch-0304-0308-v1','completed',now(),'{"batch_pages":[304,305,306,307,308],"pipeline_version":"local-ocr-quality-gated-recovery-batch-0304-0308-v1","generated_facts":0,"generated_notes":0,"generated_mcqs":0,"generated_options":0,"generated_flashcards":0,"source_pages":[{"page":304,"review_status":"completed_image_grounded_review","image_sha256":"b1ec25397f13bd8719eaf449caf125cafad6c5432242980fa202fbec05865933","overall_confidence":"medium"},{"page":305,"review_status":"completed_image_grounded_review","image_sha256":"2c3fe83ac62840585ee68d1a25a734d2f10d7f8d2f2d2125c71532ae74f30edc","overall_confidence":"medium"},{"page":306,"review_status":"completed_image_grounded_review","image_sha256":"443cf1a9498370c4fe683bad823f09e79b48a01dee6aea0827e03351466fedfb","overall_confidence":"medium"},{"page":307,"review_status":"completed_image_grounded_review","image_sha256":"8d733ad024d588c25d9e26375235caa141b656334a0043a69b0866fa70b69883","overall_confidence":"medium"},{"page":308,"review_status":"completed_image_grounded_review","image_sha256":"44240f87035aa234b4c4625d475b36743cd1993186d51931b5fe1ebedc6f717b","overall_confidence":"medium"}],"verification_counts":{"verified":0,"conflicting":0,"source_attributed":0},"source_anomalies":["All 35 ordered overlap-safe recovery tiles were reviewed.","Local Bangla-English OCR was reconciled with visual evidence; image evidence controlled.","OCR degradation, legal terms, names, dates, answer keys, source notes, and numeric assertions were preserved without silent correction.","Education, local-government, policy, institutional, historical, named-person, numerical, question-option, and answer-key claims were withheld."],"quality_gates":["Only recovery source pages 304–308 are included.","No reviewed claim clears the conservative quality, policy-safety, internal-consistency, source-note, and authority-verification boundary.","Only reviewed source provenance and page-local topic boundaries are admitted."]}'::jsonb WHERE NOT EXISTS (SELECT 1 FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0304-0308-v1');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Local Government Reference Questions and Source Answer Key','local-government-reference-questions-source-page-304','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',304,304 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='local-government-reference-questions-source-page-304');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Bangladesh Education Source Reference','bangladesh-education-source-reference-page-305','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',305,305 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='bangladesh-education-source-reference-page-305');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Education Abbreviations and Institutions Source Reference','education-abbreviations-institutions-source-page-306','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',306,306 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='education-abbreviations-institutions-source-page-306');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'National Professor and Education Institutions Source Reference','national-professor-education-institutions-source-page-307','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',307,307 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='national-professor-education-institutions-source-page-307');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Education Reference Questions and Source Answer Key','education-reference-questions-source-page-308','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',308,308 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='education-reference-questions-source-page-308');
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0304-0308-v1' ORDER BY started_at DESC LIMIT 1),b.id,304,'educational'::page_kind,'Educationblog24.Com

b- =
১. হাংলাদেশে বর্তমানে কয় LACT WANT সরকার প্রতিষ্ঠান আছে? (DU খ ২৫-২৬]

ক. ৪ খ, ৫ গ. ৬ ছা. ৭
২. কোনটি সক্রিয় স্থানীয় স্বায়ত্তশাসিত প্রতিষ্ঠান? (DU ঘ'' 08-0¢, DU ঘ'' ৯৬-৯৭।

ক. জেলা পরিষদ খ. উপজেলা পরিষদ

গ, ইউনিয়ন পরিষদ ঘ. গ্রাম পরিষদ
২৬, বাইলাদেশে স্থানীয় সরকার ব্যবছা দুর্বল হওয়ার পেছনে সবচেয়ে বড় প্রাতিষ্ঠানিক ঘন
| কোনটি? (50 BCS)
। ক) উপজেলা ও ইউনিয়ন পরিষদের মধ্যে দ্বৈত প্রশাসনিক BOQ
ঘ) সংবিধানে আর্থিক ক্ষমতার বিকেন্দ্রীকরণের বিধান থাকা সত্তেও বাস্তবে তা কেন্দ্রীয়
| গ) পৌরসভা পর্যায়ে সরকারি বেসরকারি অংশীদারিত্ের অভাব
ঘ) দাতা সংস্থাগুলোর মধ্যে সমন্বয়হীনতা
৩৪. চাকা সিটি কর্পোরেশনের প্রথম নির্বাচিত মেয়র কে ছিলেন?143 BCS]
| ক. আনিসুল হক খ. সাঈদ খোকন

গ. সাদেক হোসেন খোকা ঘ. মোহাম্মদ হানিফ
০৫. বাংলাদেশে বর্তমান কয় স্তর বিশিষ্ট ছ্থানীয় সরকার ব্যবস্থা চালু আছে? (25, 18 BCS]

ক. ৩ 2.8 গ. ৫ ঘ. ৬
০১. তিতাস উপজেলা কোন জেলায় অবস্থিত? [25 BCS!
| ক. নোয়াখালী খ. কুমিল্লা গ. রংপুর ঘ. সিলেট
০৭. কতজন প্রতিনিধি নিয়ে ইউনিয়ন পরিষদ গঠিত হয়? (উপজেলা ও থানা শিক্ষা অফিসার, ০৫]

ক.১৩ জন খ. ১২ জন গ. ৯ জন ঘ.১৫ জন
%. স্থানীয় সরকারের কোন স্তরে মহিলাদের ব্যাপক ক্ষমতায়নের সুযোগ রাখা হয়েছে? থানা শিক্ষা অফিসার, |
08]

ক. ইউনিয়ন পরিষদ খ. উপজেলা পরিষদ

গ. জেলা পরিষদ ঘ. গ্রাম সরকার
৯, White Paper কী? [রাবি-রষ্ট্বিজ্ঞান বিভাগ, ০৭-০৮]
| ক. এক ধরনের আইন খ. উপ-সচিব
|  গ. সাদা চিঠি ঘ. সরকার কর্তৃক প্রকাশিত তথ্য বিবরণী
| সস Zubair’s GK - 289

|
(3 camscanner
','Bangladesh education and local-government source boundary','local-government-reference-questions-source-page-304','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":304,"source_image_sha256":"b1ec25397f13bd8719eaf449caf125cafad6c5432242980fa202fbec05865933","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0304-0308/visual_review_304_308.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0304-0308/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0304-0308/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=304);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0304-0308-v1' ORDER BY started_at DESC LIMIT 1),b.id,305,'educational'::page_kind,'Educationblog24.Com
r 2.
বাংলাদেশের শিক্ষা 1
e দৈশের শিক্ষা কমিশন.
». উম কাঁমশন- কুদরত-ই-খুদা [শখ] ঝমশন (১৯৭২)
» তীয় কাঁমশন- মাঁফিজউ|দন |শি্ষা কমিশন (১৯৮৮)
» তৃতীয় কমিশন- শামসুল হক শিক্ষা কমিশন (১৯৯৭) :
৯ চতুর্থ কমিশন- এম. এ বারি শিক্ষা কমিশন (২০০২)
৯ পধ্ধম কমিশন- মনিরুজ্জামান fast শিক্ষা কমিশন (২০০৩)
৬ গঠিত হয়- ৩ (টি। শত : | এ
* সর্বশেষ- জাতীয় শিক্ষানীতি প্রণয়ন SALT । (ছি ode
/* কমিটির প্রধান ছিলেন- অধ্যাপক কবীর চৌধুরী | 1৮
* গঠিত হয়- ২০১০ সালে। rN ৮৮ r |
সা ||
সু. সা রসায়নবিদ, গ্রন্থকার এবং শিক্ষাবিদ। | .
> প্রাথমিক স্তর- ১ম - ৮ম শ্রেণি পর্যন্ত id :
> মাধ্যমিক স্তর- ৯ম - ১২শ শ্রেণি পর্যন্ত TS |
* জেলা-৭টি হি বদক্বজী বর ||
[*. প্রথম াম- কচবাড়ী-কৃপর, ঠাকুরগাও. |. যেটি অবহিত ঠাক্রীয়ে। |]
e প্রথম জেলা- মাগুরা as শিট ৰা — | |
শিক্ষা প্রশাসন te
* প্রাথমিক শিক্ষকদের নিয়োগ করে- প্রাথমিক শিক্ষা অধিদপ্তর
* প্রাথমিক শিক্ষা অধিদপ্তরের প্রধান কর্মকর্তা- মহাপরিচালক :
* NAPE অবস্থিত- ময়মনসিংহ
* প্রতিষ্ঠিত হয়- ১৯৭৮ সালে
* জাতীয় শিক্ষা ব্যবস্থাপনা একাডেমি (নায়েম)- ধানমন্ডি, ঢাকা |
* প্রাথমিক শিক্ষা বাস্তবায়নে দায়িত্ব পালন করেন- DPE
¢ DPE- Directorate of Primary Education. |
| Zubair''s GK - ২৪৮ সিনা
(3 camscanner
','Bangladesh education and local-government source boundary','bangladesh-education-source-reference-page-305','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":305,"source_image_sha256":"2c3fe83ac62840585ee68d1a25a734d2f10d7f8d2f2d2125c71532ae74f30edc","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0304-0308/visual_review_304_308.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0304-0308/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0304-0308/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=305);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0304-0308-v1' ORDER BY started_at DESC LIMIT 1),b.id,306,'educational'::page_kind,'Educationblog24.com
a
৮ NAPE- National Academy for Primary Education.
৮ TOEFL- Test of English as Foreign Language.
» SAT- Scholastic Aptitude Test.
৮ HSC- Higher Secondary Certificate.
> BOU- Bangladesh Open University.
>» NAEM- National Academy for Educational Management.
৮ BANBEIS- Bangladesh Bureau of Educational Informational
and Statistics.
» মেরিটাইম ট্রেনিং ইনস্টিটিউট- আগাবাদ, চট্টগ্রাম
৮ মিলিটারি একাডেমি- ভাটিয়ারী, চট্টগ্রাম | মিলিটারি, মেরিন ও নেভাল
> পুলিশ একাডেমি- সারদা, রাজশাহী তিনটি একাডেমি-ই চট্টগ্রামে
৮ মেরিন একাডেমি- জলদিয়া, চ্টথাম
৷ ৮ নেভাল একাডেমি- পতেঙ্গা, চট্টগ্রাম Ae
| ৮ এয়ারফোর্স একাডেমি- যশোর
» আনসার একাডেমি- সফিপুর, গাজীপুর £ ৮.
। ৮ মহিলা পলিটেকনিক ইনস্টিটিউট- শের-ই-বাংলা নগর, ঢাকা
> চারুকলা ইনস্টিটিউট- ঢাকা বিশ্ববিদ্যালয়
+ মোট ক্যাডেট কলেজ- ১২ টি (বালক ৯ টি ও বালিকা ৩ টি)
* প্রথম ক্যাডেট কলেজ- ফৌজদারহাট ক্যাডেট কলেজ (১৯৫৮)
* ফৌজদারহাট ক্যাডেট কলেজ অবস্থিত- চট্টগ্রামে
1» বালিকাদের জন্য গার্লস ক্যাডেট কলেজ- ৩ টি
| ৮ ময়মনসিংহ ক্যাডেট কলেজ
৮ ফেনী ক্যাডেট কলেজ
* প্রথম গার্লস ক্যাডেট কলেজ- ময়মনসিংহ ক্যাডেট কলেজ 1
Zubair’s GK - ২৪৯
L
(3 camscanner
','Bangladesh education and local-government source boundary','education-abbreviations-institutions-source-page-306','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":306,"source_image_sha256":"443cf1a9498370c4fe683bad823f09e79b48a01dee6aea0827e03351466fedfb","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0304-0308/visual_review_304_308.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0304-0308/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0304-0308/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=306);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0304-0308-v1' ORDER BY started_at DESC LIMIT 1),b.id,307,'educational'::page_kind,'Educationblog24.Com
ee
* Sy জাতীয় অধ্যাপক নিয়োগ দেওয়া হয়- ১৭ মার্চ, ১৯৭৫ |
* OT জাতীয় অধ্যাপক ছিলেন- ৩ জন জাতীয় অধ্যাপকের মেয়াদ ৫ |
1] ৯ শিল্পাঠা জয়নুল আবেদিন বছর। নিয়োগ দেন রাষ্ট্রপতি । 11
৯ অধ্যাপক আবদুর রাজ্জাক প্রথম জাতীয় মহিলা অধ্যাপক ||
> ড. কাজী মোতাহের হোসেন | ছিলেন সুফিয়া আহম্মেদ ।
বাট ~ hi & বু >. | | “i |
Bcf | Al
eye | — | is
জাতীয় অধ্যাপক হন ও গণিত বিভাগে অধ্যাপনা করেন অধ্যাপক ছিলেন |
বাংলাদেশ বিশ্ববিদ্যালয় মঞ্জুরি কমিশন (UGC)
* পরিচয়- সরকার ও বিশ্ববিদ্যালয়গুলোর মধ্যে মধ্যস্থৃতাকারী প্রতিষ্ঠান | | 2
e UGC- University Grants Commission.
* প্রতিষ্ঠিত হয়- ১৬ ডিসেম্বর, ১৯৭২। |
* সদর দপ্তর- আগারগাও, ঢাকা | |
* কমিশনের সদস্যদের নিয়োগ দেন- শিক্ষামন্ত্রী। |
* এটি বাংলাদেশের সকল বিশ্ববিদ্যালয়গুলোর সর্বোচ্চ নিয়ন্ত্রণকারী প্রতিষ্ঠান |
* বাংলাদেশের প্রথম শিক্ষা কমিশন- ড. কুদরাত-ই-খুদা কমিশন, ১৯৭২ |
8 বাংলাদেশে প্রাথমিক শিক্ষা আইন জারি হয়- ১৯৭৪ সালে |
1* সর্বজনীন প্রাথমিক শিক্ষা প্রবর্তিত হয়- ১৯৮০ সালে
|* বাংলাদেশে বাধ্যতামূলক প্রাথমিক শিক্ষা আইন পাস হয়- ১৯৯০ সালে
* বাধ্যতামূলক প্রাথমিক শিক্ষা চালু হয়- ১৯৯২ সালে (৬৮ টি উপজেলায়) |
* সারা দেশে বাধ্যতামূলক প্রাথমিক শিক্ষা চালু হয়- ১৯৯৩ সালে (খাদ্যের বিনিময়ে শিক্ষা) |
৬ প্রাথমিক ও গণশিক্ষা বিষয়ক মন্ত্রণালয় প্রতিষ্ঠিত হয়- ২০০৩ সালে | |
| * প্রাথমিক শিক্ষা একাডেমি অবস্থিত- ময়মনসিংহ (ন্যাপ), ১৯৭৮ সালে প্রতিষ্ঠিত
° Cree শিক্ষা অধিদপ্তরের প্রধান কর্মকর্তাকে বলা হয়- মহাপরিচালক
- Zubair’sGK-2@0
(3 camscanner
','Bangladesh education and local-government source boundary','national-professor-education-institutions-source-page-307','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":307,"source_image_sha256":"8d733ad024d588c25d9e26375235caa141b656334a0043a69b0866fa70b69883","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0304-0308/visual_review_304_308.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0304-0308/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0304-0308/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=307);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0304-0308-v1' ORDER BY started_at DESC LIMIT 1),b.id,308,'educational'::page_kind,'৮ Educationblog24.Com
এই অধ্যায়ের সাথে জড়িত বিগত বছরের প্রশ্ন
ক বিশ্ববিদ্যালয়
২১. হাথমিক শিক্ষা বাস্তবায়নে যে প্রতিষ্ঠানটি HIG পালন করে- [0.7 খ ১০-১১, :
1 ক.ন্যাপ খ. ডিপিই গ. এনসিটিবি ঘ.প্পিটিজই |
। উ২. বাংলাদেশে প্রথম শিক্ষা কমিশন কবে গঠিত হয়? [DU ঘ ১০-১১,
| BL ১৯৭৫ সালে খ.১৯৭৪ সালে গ.১৯৭৩ সালে ঘ.১১৭২ লে CO
৩৩. ব্ইলাদেশের প্রথম শিক্ষা কমিশন- [DU © ০৬-০৭. DU ¥ 38-32!
| ক. মফিজউদ্দিন কমিশন খ. শামসুল হক কমিশন :
গ. মাজেদ খান কমিশন ঘ. কুদরত-ই-খুদা কমিশন
৩৪. বাংলাদেশে বাধ্যতামূলক প্রাথমিক শিক্ষা জাইন পাস হয়ঃ (DU খ ০৫-০৬. |
ক. ১৯৯২ সালে খ.১৯৯১ সালে গ.১৯৯০ সালে ঘ.১৯৮৯ STA ]
০৫. বাংলাদেশে প্রথম মহিলা পলিটেকনিক ইনস্টিটিউট স্থাপিত হয়- (DU ¥ ০৮-০১;
ক. ১৯৮৫ সালে খ.১৯৮৬ সালে গ.১৯৯৫ সালে ঘ. ১৯৯৬ সলে
০১. জাতীয় প্রাথমিক শিক্ষা একাডেমি কোন জেলায় অবস্থিত? IDU ঘ ৯৯-০৩;
| ক.ঢাকা খ. রাজশাহী গ. ময়মনসিংহ ঘ. বগুড়া
০৭. কোন শ্রেণি পর্যন্ত অবৈতনিক নারী শিক্ষা চালু করা হয়েছে? [DU ঘ'' 00-03!
ক. ৭ম খ. ৮ম গ. ১০ম ঘ. দ্বাদশ
০৮. আইএসবিএন যে উপকরণ Pes করার কাজে ব্যবহৃত হয়ঃ [DU খ ১৫-১৬:
| $< থ. সাময়িকী গ. সফট্ওয়ার ঘ. Jeans
০৯. জাতীয় শিক্ষানীতি ২০১০ অনুযায়ী প্রাথমিক শিক্ষার মেয়াদ যে ক্লাস পর্যস্ত- IDU খ ১১-১২.
| ক. পঞ্চম শ্রেণি খ. ষষ্ঠ শ্রেণি গ. সপ্তম শ্রেণি ঘ. অষ্টম ie
১০. বাংলাদেশ শিক্ষা, তথ্য ও পরিসংখ্যান ব্যুরো কী নামে পরিচিত IDU © ১২-১৩]
ক. বাশিতপ খ. বিএইএস গ. ব্যানইনকশন ঘ. ব্যানবেইস
| ১১. বাংলাদেশের শিল্পীদের মধ্যে জাতীয় অধ্যাপক হওয়ার গৌরব অর্জন করেন. IDU *চ" 15-16
ক. কামরুল হাসান খ. কাইয়ুম চৌধুরী I
গ. সফিউদ্রীন আহমেদ ঘ. জয়নুল আবেদীন
1১২. পূর্ব বাংলার প্রথম সরকারি বালিকা বিদ্যালয় কোনটি? IDU © ১২-১৩]
ক. বেধুন স্কুল ধ. ঢাকা ফিমেল স্কুল
গ. ইডেন গার্লস স্কুল ঘ. বাংলাবাজার গার্লস স্কুল
১৩. পত্রিকা পড়ে শেখা, টেলিভিশন দেখে শেখা, অন্যকে অনুসরণ করে শেখা, বিভিন্ন স্থান ভ্রমণ
করে শেখা হচ্ছে শিক্ষার- [DU খ'' ১৩-১৪] |
| ক. আনুষ্ঠানিক পদ্ধতি খ. উপানুষ্ঠানিক পদ্ধতি
গ. অনানুষ্ঠানিক পদ্ধতি ঘ. উল্লেখিত সবকটি পদ্ধতি
aa [ke [ew [8a [ew [ea [av [ne
1৯.ঘ 1১০.ঘ [১১.ঘ fae foot fT |
wt 8 Zubair’s GK - ২৫১ |
. এ
(3 camscanner
','Bangladesh education and local-government source boundary','education-reference-questions-source-page-308','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":308,"source_image_sha256":"44240f87035aa234b4c4625d475b36743cd1993186d51931b5fe1ebedc6f717b","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0304-0308/visual_review_304_308.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0304-0308/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0304-0308/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=308);
INSERT INTO public.content_tags (slug,label,category,description) VALUES ('source-provenance','Source provenance','quality','Source-preserved record without learner-facing claim admission.'),('bangladesh-education-reference','Bangladesh education reference','domain','Education material retained as reviewed source provenance.'),('government-institutions-reference','Government institutions reference','domain','Government and institution material retained as reviewed source provenance.') ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;
COMMIT;