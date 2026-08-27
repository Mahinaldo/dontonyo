BEGIN;
INSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) SELECT 'Jubayer''sgk.pdf','860e9ac42b2a61b8e70542e2e2f51c2f41419a2f1e9debb52e15cc5151898722','local-ocr-quality-gated-recovery-batch-0309-0313-v1','completed',now(),'{"batch_pages":[309,310,311,312,313],"pipeline_version":"local-ocr-quality-gated-recovery-batch-0309-0313-v1","generated_facts":0,"generated_notes":0,"generated_mcqs":0,"generated_options":0,"generated_flashcards":0,"source_pages":[{"page":309,"review_status":"completed_image_grounded_review","image_sha256":"65ada4d5831a5e802ea5733bbdae36bb1e1897263f6e64a1e44677b87d9d901d","overall_confidence":"medium"},{"page":310,"review_status":"completed_image_grounded_review","image_sha256":"34d4a30be84bb0062758ad2222c93a2c5cb36b764d6ba0ed133803539e0918a2","overall_confidence":"medium"},{"page":311,"review_status":"completed_image_grounded_review","image_sha256":"a055dd69d879353c5e98aca1947f63a17bdd0f19630ef488a2dd9dfd722dac51","overall_confidence":"medium"},{"page":312,"review_status":"completed_image_grounded_review","image_sha256":"3388719fc44c9d8edc171d442b4aa1d726ce804b4f37f00b6e9b05d10e98dd34","overall_confidence":"medium"},{"page":313,"review_status":"completed_image_grounded_review","image_sha256":"ac4abc0bda6d887ad5156203c11d0c21e786c2b823a62b8d8f94dc8282048a01","overall_confidence":"medium"}],"verification_counts":{"verified":0,"conflicting":0,"source_attributed":0},"source_anomalies":["All 35 ordered overlap-safe recovery tiles were reviewed.","Local Bangla-English OCR was reconciled with visual evidence; image evidence controlled.","OCR degradation, names, dates, answer keys, source corrections, source notes, emblem images, and numeric assertions were preserved without silent correction.","Education, historical, institutional, policy, named-person, political-history, numerical, question-option, answer-key, and branding claims were withheld."],"quality_gates":["Only recovery source pages 309–313 are included.","No reviewed claim clears the conservative quality, policy-safety, internal-consistency, source-note, and authority-verification boundary.","Only reviewed source provenance and page-local topic boundaries are admitted."]}'::jsonb WHERE NOT EXISTS (SELECT 1 FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0309-0313-v1');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'বাংলাদেশের শিক্ষা ও প্রাসঙ্গিক পূর্ববর্তী প্রশ্ন','recovery-0309-bangladesh-education-prior-questions','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',309,309 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='recovery-0309-bangladesh-education-prior-questions');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'ঢাকা বিশ্ববিদ্যালয়: প্রতিষ্ঠার ধারাবাহিক প্রেক্ষাপট','recovery-0310-dhaka-university-establishment-context','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',310,310 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='recovery-0310-dhaka-university-establishment-context');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'নাথান কমিশন ও ঢাকা বিশ্ববিদ্যালয় প্রতিষ্ঠাকালীন ব্যক্তি','recovery-0311-nathan-commission-establishment-figures','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',311,311 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='recovery-0311-nathan-commission-establishment-figures');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'ঢাকা বিশ্ববিদ্যালয়: প্রতিষ্ঠাকালীন তথ্য ও প্রথম ছাত্রী-অধ্যাপিকা','recovery-0312-dhaka-university-early-women','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',312,312 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='recovery-0312-dhaka-university-early-women');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'ডাকসু, সমাবর্তন ও ঢাকা বিশ্ববিদ্যালয়ের মনোগ্রাম','recovery-0313-ducsu-convocation-monogram','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',313,313 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='recovery-0313-ducsu-convocation-monogram');
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0309-0313-v1' ORDER BY started_at DESC LIMIT 1),b.id,309,'educational'::page_kind,'Educationblog24.Com
১৪. শিক্ষা বিভাগের ট্রেনিং-এর শীর্ষ afar কোনটি? (26 BCS/a বি সহকারী শিক্ষক-১১]
ক. বিয়াম খ. নায়েম গ. টিটিসি ঘ. ইউজিসি |
১৫. বাংলাদেশে কতটি ক্যাডেট কলেজ রয়েছে? [MC ০৪-০৫] |
ক.১২টি খ.১৪টি গ. ১৬টি ঘ. ১০ টি |
| cn
1 ১৬. জন্ম থেকে মৃত্যুর অভিজ্ঞতা অর্জনের পূর্ব পর্যন্ত মানুষ বাস্তব অভিজ্ঞতার মধ্য দিয়ে যে শিক্ষা
অর্জন করে তা হলো- [জাবি ঘ'' ১৫-১৬]
ক. উপ-আনুষ্ঠানিক শিক্ষা খ. পারিবারিক শিক্ষা
গ. অনানুষ্ঠানিক শিক্ষা ঘ. আনুষ্ঠানিক শিক্ষা
১৭. বাংলাদেশের শিক্ষা কয়টি ভ্তরবিশিষ্ট? |স্াঙ্্য অধিদপ্তরের অধীনে স্বাস্থ্য সহকারী, ০8]
ক. yew খ. তিন স্তর গ. চার স্তর ঘ. পাচ স্তর
১৮. বাংলাদেশে প্রাথমিক শিক্ষার বয়সসীমা কত? [প্রাথমকি বিদ্যালয় প্রধান শিক্ষক, ৯৩] :
ক. 8-¢ বছর খ. ৫-৯ বছর গ. ৩-৯ বছর ঘ. ৬-১১বছর ॥
১৯. বাংলাদেশে প্রাথমিক শিক্ষা আইন জারি করা হয় কবে? [প্া.বি.স.শিক্ষক ০০] |
ক. ১৯৭৩ সালে খ. ১৯৭৪ সালে গ.১৯৭৫ সালে ঘ. ১৯৭৬ সালে
২০. বাংলাদেশে বধ্যতমুলক প্রাথমিক শিক্ষা কখন থেকে চালু করা হয়? রকি-অ-বাণিজ্যীপ,ব্যস্থাপনা,০৮-০৯] |
ক. ১ জানুয়ারি, ১৯৮৯ খ. ১ জানুয়ারি, ১৯৯০
গ. ১ জানুয়ারি, ১৯৯১ ঘ. ১ জানুয়ারি, ১৯৯২ | 4
২১. উপমহাদেশে প্রথম নৈশ বিদ্যালয় চালু করা হয় কত সালে? [জেলা সহকারী শিক্ষা অফিসার, ০৩] |
ক. ১৯১৮ সালে খ.১৮৯৯ সালে গ. ১৭৭৮ সালে ঘ. ১৮৭২ সালে
২২. বাংলাদেশে উপানুষ্ঠানিক শিক্ষা বিস্তার কার্যক্রম শুরু হয় কত সালে? |খনিজ সম্পদ মন্ত্রণালয়ের
সহকারী বিস্ফোরক পরিদর্শক, ০৩] |
ক. ১৯৭৬ থ. ১৯৭৯ গ. ১৯৯০ ঘ. ১৯৯১ |
২৩. পল্লী উন্নয়নকল্লে কাজের বিনিময়ে খাদ্য কর্মসূচি কবে চালু হয়? se ees, ov] |
|. ক. ১৯৭২ সালে খ.১৯৭৩ সালে গ.১৯৭৪সালে ঘ. ১৯৭৫ সালে |
| ২৪. প্রথম মহিলা জাতীয় অধ্যাপকের নাম-[বে.শি.নিবন্ধন-১০] ॥ 1
ক. ড. নীলিমা ইবাহিম খ. ড. সুফিয়া আহম্মেদ |
গ. ড. শায়লা সুলতানা ঘ. ড. তাহমিনা খানম ;
২৫. বাংলাদেশে কোনটি নিরক্ষরমুক্ত জেলা? |আইন, বিচার ও সংসদ বিষয়ক মন্ত্রণালয়ের সহকারী সচিব, ০৬]
ক. ময়মনসিংহ খ. রংপুর গ. পঞ্চগড় ঘ. লালমনিরহাট
২৬. কুদরত-ই-খুদা শিক্ষা কমিশন গঠিত হয়- [চবি “F-2’ 15-161 |
ক. ১৯৬২ সালে খ.১৯৬৯ সালে গ.১৯৭২সালে ঘ. ১৯৭৪ সালে
উত্তরমালা
[২২,ঘ ]২৩,গ 1২৪.খ [২৫.ঘ [২৬.গ | |] |
হরির দহ নস
ics CamScanner
','Bangladesh education and University of Dhaka source boundary','recovery-0309-bangladesh-education-prior-questions','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":309,"source_image_sha256":"65ada4d5831a5e802ea5733bbdae36bb1e1897263f6e64a1e44677b87d9d901d","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0309-0313/visual_review_309_313.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0309-0313/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0309-0313/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=309);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0309-0313-v1' ORDER BY started_at DESC LIMIT 1),b.id,310,'educational'::page_kind,'| Educationblog24.Com
a
| ৮ ৫2৯, & . | S| |
RRB OWA)
১৯০৫ সালে বঙ্গ প্রদেশকে বিভক্ত করে ! ১৯১২ সালে ঢাকার নবাব স্যার সলিমুল্লাহর :
SRLS আসাম'' নামে একটি নতুন র নেতৃত্বে এ কে ফজলুল হক ও নবাব সৈয়দ |
| ৮:১8 ৮৬ বঙ্গভঙ্গ : নওয়াব আলী চৌধুরী বঙ্গভঙ্গ রদের ক্ষতিপূরণ |
| নামে পরিচিত। কিন্তু ১৯১১ সালে বঙ্গভঙ্গ রদ ৷ হিস্বে এই অঞ্চলের মানুষের ভাগ্য উন্নয়নে |
৷ করলে পূর্ব বাংলার মুসলমানদের মধ্যে : একটি বিশ্ববিদ্যালয় প্রতিষ্ঠার দাবি জানান।
a GD পূর্ব বাংলার মুসলমানদেরকে FBP করার লক্ষ্যে ১৯১২
ৃ একি বিশ্ববিদ্যালয় প্রতিষ্ঠার ঘোষণা দেন। সে লক্ষ্যে ১৯১২
১. গঠন করা হয়, যা “নাথান কমিশন'' শামে পরিচিত। এই |
| / তৈরী করেন। |
| প্রথম বিশৃযুদ্ধের কারণে র ১৯১৭ সালে ইংরেজ সরকার আরেকটি কমিটি |
৯৪৯ rte গঠন করেন, যার প্রধান ছিলেন মাইকেল |
প্রতিষ্ঠা ও নিবন্ধনের জন্য আইন প্রণয়নের : রেজিস্টার স্যার জোসেফ (পি. জে.)
৷ উদ্দেশ্যে একটি_বিল উত্থাপন করেন। পরে  হার্টস। এই ''স্যাডলার কমিশন'' তাদের |
ই বিলটি “ঢাকা বিশ্ববিদ্যালয় SITS ১৯২০'' : রিপোর্ট প্রদান করে ১৯১৯ সালে।
নামে পাস হয়। |
| ae ৬ = —
| ৪ Er | = Sie এ aa te
ee
“er vi ৮৮). 7০, 3 MG 1 |
1 18711 8827 | =
চি
১৯২০ সালের ১ ডিসেম্বর পি. জে. হার্টসকে উপাচার্য হিসেবে নিয়োগ দিয়ে
| ১৯২১ সালের ১ জুলাই ঢাকা বিশ্ববিদ্যালয় তার আনুষ্ঠানিক যাত্রা শুরু করে। :
ean ~~ Zubair''s GK - 2¢0 ’
——
(3 camscanner
','Bangladesh education and University of Dhaka source boundary','recovery-0310-dhaka-university-establishment-context','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":310,"source_image_sha256":"34d4a30be84bb0062758ad2222c93a2c5cb36b764d6ba0ed133803539e0918a2","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0309-0313/visual_review_309_313.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0309-0313/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0309-0313/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=310);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0309-0313-v1' ORDER BY started_at DESC LIMIT 1),b.id,311,'educational'::page_kind,'Educationblog24.Com
ঢা. “=
* গঠিত হয়- ২৭ মে, ১৯১২। | |
* সদস্য- ১৩ জন। | |
* প্রধান বা সভাপতি ছিলেন- ব্যারিস্টার রবার্ট TI) ge]
* অন্যতম সদস্য ছিলেন- নওয়াব আলী চৌধুরী। 7১. সৈয়দ নওয়াব আলী চৌধুরী |
* সদস্যপদ পেয়েও প্রত্যাখ্যান করেন- রবীন্দ্রনাথ ঠাকুর ।:২. নওয়াব সিরাজুল ইসলাম | .
৬ নাথান কমিশন রিপোর্ট প্রদান করে- ১৯১৩ সালে। alae | |
[৯ দিল্লির বিধান সভায় রিপোর্ট পাশ হয়- ১৯২০ সালে | BPP
* ঢাকা বিশ্ববিদ্যালয় প্রতিষ্ঠা হয়- ১ জুলাই, ১৯২১। ছা
1* ঢাকা বিশ্ববিদ্যালয় প্রতিষ্ঠায় ভূমিকা রাখেন- লর্ড হার্ডিঞ্জ | |
S Lae 5 is 3 A, কোন কোন বইয়ে নাথান কমিশনের সদস্য :
LY এ SAS Lae | দেয়া আছে ১৪ জন; তথ্যটি ST প্রকৃতপক্ষে | ॥
met ’ Sead ae| নাথান কমিশনের সদস্য ছিল ১৩ জন। যার | .
a ‘ Pa মধ্যে মুসলিম সদস্য ছিলেন ৪ জন। a
anger কমিশন | ORR: উইকিপিডিয়া বাংলাপিডিয়া ও পথম আলো] |
* ঢাকা বিশ্ববিদ্যালয় প্রতিষ্ঠার eae oe | |
ঢাকা বিশ্ববিদ্যালয় প্রতিষ্ঠার জন্য জমি দান করেন। =k oe | 3
* তার নামে ঢাবিতে একটি হল রয়েছে। 7 ‘AI :
হাসপাতাল হিসেবে ব্যবহৃত হয়েছে। | Qa |
|
| * টাঙ্গাইলের ধনবাড়ীর জমিদার ছিলেন। দির ৬২
© ঢাকা বিশ্ববিদ্যালয় প্রতিষ্ঠার একজন অন্যতম প্রস্তাবক। 2 ৰা ] ক :
2 চাবিতে তার নামে একটি সিনেট ভবন রয়েছে সে = ভবন |
* বিটিশ সম্রাট পঞ্চম জর্জ | * ভারত সচিব- এডউইন স্যামুয়েল মনটেগ। |
e বিটিশ প্রধানমন্ত্রী- ডেভিড লয়েড জর্জ। & বাংলার গভর্নর- লরেনস ডানডাস। |
[9 বড় লাট (ভাইসরয়)- লর্ড রিডিং। _ & রাজনৈতিক দল- লিবারেল দল (বিটেন)। |
(3 camscanner
','Bangladesh education and University of Dhaka source boundary','recovery-0311-nathan-commission-establishment-figures','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":311,"source_image_sha256":"a055dd69d879353c5e98aca1947f63a17bdd0f19630ef488a2dd9dfd722dac51","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0309-0313/visual_review_309_313.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0309-0313/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0309-0313/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=311);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0309-0313-v1' ORDER BY started_at DESC LIMIT 1),b.id,312,'educational'::page_kind,'_ Educationblog24.Com
তি -- et : re =
, অনুষদ ছিল- ৩ টি (কলা, বিজ্ঞান ও আইন)।
£ বিভাগ ছিল- ১২ টি। সূচনালগ্নে mand Rah *

1» শিক্ষক ছিলেন- ৬০ জন। অনুকরণে পাঠদান, পূর্ণাঙ্গ আবাসিক হল
ছাত্র-ছাত্রী ছিল- ৮৭৭ জন। TAY এবং AAAS শিক্ষা ও গবেষণার |
& ছাত্রী ছিল- ১ জন (লীলা নাগ)। কারণে একে ''প্রাচযের অক্সফোর্ড বলা হয়
» হলছিল- ৩ টি (শহীদুল্লাহ হল, সলিমুল্লাহ মুসলিম হল ও জগন্নাথ হল)।
ঢাকা বিশ্ববিদ্যালয়ের প্রথম ছাত্রী ও অধ্যাপিকা
7] | * সাংবাদিক ও রাজনৈতিক আন্দোলনে সক্রিয় ছিলেন।
ভক্ত ৬ © জন্মু আসামে; পৈতৃক নিবাস সিলেটে ।
. ’ = ॥ | | * কলকাতার বেখুন কলেজ থেকে ইংরেজিতে বি.এ অনার্স করেন।
া ye DY || ৪ ১৯২১ সালে ইংরেজি বিভাগে এম.এ ক্লাসে ভর্তি হন এবং
1 [| ১৯২৩ সালে ডিগ্রি অর্জন করেন।
| // ৪ ঢাকা বিশ্ববিদ্যালয়ের প্রথম এম.এ ডিথ্রিধারী। 1
GTS লীলা নাগ | * ''দীপালী ছাত্রী সংঘ'' গড়ে তোলেন। |
= © নেতাজী সুভাষচন্দ্র বসু''র সহকারি ছিলেন।
oN কলেজের সাবেক OF |
AN i * গণিত বিভাগের ছাত্রী ছিলেন।
১ | | * বাঙালী মুসলিম ছাত্রী হিসেবে তিনিই প্রথম উচ্চ শিক্ষার
ফজিলাতুন্নেসা জোহা | কাজী নজরুল ইসলাম “বর্ধা বিদায়” কবিতাটি লিখেন।
* ঢাকা বিশ্ববিদ্যালয়ের প্রথম নারী শিক্ষক।
| ry e ইতিহাস বিভাগের শিক্ষক ছিলেন।
* পরবর্তীতে তিনি ঢাকা বিশ্ববিদ্যালয় ছেড়ে কলকাতা
| PPT গুপ্তা বেধুন কলেজের অধ্যাপক হন। aS
© ঢাকা বিশ্ববিদ্যালয়ের দ্বিতীয় নারী শিক্ষক।
* ইংরেজি বিভাগের শিক্ষক ছিলেন।
চারুপমা বসু | * ঢাকা বিশ্ববিদ্যালয়ের ছাত্রী সংসদের প্রথম সভাপতি ছিলেন। :
q | Zubair''s GK - ২৫৫ ;
(3 camscanner
','Bangladesh education and University of Dhaka source boundary','recovery-0312-dhaka-university-early-women','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":312,"source_image_sha256":"3388719fc44c9d8edc171d442b4aa1d726ce804b4f37f00b6e9b05d10e98dd34","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0309-0313/visual_review_309_313.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0309-0313/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0309-0313/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=312);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0309-0313-v1' ORDER BY started_at DESC LIMIT 1),b.id,313,'educational'::page_kind,'Educationblog24.Com

* ডাকসু ()110$80)- ঢাকা বিশ্ববিদ্যালয় কেন্দ্রীয় ছাত্র সংসদ | | |
e DUCSU- Dhaka University Cenrtral Students’ Union. .

» বাংলাদেশের দ্বিতীয় সংসদ বলা হয়- ডাকসুকে।

* ডাকসু HSS হয়- ১৯২৪ সালে। র

* প্রথম নির্বাচন অনুষ্ঠিত হয়েছিল- ১৯২৪ সালে (১৯২৪-১৯২৫)।

* প্রথম ভিপি ও জিএস যথাক্রমে- মমতাজ উদ্দিন আহমেদ ও যোগেন্দ্রনাথ দত্ত। |

eo শিক্ষার্থীদের ভোটে নির্বাচিত প্রথম ভিপি ছিলেন- এস এ বারী।
1৪ প্রথম নারী ভিপি ছিলেন- বেগম জাহানারা আক্তার ।
৬ দ্বিতীয় নারী ভিপি ছিলেন- মাহফুজা খানম । |
শান্তনা |
PII" |

fe ইংরেজি প্রতিশব্দ- Convocation. | |
* ঢাকা বিশ্ববিদ্যালয়ের প্রথম সমাবর্তন অনুষ্ঠিত হয়- ১৯২৩ সালে। |

৪ স্বাধীনতার পর প্রথম সমাবর্তন অনুষ্ঠিত হয়- ১৯৯৯ সালে। |

ভুল নয় সঠিক তথ্য জানুন: স্বাধীনতার পর প্রথম সমাবর্তন হওয়ার কথা ছিল ১৯৭৫

সালের ১৫ আগস্ট | শেখ মুজিবুর রহমানের সেখানে উপস্থিত থাকার কথা ছিল । কিন্তু ১৫ :
আগস্ট ভোরে তাকে সপরিবারে হত্যা করায় ১৫ আগস্ট সমাবর্তন অনুষ্ঠিত হয়নি। |
স্বাধীনতার পর প্রথম সমাবর্তন হয়েছে ১৯৯৯ সালে। |

2 ূ মর ও. bre
] $ ঢাবির বর্তমান মনোগ্রামটি চালু আছে- ১৯৭৩ সাল হতে।

© ঢাবির মনোগামে লেখা আছে- শিক্ষাই আলো | |
$ ঢাবির সর্বশেষ মনোগ্রামটির শিল্পী- সমরজিৎ রায় চৌধুরী | |
| & ঢাবির বর্তমান cat শিক্ষাই আলো |

© ঢাবির নীতিবাক্য (Motto)- সত্যের জয় সুনিশ্চিত (Truth will Prevail) |

য় : = : 1 | hy / | হি
Alr রহ ও VE | ৫২ 2
20 1 |i" Bw

Fok ২৬০০] et চর... এ

Le | TubarsGk 2.) ee

nn ll
(3 camscanner
','Bangladesh education and University of Dhaka source boundary','recovery-0313-ducsu-convocation-monogram','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":313,"source_image_sha256":"ac4abc0bda6d887ad5156203c11d0c21e786c2b823a62b8d8f94dc8282048a01","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0309-0313/visual_review_309_313.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0309-0313/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0309-0313/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=313);
INSERT INTO public.content_tags (slug,label,category,description) VALUES ('source-provenance','Source provenance','quality','Source-preserved record without learner-facing claim admission.'),('bangladesh-education-reference','Bangladesh education reference','domain','Education material retained as reviewed source provenance.'),('dhaka-university-reference','University of Dhaka reference','domain','Institutional material retained as reviewed source provenance.'),('historical-institutional-reference','Historical institutional reference','domain','Historical institution material retained as reviewed source provenance.') ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;
COMMIT;