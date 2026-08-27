BEGIN;
INSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) SELECT 'Jubayer''sgk.pdf','e1ab76ab4b36c7bec18506591d0fe1cc9204a46f3edf799ee7c170b4b0c2a1b8','local-ocr-quality-gated-recovery-batch-0299-0303-v1','completed',now(),'{"batch_pages":[299,300,301,302,303],"pipeline_version":"local-ocr-quality-gated-recovery-batch-0299-0303-v1","generated_facts":0,"generated_notes":0,"generated_mcqs":0,"generated_options":0,"generated_flashcards":0,"source_pages":[{"page":299,"review_status":"completed_image_grounded_review","image_sha256":"ee7cce835a3526c0651073b38bf00e304d7aac16123d64a82dc6f2004962c71c","overall_confidence":"medium"},{"page":300,"review_status":"completed_image_grounded_review","image_sha256":"be49a33f336324bec78da5be5b35231ff98fcc299b781bc0d3d8370abcd62f1b","overall_confidence":"medium"},{"page":301,"review_status":"completed_image_grounded_review","image_sha256":"b328e56c7c2593f33cca9005c66b172610ffcb3043c249fb39f236d4c64d68ef","overall_confidence":"medium"},{"page":302,"review_status":"completed_image_grounded_review","image_sha256":"735ec90438742e39a644dd27f9db4fee5ef438f9fd5f5e60883ff60cded75009","overall_confidence":"medium"},{"page":303,"review_status":"completed_image_grounded_review","image_sha256":"e1feb5d4ed202cedb32c54e4fe1eebd088962ee8e2414ef5221a0917c0129f4e","overall_confidence":"medium"}],"verification_counts":{"verified":0,"conflicting":0,"source_attributed":0},"source_anomalies":["All 35 ordered overlap-safe recovery tiles were reviewed.","Local Bangla-English OCR was reconciled with visual evidence; image evidence controlled.","OCR degradation, legal/institutional labels, names, dates, answer keys, source notes, and numeric assertions were preserved without silent correction.","Constitutional, legal, political, government, parliamentary, election, judiciary, commission, officeholder, local-government, historical, named-person, source-noted, numeric, and date-sensitive claims were withheld."],"quality_gates":["Only recovery source pages 299–303 are included.","No reviewed claim clears the conservative quality, policy-safety, internal-consistency, source-note, and authority-verification boundary.","Only reviewed source provenance and page-local topic boundaries are admitted."]}'::jsonb WHERE NOT EXISTS (SELECT 1 FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0299-0303-v1');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Election Commission and Judiciary Source Reference','election-commission-judiciary-source-reference-page-299','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',299,299 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='election-commission-judiciary-source-reference-page-299');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Government Branches Source Reference','government-branches-source-reference-page-300','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',300,300 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='government-branches-source-reference-page-300');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Government and Judiciary Reference Questions and Source Answer Key','government-judiciary-reference-questions-source-page-301','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',301,301 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='government-judiciary-reference-questions-source-page-301');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Government Administration and Local Government Source Reference','government-administration-local-government-source-page-302','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',302,302 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='government-administration-local-government-source-page-302');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Local Government Structure Source Reference','local-government-structure-source-page-303','Source-derived content with completed visual review, conservative classification, and recorded verification decision.',303,303 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics x WHERE x.chapter_id=c.id AND x.slug='local-government-structure-source-page-303');
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0299-0303-v1' ORDER BY started_at DESC LIMIT 1),b.id,299,'educational'::page_kind,'Educationblog24.Com
এ oe “|

গ্রতিষ্ঠা- ৭ জুলাই, ১৯৭২; সদর দণ্তর- আগারগাও, ঢাকা ।
৬ কাজ- নির্বাচন পরিচালনা; মেয়াদ- ৫ বছর। |
1 eae. সাংবিধানিক প্রতিষ্ঠান [সংবিধানের ১১৮(১)নং অনুচ্ছেদ অনুযায়ী গঠিত]।
1৬ নির্বাচন কমিশন একটি- wor, নিরপেক্ষ ও সাংবিধানিক প্রতিষ্ঠান |
* মোট কমিশনার- ৫ জন (প্রধান কমিশনার ও অনধিক 8 জন কমিশনার নিয়ে গঠিত)।
[৯ কমিশনারগণ নিয়োগ পান- রাষ্ট্রপতি কর্তৃক; শপথ পাঠ করান- প্রধান বিচারপতি ।
be দেশের প্রথম প্রধান নির্বাচন কমিশনার ছিলেন- বিচারপতি এম ইদ্রিস।
fe প্রথম নারী নির্বাচন কমিশনার ছিলেন- কবিতা খানম।
* অপারেশন নবযাত্রা হল- ছবিসহ ভোটার তালিকা বা জাতীয় পরিচয়পত্র তৈরী কর্মসূচি |
© জাতীয় পরিচয়পত্রের মেয়াদ- ১৫ বছর।
1* ভোটার তালিকাতুক্ত হতে হলে যোগ্যতা থাকতে হয়-
[১ বাংলাদেশের নাগরিক হতে হবে। |
| ১ বয়স কমপক্ষে ১৮ বছর হতে হবে। :

> প্রয়োজন হলে অপ্রকৃতিষ্থ নয় বলে আদালত কর্তৃক ঘোষিত হতে হবে। |
* গঠিত হয়- ১ নভেম্বর, 2009 সালে। |
* নির্বাহী বিভাগ হতে আলাদা করে স্বাধীন বিচার বিভাগ পৃথক করা হয়- ১ নভেম্বর, 20091 fo
* বাংলাদেশের সর্বোচ্চ আদালতের নাম- সুপ্রিম কোর্ট।
* সুপ্রিম কোর্টের স্থায়ী আসন- ১টি, ঢাকায়।
* সুপ্রিম কোর্টের বিচারপতির অবসরের বয়সসীমা- ৬৭ বছর |
* প্রধান বিচারপতির পরামর্শক্রমে অন্যান্য বিচারপতিদের নিয়োগ করেন- রাষ্ট্রপতি |
* জেলা জজ হলেন- জেলা আদালতের প্রধান বিচারক | ,
«© পারিবারিক আদালতের অধিক্ষেত্র গুলো-

৮ বিবাহ বিচ্ছেদ

৮ দেনমোহরানা, ভরণ-পোষণ |

> অভিভাবকতু ও শিশুদের তন্াবধান সংক্রান্ত মামলা

(3 camscanner
','Bangladesh government-administration source boundary','election-commission-judiciary-source-reference-page-299','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":299,"source_image_sha256":"ee7cce835a3526c0651073b38bf00e304d7aac16123d64a82dc6f2004962c71c","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0299-0303/visual_review_299_303.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0299-0303/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0299-0303/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=299);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0299-0303-v1' ORDER BY started_at DESC LIMIT 1),b.id,300,'educational'::page_kind,'r Educationblog24.Com

Rec ror কাজ

৯ আইন প্রণয়ন, আইন সংশোধন, আইন পরিবর্তন করা।

৯ সংসদীয় সরকার ব্যবস্থায় শাসন বিভাগ তার কাজের জন্য আইন সভার নিকট দায়ী থাকে।

৯ বার্ষিক বাজেট পেশসহ যাবতীয় সরকারি নীতি নির্ধারণ ।

1$ সংবিধান প্রস্তুত, সংশোধন, সংযুক্তি ও বিয়োজন করার ক্ষমতা ।

+ আইন বিভাগ কর্তৃক প্রণীত আইন প্রয়োগ করে শাসনকার্য পরিচালনা করে- শাসন

| বিভাগ বা নির্বাহী বিভাগ । |

* সংসদীয় সরকার ব্যবস্থায় শাসন বিভাগের সদস্যরা (মন্ত্রী) আইন সভায়
বিচারপতিদের নিয়োগ করে।

* রাষ্ট্রের সার্বভৌমত্ব রক্ষা, পররাষ্ট্র সংক্রান্ত কার্যাবলি সম্পাদন ।

0 ‘SF ধার্য ও আদায়ের ব্যবস্থা গ্রহণ |

© রাষ্ট্রপতির সকল কাজই শাসন বিভাগের আওতাধীন বলে বিবেচিত |
> রাষ্ট্র পরিচালনায় সরাসরি অংশ নিয়ে থাকে- নির্বাহী বিভাগ |

৷: ৯ নির্বাহী বিভাগের সর্বোচ্চ কর্তৃপক্ষ- মন্ত্রিপরিষদ । |
> নির্বাহী বিভাগের সর্বোচ্চ প্রশাসনিক কর্তৃপক্ষ- আমলাবর্গ।
> নির্বাহী বিভাগের সদস্যরা দায়বদ্ধ- আইন পরিষদের নিকট । |

| | > নির্বাহী ক্ষমতা চর্চা করেন- প্রধানমন্ত্রী |

৷ 1 ৯ afters নিয়োগ দেন- রাষ্ট্রপতি । কিন্ত মন্ত্রীদের দপ্তর বন্টন করেন প্রধানমন্ত্রী

পারিবারিক আদালতের অধিক্ষেত্র ৫টি

$ আইন অনুযায়ী মামলার বিচারকার্য করা । |= বিবাহ বিচ্ছেদ

6 আইন ও সংবিধানের ব্যাখ্যা প্রদান। * দাম্পত্য অধিকার পুনরুদ্ধার

¢ সংবিধানের রক্ষক ও অভিভাবক | «৩ এল 1 আগার

|% জনগণের মৌলিক অধিকার রক্ষা। « শিশুর অভিভাবকত্ব ও UMN

& বিদেশি নাগরিককে নাগরিকত্ব প্রদান করা | —

(3 camscanner
','Bangladesh government-administration source boundary','government-branches-source-reference-page-300','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":300,"source_image_sha256":"be49a33f336324bec78da5be5b35231ff98fcc299b781bc0d3d8370abcd62f1b","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0299-0303/visual_review_299_303.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0299-0303/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0299-0303/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=300);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0299-0303-v1' ORDER BY started_at DESC LIMIT 1),b.id,301,'educational'::page_kind,'Educationblog24.Com
- “i
এই অধায়ের সাথে জড়িত বিগত বছরের প্রশ্ন |
০১ বিভা Sere whee কার্ধকরভাবে বাস্তবায়নের জন্য একটি স্বাধীন সচিবালয় কবে
ঘুতিষ্ঠা করা হয়া DU খ'' ২৫-২৬।
| জ. ও নভেম্বর, ১৯৭২ খ. ৫ ফেব্রুয়ারি, ২০০৮ |
খা ১৯ GBH, ২০২৫ ঘ. ৩০ নভেম্বর, ২০২৫
৮২. বাংলাদেশে বিচার বিভাগ সরকারের নির্বাহী বিভাগ থেকে আলাদা হয়ে স্বাধীন বিভাগ
হিসেবে স্বীকৃতি লাভ করে- IDU খ ০৯-১০, ঘ'' ০৭-০৮]
ক. ১লা নভেম্বর, ২০০৭ খ. ১লা নভেম্বর, ২০০৮ |
গ. ২১শে নভেম্বর, ২০০৭ ঘ. ১১ই ডিসেম্বর, ২০০৬
০৩. গণতন্ত্রের সবচেয়ে গুরুত্ৃপূর্ণ রক্ষাকবচ- [DU খ'' ইউনিট-১৪-১৫] ]
| ক. বিচার বিভাগের স্বাধীনতা খ. সংবাদপত্রের স্বাধীনতা
| গ. বাক-স্বাধীনতা ঘ. জনগণের অংশগ্রহণ
পিল কোন আলোর eet BCS)
| ক. cane ''রু কার্যালয় খ. বিচার বিভাগ
ot নির্বাহী বিভাগ ঘ. মন্ত্রিপরিষদ বিভাগ |
০৫. বাংলাদেশ সরকারি কর্ম কমিশন কবে গঠিত হয়? (45 BCS)
| ক. উ এপ্রল,১৯৭২ খ.৭ এপ্রিল, ১৯৭২ গ. ৮ এপ্রিল, ১৯৭২ ঘ. ৫ মার্চ, ১৯৭২
৷ ০৬. কোনটি বিচার বিভাগের কাজ নয়? (45 BCS)
| ক. আইনের প্রয়োগ খ. আইনের ব্যাখ্যা গ. সংবিধানের ব্যাখ্যা ঘ. সংবিধান প্রণয়ন
| ০৭. বাংলাদেশের প্রধান আইন কর্মকর্তা হলেন-(43 BCS)
ক. আইনমন্ত্রী খ. আইন সচিব |
| =, আ্যাটর্নি জেনারেল ঘ. প্রধান বিচারপতি
০৮. বাংলাদেশ সরকারি কর্ম কমিশন সংবিধানের কত অনুচ্ছেদ অনুযায়ী গঠিত? (37, 40, 42 BCS)
ক. ১৩৬ খ. ১৩৭ গ. ১৩৮ ঘ. ১৪০
ob. বাংলাদেশের প্রধান বিচারপতি নিয়োগ দেন কে? [39 BCS]
ক. রাষ্ট্রপতি খ. জাতীয় সংসদ
গ. প্রধানমন্ত্রী ঘ. স্পীকার
| ১০. বাংলাদেশের আপিল বিভাগের মোট বিচারক কতজন? [33 8031
> 4, ২১ গ. ৯ ঘ. ১৫
১১. প্রধানমন্ত্রীর নিয়োগের বাইরে রাষ্ট্রপতি প্রধানমন্ত্রীর পরামর্শ ব্যতীত কোন কাজ এককভাবে
করতে পারেন? 121 BCS! j
ক. প্রধান নির্বাচন কমিশনার Pray  খ. প্রধান বিচারপতি নিয়োগ
| গ. অডিটর ভেনারেল নিয়োগ ঘ. পাবলিক সার্ভিস কমিশনের চেয়ারম্যান নিয়োগ
১২. সুর্িম কোর্টের আপিল বিভাগের ফুল বেঞ্চ কয়জন বিচারপতি নিয়ে গঠিত হয়? IMC 04-051
ক. ৯ GA খ. ১১ জন গ. ৭ জন ঘ. ৩ জন
(ae [কতক Tar [ed [ew [aa [oa
|1৯.ক 1১০,ক 1১১.খ 1১২,খ eee ee ee eee
= Zubair’s GK - ২৪৪. —
৪ di
(3 camscanner
','Bangladesh government-administration source boundary','government-judiciary-reference-questions-source-page-301','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":301,"source_image_sha256":"b328e56c7c2593f33cca9005c66b172610ffcb3043c249fb39f236d4c64d68ef","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0299-0303/visual_review_299_303.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0299-0303/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0299-0303/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=301);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0299-0303-v1' ORDER BY started_at DESC LIMIT 1),b.id,302,'educational'::page_kind,'রর Educationblog24.Com
= pon লি - 77 7 সি
॥ BFAD ও তার বিভাগসমূহের অফিসগুলোকে একত্রে বলা হয়- সাঁচবালয়।
॥ বাংলাদেশ সরকারের প্রশাসনিক স্নায়ু কেন্দ্র- সচিবালয় |
॥ মন্ত্রণালয়ের প্রশাসনিক প্রধানকে বলে- সচিব।
॥ সচিব কাজ করেন- সংশিষ্ট মন্ত্রীর অধীনে
॥ মন্ত্রণালয়ের নির্বাহী কর্মকর্তাকে বলা হয়- মন্ত্রী।
| — =
রর রাত্রে পদ
॥ মন্ত্রণালয়ের প্রশাসনিক প্রধানকে বলা হয়- সচিব। |
॥ রাষ্ট্রপতি ও প্রধানমন্ত্রীর সচিবালয়ের প্রধান- yey সচিব।
॥ বিভাগের প্রশাসনিক প্রধানকে বলা হয়- বিভাগীয় কমিশনার |
॥ জেলা প্রশাসনের প্রশাসনিক প্রধানকে বলা হয়- ডেপুটি কমিশনার |
॥ উপজেলা প্রশাসনের প্রধানকে বলা হয়- উপজেলা নির্বাহী অফিসার।
© সিটি কর্পোরেশনের প্রধানের পদবী- মেয়র |
॥ পৌরসভার নির্বাহী প্রধানকে বলা হয়- মেয়র |
& ইউনিয়ন পরিষদের প্রধানের পদবী হল- চেয়ারম্যান |
॥ বাংলাদেশ সরকারের নির্বাহী প্রধান হলেন- প্রধানমন্ত্রী |
* পুলিশের সবচেয়ে বড় কর্মকর্তাকে বলা হয়- ইন্সপেক্টর জেনারেল অব পুলিশ। |
* পুলিশ বিভাগের প্রধানকে বলা হয়- ডি. আই. জি।
+ মেট্রোপলিটন পুলিশের প্রধানকে বলা হয়- পুলিশ কমিশনার |
ইউনিয়ন পরিহ পোরস -ছোট শহর
(সর্বনিম্ন স্তর ) (সর্বনিম্ন স্তর)
খ
উপজেলা পরিষদ সিটি কর্পোরেশন-বড় শহর
jo fa (সর্বোচ্চ স্তর)
(সর্বোচ্চ স্তর) দি
| Zubair’s GK - ২৪৫ | |
১
(3 camscanner
','Bangladesh government-administration source boundary','government-administration-local-government-source-page-302','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":302,"source_image_sha256":"735ec90438742e39a644dd27f9db4fee5ef438f9fd5f5e60883ff60cded75009","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0299-0303/visual_review_299_303.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0299-0303/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0299-0303/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=302);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-recovery-batch-0299-0303-v1' ORDER BY started_at DESC LIMIT 1),b.id,303,'educational'::page_kind,'_.__600021101101090924.0017
4
ছ্ানীয় সরকারের স্তর বিন্যাস... |
& চেয়ারম্যানদের শপথ পাঠ করান- জেলা PTD
৯ গঠিত ১৩ জন সদসা নিয়ে wih সরকার পরতিঠানসমূহের
| ৯ ১ জদ নির্বাচিত নী নির্বাচনে জনপ্রতিনিধি হওয়ার
৮». উ জন সদসা (১) SUG থেকে) সপ an |
১ ৩ জন মহলা NPT (সংরক্ষিত আসনে) at ব্যস ৮ rai pian
1৯ মহিলা সদস্য গ্রতি ৩ ওয়ার্ডে- ১ জন। WA সরকার প্রতিষ্ঠানসমূহের
উিপজেলা পরিষদ কার্যকাল ৫ বছর। ms
৪ STS. হুসেইন মুহাম্মদ এরশাদ |
৬ বিল পাস হয়- ১৯৮২ সালে।
* দেশের সকল থানাকে উপজেলায় রূপান্তরিত করা হয়- ১৯৮৩ |
* প্রথম উপজেলা নির্বাচন অনুষিত হয়- ১৯৮৫ সালে।
[৯ ১ জন চেয়ারম্যান ক RA :
> ১ জন ভাইস চেয়ারম্যান ।* জেলা পরিষদ: সকলে পরোক্ষভাবে
> ১ জন মহিলা ভাইস চেয়ারম্যান 1 নির্বাচনের মাধ্যমে নির্বাচিত হন। 3
> উপজেলার আওতাধীন ইউনিয়ন 1% উপজেলা পরিষদ: চেয়ারম্যান : |
পরিষদসমূহের চেয়ারম্যানবৃন্দা ; ভোটারদের প্রত্যক্ষ ভোটে নির্বাচিত হন।! |
পৌরসভার মেয়র (যদি থাকে) 1* ইউনিয়ন পরিষদ: সকলে জনগণের. 1
” ৩ জন মহিলা সদস্য ই সরাসরি ভোটে নির্বাচিত হন। 7
১৮ © সিটি কর্পোরেশন: মেয়র ও কাউলিলরগণ ;
* বর্তমানে জেলা সংখ্যা- ৬৪টি। . ; জনগণের সরাসরি ভোটে নির্বাচিত হন।
* সকল মহকুমা জেলায় উন্নীত করা হয়- ১৯৮৪ সালে।
* গঠিত হয়- | |
| ৮ ১ জন চেয়ারম্যান |
> ১৫ জন সদস্য |
৮ ৫ জন মহিলা সদস্য (সংরক্ষিত আসনে) |
* Wa সরকার বিষয়ক মন্ত্রণালয়ের অধীনে জেলা- ৬১টি। |
* পার্বত্য চট্টগ্রাম বিষয়ক মন্ত্রণালয়ের অধীনে জেলা- wld ।
| 2465 তন সদ অপসারণ জন টোটো ২/৩ FRONTS! |
* বাংলাদেশের পৌরসভাগুলোকে শ্রেণিবিভাগ করা হয়- জনসংখ্যারভিত্তিতে। |
* বর্তমানে সিটি কর্পোরেশন রয়েছে- ১৩টি (সর্বশেষ- বগুড়া সিটি কর্পোরেশন) |
1* সিটি কর্পোরেশনের প্রধানকে বলা হয়- মেয়র।
* (সিটি কর্পোরেশনের মেয়র প্রতিমন্ত্রীর মর্যাদা ভোগ করেন।
চা Zubair’s 0২৪৬ চা
=
ics CamScanner
','Bangladesh government-administration source boundary','local-government-structure-source-page-303','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; upright OCR reconciled with visual evidence; no learner-facing records classified for import.','{"physical_source_page":303,"source_image_sha256":"e1feb5d4ed202cedb32c54e4fe1eebd088962ee8e2414ef5221a0917c0129f4e","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0299-0303/visual_review_299_303.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0299-0303/classification_decisions.md","verification_report":"/home/ubuntu/dontonyo/supabase/batch-0299-0303/external_verification.md","orientation_note":"Rendered source image visually verified upright before local OCR."}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=303);
INSERT INTO public.content_tags (slug,label,category,description) VALUES ('source-provenance','Source provenance','quality','Source-preserved record without learner-facing claim admission.'),('bangladesh-constitutional-reference','Bangladesh constitutional reference','domain','Constitutional material retained as reviewed source provenance.'),('government-institutions-reference','Government institutions reference','domain','Government and institution material retained as reviewed source provenance.') ON CONFLICT (slug) DO UPDATE SET label=EXCLUDED.label,category=EXCLUDED.category,description=EXCLUDED.description;
COMMIT;