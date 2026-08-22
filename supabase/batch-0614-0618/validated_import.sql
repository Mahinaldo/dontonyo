BEGIN;
INSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) VALUES ('Jubayer''sgk.pdf','a9f93287e960dc96d1e1c45836169a139f2ad7b1dfc7d2497e63cdfd74483bb2','local-ocr-quality-gated-batch-0614-0618-v1','completed',now(),'{"batch_pages":[614,615,616,617,618],"pipeline_version":"local-ocr-quality-gated-batch-0614-0618-v1","source_pages":[{"page":614,"review_status":"completed_image_grounded_review","image_sha256":"b5533c717121197c8c949f50554081f35b87d2d3ae2ffe7852db2e942bd47a82"},{"page":615,"review_status":"completed_image_grounded_review","image_sha256":"b6e00cb59b2783c30b96b7c516257eea6d9e839ba9f4e730f8a732dbf7eab99d"},{"page":616,"review_status":"completed_image_grounded_review","image_sha256":"84514f43cce2c6c42e000f7173bcbff1c9c4e04f6e2157c2a57e31e3c387b7c4"},{"page":617,"review_status":"completed_image_grounded_review","image_sha256":"b8f476978a1805227b557adc277c0d4cd66ce972007e50f77ed74b8528607fe8"},{"page":618,"review_status":"completed_image_grounded_review","image_sha256":"37906244097967b873cbf0a9a8e6fe1e8cd972c51fcd9b2d7cd7a69dc88730b9"}],"generated_facts":16,"generated_notes":5,"generated_mcqs":2,"generated_options":8,"verification_counts":{"verified":15,"conflicting":0,"source_attributed":8}}'::jsonb);
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Europe country reference','europe-country-reference-614','Source-preserved content with completed visual review.',614,26 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id=c.id AND t.slug='europe-country-reference-614');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Ukraine, Ireland and Switzerland reference','ukraine-ireland-switzerland-reference','Source-preserved content with completed visual review.',615,27 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id=c.id AND t.slug='ukraine-ireland-switzerland-reference');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Africa map reference','africa-map-reference','Source-preserved content with completed visual review.',616,28 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id=c.id AND t.slug='africa-map-reference');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'South Africa and apartheid reference','south-africa-apartheid-reference','Source-preserved content with completed visual review.',617,29 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id=c.id AND t.slug='south-africa-apartheid-reference');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Nelson Mandela reference','nelson-mandela-reference','Source-preserved content with completed visual review.',618,30 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics t WHERE t.chapter_id=c.id AND t.slug='nelson-mandela-reference');
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-batch-0614-0618-v1' ORDER BY started_at DESC LIMIT 1),b.id,614,'educational','5
ইউরোপের অন্যান্য গুরুতুপূরণ দেশ
=
© « ট্রউরোপের প্রবেশদ্বার en হয়, aula 18151 1551, |
© « এডলফ হিটলার জণ/গহণ করেন” 9170/1য|
: © Classical Music এর মাড়ুমি বলা হয়- সন)য়াকে |
টি * জার্মানি ছাড়া বিশ্বের মে দেশের ধায় সবল নাগরিক জার্মান ভাষায় কণা বলে” A
গু) * প্রথম পো্টকার্ড চালু হয়” fury |
5
© o কোন নদী Ce |
5 $ ইতালির মুল ভূ. গঞ্জের ভিতরে wales |
= $ ভ্যাটিব্যান cm পূর্ণিবীর সবচেয়ে ছোট দেশ এব, স্যান ম্যারিনো হচ্ছে” পাঠানতম এগাতঃ
&
5 © ওয়াটার-পর''র মুদ্ধক্ষের অবষ্ঠিত- বেলগিয়ামে।
O * ইউরোপের “ককপিট'' বা ''রণক্ষে'' হিসেবে ব্যবহৃত হয়েছে- বেলজিয়াম |
পারি * দ্বিতীয় বিশুযুদ্ধে ''বাফার স্টেট ছিল যে দেশ- বেলগিয়াম।
« বেলগ্িয়ামকে নামকরণ করা হয়- বেলগায় জাতিগোষ্ঠীর নামানুসারে |
* দক্ষিণ ইউরোপের আয়তাকার দেশ- AGA |
. ইউরোপের aura সমুদ্রাভিযান কেন্দ্র- 7H |
* ইউরোপের সাং্ছৃতিক নগরী- পর্তুগালের পোর্তো |
* “মহাসদুদ্র অভিযারীকদের দেশ'' বলা হয়- পর্ঠগালকে।
* ভাাক্ষো দা গামা ছিলেন- পর্ঠগালের নাগরিক |
* বিশে জনসংপ্যার WHE সবচেয়ে বেশি- মোনাকোতে |
* আয়তনে জাতিসংের HAA দেশ- মোনাকো।
«৪ GUANA মে দেশে কোন আয়কর দিতে হয় না- মোনাকোতে |
« কসোভো ANAM থেকে স্বাধীনতা লাভ করে- ২০০৮ AIC |
* কসোভোর রাজধানীর নাম- fafa |
«৪ wore পথম ধ্রেসিডেন্ট- ফাতমির সেজদিউ।
« ইরোপের তৃতীয় স্বাধীন মুসলিম দেশ- কসোভো |
Zubair''s GK - ৫৫৭
','Europe','europe-country-reference-614','medium','local_ocr_with_image_grounded_review','tesseract-ben+eng','Clockwise source recovery with complete tile review.','{"physical_source_page":614,"image_sha256":"b5533c717121197c8c949f50554081f35b87d2d3ae2ffe7852db2e942bd47a82","review_status":"completed_image_grounded_review"}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=614);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-batch-0614-0618-v1' ORDER BY started_at DESC LIMIT 1),b.id,615,'educational','_ =
<—e U
)
— * ইউক্রেন স্বাধীনতা লাভ করে- সোভিয়েত ইউনিয়নের কাছ থেকে; ১৯৯১ A ৯
O * অরেঞ্জ বিপ্রব সংঘটিত হয়- ২০০৪ FIC |
১ * ইউরোপের রুটির ঝুঁড়ি'' বলা হয়- ইউক্রেনকে।
: * ইউক্রেনের চেরনোবিলে ভয়াবহতম পারমাণবিক দুর্ঘটনা ঘটে- ১৯৮৮ সালে।
ST » ইউক্রেনের যে অঞ্চল নিয়ে রাশিয়া ও পাশ্চাত্য দেশের মধ্যে বিরোধ দেখা দেয়- Fer
GN * ক্রিমিয়ার অবস্থান- কৃষ্ণঠসাগরের উত্তর উপকূলে |
© * ক্রিমিয়া যুদ্ধ সংঘটিত হয়- রাশিয়া ও ফান্স, যুক্তরাজ্য ও অটোম্যান সাগ্রাজ্যের মধ্যে
Oo * রাশিয়া ক্রিমিয়া দখল করে- ২০১৪ সালে।
০১ =e
চু আয়ারল্যান্ড
O * পান্নার দ্বীপ'' বলা হয়- আয়ারল্যান্ডকে।
টে * আয়ারল্যান্ডের প্রথম নাম- আইরিশ ফ্রি স্টেট |
টে * পটেটো দুর্ভিক্ষ সংঘটিত হয়েছিল- আয়ারল্যান্ডে ।
— * আয়ারল্যান্ডকে The Emerald Isle বলা হয়- অনুপম প্রাকৃতিক সৌন্দর্যের জন্য।
ঢা জালা
LL * সুইজারল্যান্ডের জেনেভা নগরী বিখ্যাত- ঘড়ি শিল্পের জন্য |
* সুইজারল্যান্ডের রাজ্যকে বলা হয়- ক্যান্টন।
* পূর্বে নিরপেক্ষ দেশ হিসেবে পরিচিত ছিল- সুইজারল্যান্ড |
* ইউরোপের খেলার মাঠ'' বলা হয়- সুইজারল্যান্ডকে।
* “সম্মেলনের শহর'' বলা হয়- সুইজারল্যান্ডের জেনেভাকে।
* গোথার্ড বেস টানেলটির অবস্থান- সুইজারল্যান্ডে।
০১. কোন দেশকে ইউরোপের রুটির ঝুড়ি বলা হয়? (44 BCS)
ক. জার্মানি খ. ইতালি গ. পোল্যান্ড ঘ. ইউক্রেন
OR, কোন সালে রাশিয়া ক্রিমিয়া দখল করে? (44 BCS)
ক. ২০১০ খ. ২০১২ গ. ২০১৪ ঘ. ২০১৬
০৩. কোন দেশে এডলফ হিটলার জন্ুগ্রহণ করেন? (DU ঘ'' ১১-১২/রাবি-রাষ্ট্রবিজ্ঞান, ০৫-০৬)
ক. জার্মানি খ. সুইজারল্যান্ড
গ. অস্টিুয়া ঘ. চেকোস্রোভাকিয়া
উত্তরমালা
Zubair’s GK - ৫৫৮
','Europe','ukraine-ireland-switzerland-reference','medium','local_ocr_with_image_grounded_review','tesseract-ben+eng','Clockwise source recovery with complete tile review.','{"physical_source_page":615,"image_sha256":"b6e00cb59b2783c30b96b7c516257eea6d9e839ba9f4e730f8a732dbf7eab99d","review_status":"completed_image_grounded_review"}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=615);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-batch-0614-0618-v1' ORDER BY started_at DESC LIMIT 1),b.id,616,'educational','রি
5
৮7
—— E
আফ্রিকা মহাদেশ
AFRICA MAP -
O Conary tetends (৮
C) were ee oe “ums sere
= care “ A
= Poo , ve ww ? es , lth adden
Cl ১৩:০3) 8৮. real | /পপ
©) 1OOO merare Md insoes ae ,
O x te
— Abeer, 1 4
QO “OCEAN : y
0 7 ae এ
O ee eee
—_—
৬.
7 আফিকা মহাদেশের অঞ্চল ভিত্তিক ৫৪ টি শ্বাধীন দেশ
৫, লিবিয়
O উত্তর Ges ১. আলজেরিয়া ৩. মিসর ৬. দক্ষিণ
| [7] ২. তিউনিশিয়া 8. সুদান সপ
১. Uae ৬. জিন্বাবুয়ে ১০, মরি
২. রুয়ান্ডা ৭. জাদিয়া ১১, মোজাদিক
পূর্ব আফিকা | ১৩টি | ৩. বুরুন্তি ৮. মাদাগাক্ষার ১২. সিচেলিস
8. কমোরুস ৯. মালাউই ১৩. তার্জানিয়া
ৃ ৫. কেনিয়া
উত্তর-পূর্ব 18৪টি | ১*সোমালিয় ©, ইথিওপয়া
আফিকা ২. ইরিত্রিয়া 8, জিবুতি
১. আযাঙ্গোলা ৮. সাওটোযে
৫. নিরক্গীয় গিনি
২.ক্যামেকন ৬ গ্যাবন ত্যান্ড প্রিঙ্সিপি
মধ্য আফিকা ৩. কঙ্গো | ৯. মধ্য আফ্রিকা
৪.কঙ্গোএজাত্বা ৭" চাদ প্রজাতন
ao ১. টান্সাহাতান ৩. Tag
ater [৫টি [২ ফি £''বতসেয়ানা ৫. লেসেখো
১,আইর্জরকোস্ট ৭. Mile ১২, মা
পশ্চিম ২. ঘানা ৮, গিনি বিসাউ ১৩. মৌরিতানিয়া
আফ্রিকা ৩. টোগো ৯. গাদিয়া ১৪. লাইবেরিয়া
8. সেনেগাল  ১০,.বারকিনাফাসো ১৫. নাইজেরিয়া
৫, বেনিন ১১. সিয়েরা লিওন ১৬. নাইজার
৬. কাবো ভার্দে
নুনু সোয়াজিল্যান্ডের নাম পরিবর্তন করে রাখা হয়েছে ''ইসওয়াতিনি''।
71118111801 - ৫৫৯
চু
','Europe','africa-map-reference','medium','local_ocr_with_image_grounded_review','tesseract-ben+eng','Clockwise source recovery with complete tile review.','{"physical_source_page":616,"image_sha256":"84514f43cce2c6c42e000f7173bcbff1c9c4e04f6e2157c2a57e31e3c387b7c4","review_status":"completed_image_grounded_review"}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=616);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-batch-0614-0618-v1' ORDER BY started_at DESC LIMIT 1),b.id,617,'educational','— আফ্রিকা মহাদেশের দক্ষিণে অবহ্থিত। দক্ষিণ আফিকার রাষ্ট্রীয় সীমানার অভ্যন্তরে
০ লেসেখো নামে একটি সার্বভৌম রাষ্ট্র আছে। ডাচ ইস্ট ইন্ডিয়া কোম্পানির লোকের ১৬৫২
১ সালে দক্ষিণ আফ্রিকার Cape of Good Hope বা ''উত্তমাশা অন্তরীপে'' প্রথম উপনিবেশ
স্বপন করে। ইউরোপের বাইরে সারা পৃথিবীতে শ্বেতাঙ্গদের এই প্রথম উপনিবেশ। ১৯৪৮

os সালের নির্বাচনে স্বেতাঙ্গদের দল ''ন্যাশনাল পার্টি থেকে ডি. এফ. মালান প্রধানমন্ত্রী নির্বাচিত
A হলে তার কর্মসূচিতে ''বর্ণবাদ নীতি'' গৃহীত হয়। অর্থাৎ ''বর্ণবাদ নীতি'' বা Apartheid চালু
©) হয় ১৯৪৮ সালে। যাতে শাসন ব্যবস্থা সম্পূর্ণরূপে শ্বেতাঙ্গদের দখলে থাকে এবং কৃষ্ণাঙ্গদের!
গু. সকল রাজনৈতিক ও সামাজিক অধিকার থেকে বঞ্চিত রাখা হয়। = :
io a ae
Cc ¢ Apartheid অর্থ- পৃথকীকরণ। eB |
Oo + দ. আফ্রিকায় ''বাবাদ নীতি'' চালু হয়- ১৯৪৮ সালে। ও.
টে + বর্ণবাদ নীতির সময়কাল- ১৯৪৮-১৯৯৪ সাল। ক, |
6১ * বর্ণবাদ নীতি প্রচলিত ছিল- দক্ষিণ OTST | |
—_ + দ. আফ্রিকায় বর্ণবাদ নীতির প্রবক্তা- জেমস হার্জগ। chet আফ্রিকায় বরবাদ |
© + বর্ণবৈষম্যবিরোধী আন্দোলন করেন- নেলসন ICT | পা |
LL ¢ দ. আফ্রিকার শেষ শ্বেতাঙ্গ রষ্ট্রপতি- LEE. AF!  জেমসহার্জগ।

© দ. আফ্রিকার প্রথম কৃষ্ণাঙ্গ রাষ্ট্রপতি- নেলসন ম্যান্ডেলা (১৯৯৪)।

© দ. আফ্রিকায় শ্বেতাঙ্গ শাসনের অধীনে ছিল- ৩৪২ বছর (১৬৫২-১৯৯৪)। |

+ বাদ নীতি নিয়ে সমালোচনার জেরে দ. SPST কমনওয়েলথ ত্যাগ করে- ১৯৬১ সালে। |

© দক্ষিণ আফ্রিকা পুনরায় কমনওয়েলথে যোগদান করে- ১৯৯৪ সালে।

© ANC- দক্ষিণ আফ্রিকার কৃষ্ণাঙ্গদের প্রথম রাজনৈতিক সংগঠন |

@ ANC গঠিত হয়- ১৯১২ সালে; বুম ফন্টেইন শহরে ।

$ ANC কে নিষিদ্ধ ঘোষণা করা হয়- ১৯৬০ সালে

$ ANC থেকে নিষেধাজ্ঞা প্রত্যাহার করা হয়- ১৯৯০ সালে।

¢ যে ভারতীয় ANC এর নেতা ছিলেন- TAT গান্ধী |

¢ Cape of Good Hope বা ''উত্তমাশা অন্তরীপ'' অবস্থিত- দক্ষিণ আফ্রিকায় |

© ''রেইনবো নেশন'' বলা হয়- দক্ষিণ আফ্রিকাকে ।

¢ আফ্রিকার মহাদেশের একমাত্র শিল্লোনমত দেশ- দক্ষিণ আফ্রিকা ।

¢ হিস্ট mer. দক্ষিণ আফ্রিকায় অবস্থিত একটি নদী বন্দর।

$ ডেসমন্ড টুটু হলেন- দ. আফ্রিকার শান্তিতে নোবেলজয়ী ধর্মযাজক ও অধিকার আন্দোলনকমী।

/011)9115 GK - ৫৬০ | |
™ এ
','Europe','south-africa-apartheid-reference','medium','local_ocr_with_image_grounded_review','tesseract-ben+eng','Clockwise source recovery with complete tile review.','{"physical_source_page":617,"image_sha256":"b8f476978a1805227b557adc277c0d4cd66ce972007e50f77ed74b8528607fe8","review_status":"completed_image_grounded_review"}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=617);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-batch-0614-0618-v1' ORDER BY started_at DESC LIMIT 1),b.id,618,'educational','্ :
9 নেলসন মেন্ডেলা
— @ জন্ম- ১৮ জুলাই, ১৯১৮। Py —
গু. + ম্যান্ডেলা দিবস- ১৮ জুলাই। গগ |
C) @ GER দ. আফ্রিকার ইস্টার্ন কেপের কুনু ্রামে। ) চারি |
. @ মৃত্যু- ০৫ ডিসেম্বর, ২০১৩। ৪ /--৮৯
IT @ রাজনৈতিক দল- ANC. 5 ee /
শী + ''আফিকার গান্ধী" বলা হয়। Somes 4
©) * অন্য নাম- মাদিবা, তাতা, খুলু, ডালিভুঙ্গা ও রোলিহলাহলা।
O © নাশকতামূলক কার্যক্রমের সাথে জড়িত থাকার অভিযোগে গ্রেফতার- ১৯৬২ সালে।
O © নির্বাসন- সেন্ট রোবেন দ্বীপে ১৯৬৪ AIT Sug সালের ‘ue আর ম্যান্ডেলা
= © সেন্ট রোবেন ্বীপ অবস্থিত- আটলান্টিক TAMA | ছিলেন ''৪৬৬'' নং কয়েদি। এই দুইয়ের: i
2 © কারারদ্ধ ছিলেন- ১৯৬৪-১৯৯০ সাল (২৭ বছর)।: TANT এইডস বিরোধী প্রচারণার |
ve 1 সাংকেতিক নাম ৪৬৬৬৪''।
O © তীর এইডস বিরোধী প্রচারণার সাংকেতিক নাম- ৪৬৬৬৪।
= + দক্ষিণ আফিকার শেষ শ্বেতাঙ্গ প্রেসিডেন্ট এফ.ডব্রিউ.ডি. ক্লার্কের সাথে যৌথভাবে
মি, নোবেল শান্তি পুরষ্কার লাভ করেন- ১৯৯৩ FCT |
LL $ বাংলাদেশে আগমনের সময় সফর সঙ্গী ছিলেন- ইয়াসির আরাফাত (১৯৯৭)। ৰ
+ প্রতিষ্ঠাতা- Say YES for the children.
© ম্যান্ডেলা Wala অবস্থিত- WT, STF
+ উল্লেখযোগ্য ae
[0110 Walk to Freedom জর Conversation with Myself.
@ বিখ্যাত উক্তি- Education is the most powerful weapon which
you can use to change the world.
$ ম্যান্ডেলাকে নিয়ে নির্মিত চলচ্চিত্র- দ্যা হিউম্যান ফ্যাক্টর ।
$ দক্ষিণ আফ্রিকার রাজধানী- তিনটি । &
৮ প্রশাসনিক রাজধানী- প্রিটোরিয়া। ক,
> আইনসভা রাজধানী- কেপটাউন। | kK)
> বিচার বিভাগীয় রাজধানী- ব্রমফন্টেইন। ই 2.
_ জুলু লু
o স্বর্ণ খনির জন্য বিখ্যাত- জোহান্সবার্গ। দক্ষিণ আফ্রিকার প্রধান আদিবাসী
@ হীরক খনির জন্য বিখ্যাত- frat |
Zubair’s GK - ৫৬১
— ee :
','Europe','nelson-mandela-reference','medium','local_ocr_with_image_grounded_review','tesseract-ben+eng','Clockwise source recovery with complete tile review.','{"physical_source_page":618,"image_sha256":"37906244097967b873cbf0a9a8e6fe1e8cd972c51fcd9b2d7cd7a69dc88730b9","review_status":"completed_image_grounded_review"}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages s WHERE s.book_id=b.id AND s.source_page=618);
INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Adolf Hitler — Austria birth','Adolf Hitler was born in Austria.','Source-derived reference with verification status.',614,'Adolf Hitler — Austria birth','Adolf Hitler was born in Austria.',3,'high','5b337b5d5a522673ef848a6c721aec737c3823ca175e582cfeebf28d08ec2288' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='europe-country-reference-614' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text; INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,verification_status,confidence,verification_sources,audit_note) SELECT 614,'fact',(SELECT id FROM public.gk_facts WHERE canonical_hash='5b337b5d5a522673ef848a6c721aec737c3823ca175e582cfeebf28d08ec2288'),'Adolf Hitler was born in Austria.','verified','high','["https://www.britannica.com/biography/Adolf-Hitler"]'::jsonb,'Batch 0614–0618 verification ledger.' WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type='fact' AND v.claim_text='Adolf Hitler was born in Austria.');
INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Waterloo — Belgium location','The Battle of Waterloo took place in present-day Belgium.','Source-derived reference with verification status.',614,'Waterloo — Belgium location','The Battle of Waterloo took place in present-day Belgium.',3,'high','f1b87712b834768e5edc4a241bf91dd3d37a611e322332995d2e42eb60d6f831' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='europe-country-reference-614' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text; INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,verification_status,confidence,verification_sources,audit_note) SELECT 614,'fact',(SELECT id FROM public.gk_facts WHERE canonical_hash='f1b87712b834768e5edc4a241bf91dd3d37a611e322332995d2e42eb60d6f831'),'The Battle of Waterloo took place in present-day Belgium.','verified','high','["https://www.britannica.com/event/Battle-of-Waterloo"]'::jsonb,'Batch 0614–0618 verification ledger.' WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type='fact' AND v.claim_text='The Battle of Waterloo took place in present-day Belgium.');
INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Vasco da Gama — Portuguese nationality','Vasco da Gama was Portuguese.','Source-derived reference with verification status.',614,'Vasco da Gama — Portuguese nationality','Vasco da Gama was Portuguese.',3,'high','2aa103e6d6c6f6c6bd959933186e722aba79e9fe270a08cafe786d0ad8ba27f1' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='europe-country-reference-614' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text; INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,verification_status,confidence,verification_sources,audit_note) SELECT 614,'fact',(SELECT id FROM public.gk_facts WHERE canonical_hash='2aa103e6d6c6f6c6bd959933186e722aba79e9fe270a08cafe786d0ad8ba27f1'),'Vasco da Gama was Portuguese.','verified','high','["https://www.britannica.com/biography/Vasco-da-Gama"]'::jsonb,'Batch 0614–0618 verification ledger.' WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type='fact' AND v.claim_text='Vasco da Gama was Portuguese.');
INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Kosovo — 2008 declaration boundary','Kosovo declared independence in 2008; this is retained as a historic diplomatic reference rather than an unqualified recognition claim.','Source-derived reference with verification status.',614,'Kosovo — 2008 declaration boundary','Kosovo declared independence in 2008; this is retained as a historic diplomatic reference rather than an unqualified recognition claim.',3,'high','c6948b65e907ef522d256aa0fa5cec94c935cff30701c8838949a8fb78666c1a' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='europe-country-reference-614' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text; INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,verification_status,confidence,verification_sources,audit_note) SELECT 614,'fact',(SELECT id FROM public.gk_facts WHERE canonical_hash='c6948b65e907ef522d256aa0fa5cec94c935cff30701c8838949a8fb78666c1a'),'Kosovo declared independence in 2008; this is retained as a historic diplomatic reference rather than an unqualified recognition claim.','source_attributed','high','["https://www.un.org/en/about-us/member-states/yugoslavia"]'::jsonb,'Batch 0614–0618 verification ledger.' WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type='fact' AND v.claim_text='Kosovo declared independence in 2008; this is retained as a historic diplomatic reference rather than an unqualified recognition claim.');
INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Ukraine — 1991 independence','Ukraine gained independence in 1991 after a December referendum in the dissolution context of the Soviet Union.','Source-derived reference with verification status.',615,'Ukraine — 1991 independence','Ukraine gained independence in 1991 after a December referendum in the dissolution context of the Soviet Union.',3,'high','cc37871769742f180921f518a05178495b0451e53074bb9f0422f9de162610ec' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='ukraine-ireland-switzerland-reference' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text; INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,verification_status,confidence,verification_sources,audit_note) SELECT 615,'fact',(SELECT id FROM public.gk_facts WHERE canonical_hash='cc37871769742f180921f518a05178495b0451e53074bb9f0422f9de162610ec'),'Ukraine gained independence in 1991 after a December referendum in the dissolution context of the Soviet Union.','verified','high','["https://www.britannica.com/place/Ukraine"]'::jsonb,'Batch 0614–0618 verification ledger.' WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type='fact' AND v.claim_text='Ukraine gained independence in 1991 after a December referendum in the dissolution context of the Soviet Union.');
INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Orange Revolution — 2004','Ukraine’s Orange Revolution took place in 2004.','Source-derived reference with verification status.',615,'Orange Revolution — 2004','Ukraine’s Orange Revolution took place in 2004.',3,'high','c61d615c9e2a2084f059db82ff5e7d1a30681b8bc32f1942701be266947ec10e' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='ukraine-ireland-switzerland-reference' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text; INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,verification_status,confidence,verification_sources,audit_note) SELECT 615,'fact',(SELECT id FROM public.gk_facts WHERE canonical_hash='c61d615c9e2a2084f059db82ff5e7d1a30681b8bc32f1942701be266947ec10e'),'Ukraine’s Orange Revolution took place in 2004.','verified','high','["https://www.britannica.com/event/Orange-Revolution"]'::jsonb,'Batch 0614–0618 verification ledger.' WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type='fact' AND v.claim_text='Ukraine’s Orange Revolution took place in 2004.');
INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Ireland — Emerald Isle','The source uses Emerald Isle as a traditional name for Ireland.','Source-derived reference with verification status.',615,'Ireland — Emerald Isle','The source uses Emerald Isle as a traditional name for Ireland.',3,'high','5fc280be20e7b734440a738f0f844c0a414f78e7a2b0cc33bc02179c2314e182' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='ukraine-ireland-switzerland-reference' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text; INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,verification_status,confidence,verification_sources,audit_note) SELECT 615,'fact',(SELECT id FROM public.gk_facts WHERE canonical_hash='5fc280be20e7b734440a738f0f844c0a414f78e7a2b0cc33bc02179c2314e182'),'The source uses Emerald Isle as a traditional name for Ireland.','source_attributed','high','[]'::jsonb,'Batch 0614–0618 verification ledger.' WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type='fact' AND v.claim_text='The source uses Emerald Isle as a traditional name for Ireland.');
INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Switzerland — cantons','Switzerland is organized into cantons.','Source-derived reference with verification status.',615,'Switzerland — cantons','Switzerland is organized into cantons.',3,'high','7e5ae071319d5f7f023e485a11e2a93290867933bcbea5cfe9c6c0cf484a4371' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='ukraine-ireland-switzerland-reference' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text; INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,verification_status,confidence,verification_sources,audit_note) SELECT 615,'fact',(SELECT id FROM public.gk_facts WHERE canonical_hash='7e5ae071319d5f7f023e485a11e2a93290867933bcbea5cfe9c6c0cf484a4371'),'Switzerland is organized into cantons.','verified','high','["https://www.britannica.com/place/Switzerland"]'::jsonb,'Batch 0614–0618 verification ledger.' WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type='fact' AND v.claim_text='Switzerland is organized into cantons.');
INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Apartheid — 1948 policy','Apartheid was the name applied to the National Party’s racial-segregation policy in South Africa from 1948.','Source-derived reference with verification status.',617,'Apartheid — 1948 policy','Apartheid was the name applied to the National Party’s racial-segregation policy in South Africa from 1948.',3,'high','15f526ca3f6b1b7422f8819829270ceaccf97984b8a440a080bc1586bf58bcbe' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='south-africa-apartheid-reference' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text; INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,verification_status,confidence,verification_sources,audit_note) SELECT 617,'fact',(SELECT id FROM public.gk_facts WHERE canonical_hash='15f526ca3f6b1b7422f8819829270ceaccf97984b8a440a080bc1586bf58bcbe'),'Apartheid was the name applied to the National Party’s racial-segregation policy in South Africa from 1948.','verified','high','["https://history.state.gov/milestones/1989-1992/apartheid"]'::jsonb,'Batch 0614–0618 verification ledger.' WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type='fact' AND v.claim_text='Apartheid was the name applied to the National Party’s racial-segregation policy in South Africa from 1948.');
INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,'ANC — ban and unbanning','The African National Congress was outlawed in 1960 and the ban was lifted in 1990.','Source-derived reference with verification status.',617,'ANC — ban and unbanning','The African National Congress was outlawed in 1960 and the ban was lifted in 1990.',3,'high','15fc7da86fbd43ee1c83510042f5b996d1ecde7402ea649fd27006cf4a2a9345' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='south-africa-apartheid-reference' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text; INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,verification_status,confidence,verification_sources,audit_note) SELECT 617,'fact',(SELECT id FROM public.gk_facts WHERE canonical_hash='15fc7da86fbd43ee1c83510042f5b996d1ecde7402ea649fd27006cf4a2a9345'),'The African National Congress was outlawed in 1960 and the ban was lifted in 1990.','verified','high','["https://history.state.gov/milestones/1989-1992/apartheid"]'::jsonb,'Batch 0614–0618 verification ledger.' WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type='fact' AND v.claim_text='The African National Congress was outlawed in 1960 and the ban was lifted in 1990.');
INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Mandela — first Black president','Nelson Mandela became South Africa’s first Black president in 1994.','Source-derived reference with verification status.',617,'Mandela — first Black president','Nelson Mandela became South Africa’s first Black president in 1994.',3,'high','fc3dc3d508fca2411ed66d439bb00fcd98c9e2f9a83bc9573cca2cda9b3cce6f' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='south-africa-apartheid-reference' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text; INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,verification_status,confidence,verification_sources,audit_note) SELECT 617,'fact',(SELECT id FROM public.gk_facts WHERE canonical_hash='fc3dc3d508fca2411ed66d439bb00fcd98c9e2f9a83bc9573cca2cda9b3cce6f'),'Nelson Mandela became South Africa’s first Black president in 1994.','verified','high','["https://history.state.gov/milestones/1989-1992/apartheid"]'::jsonb,'Batch 0614–0618 verification ledger.' WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type='fact' AND v.claim_text='Nelson Mandela became South Africa’s first Black president in 1994.');
INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Lesotho — enclave','Lesotho is an enclave surrounded by South Africa.','Source-derived reference with verification status.',617,'Lesotho — enclave','Lesotho is an enclave surrounded by South Africa.',3,'high','74b9fd2e5ba1d64317c751b14f3f0296eaaa875bbb975837bf3b9ef30fd9f1de' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='south-africa-apartheid-reference' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text; INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,verification_status,confidence,verification_sources,audit_note) SELECT 617,'fact',(SELECT id FROM public.gk_facts WHERE canonical_hash='74b9fd2e5ba1d64317c751b14f3f0296eaaa875bbb975837bf3b9ef30fd9f1de'),'Lesotho is an enclave surrounded by South Africa.','verified','high','["https://www.britannica.com/place/Lesotho"]'::jsonb,'Batch 0614–0618 verification ledger.' WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type='fact' AND v.claim_text='Lesotho is an enclave surrounded by South Africa.');
INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Mandela — birth and death','Nelson Mandela was born on 18 July 1918 and died on 5 December 2013.','Source-derived reference with verification status.',618,'Mandela — birth and death','Nelson Mandela was born on 18 July 1918 and died on 5 December 2013.',3,'high','b418bcf6f1e592723ba2007a447b6844da09265a7261ed10197a1556e06d22f1' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='nelson-mandela-reference' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text; INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,verification_status,confidence,verification_sources,audit_note) SELECT 618,'fact',(SELECT id FROM public.gk_facts WHERE canonical_hash='b418bcf6f1e592723ba2007a447b6844da09265a7261ed10197a1556e06d22f1'),'Nelson Mandela was born on 18 July 1918 and died on 5 December 2013.','verified','high','["https://www.nelsonmandela.org/biography"]'::jsonb,'Batch 0614–0618 verification ledger.' WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type='fact' AND v.claim_text='Nelson Mandela was born on 18 July 1918 and died on 5 December 2013.');
INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Mandela — ANC affiliation','Nelson Mandela joined the African National Congress in 1944.','Source-derived reference with verification status.',618,'Mandela — ANC affiliation','Nelson Mandela joined the African National Congress in 1944.',3,'high','68471637fb73a3084b8ec712888d56b3fda4885afbae0c83855f0d112cbf3f5f' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='nelson-mandela-reference' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text; INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,verification_status,confidence,verification_sources,audit_note) SELECT 618,'fact',(SELECT id FROM public.gk_facts WHERE canonical_hash='68471637fb73a3084b8ec712888d56b3fda4885afbae0c83855f0d112cbf3f5f'),'Nelson Mandela joined the African National Congress in 1944.','verified','high','["https://www.nelsonmandela.org/biography"]'::jsonb,'Batch 0614–0618 verification ledger.' WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type='fact' AND v.claim_text='Nelson Mandela joined the African National Congress in 1944.');
INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Mandela — 1990 release','Nelson Mandela was released from prison on 11 February 1990.','Source-derived reference with verification status.',618,'Mandela — 1990 release','Nelson Mandela was released from prison on 11 February 1990.',3,'high','fbce6a141fdc421bcf815b2242325e9eb21948c8090db4dbb6cd87c5d9ba7a08' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='nelson-mandela-reference' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text; INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,verification_status,confidence,verification_sources,audit_note) SELECT 618,'fact',(SELECT id FROM public.gk_facts WHERE canonical_hash='fbce6a141fdc421bcf815b2242325e9eb21948c8090db4dbb6cd87c5d9ba7a08'),'Nelson Mandela was released from prison on 11 February 1990.','verified','high','["https://www.nelsonmandela.org/biography"]'::jsonb,'Batch 0614–0618 verification ledger.' WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type='fact' AND v.claim_text='Nelson Mandela was released from prison on 11 February 1990.');
INSERT INTO public.gk_facts (book_id,chapter_id,topic_id,title,fact_text,explanation,source_page,source_section,source_excerpt,importance,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Mandela and de Klerk — 1993 Nobel','Nelson Mandela and F.W. de Klerk jointly received the Nobel Peace Prize in 1993.','Source-derived reference with verification status.',618,'Mandela and de Klerk — 1993 Nobel','Nelson Mandela and F.W. de Klerk jointly received the Nobel Peace Prize in 1993.',3,'high','9df6ba8a16dc8ddd0c6488a004c7378a445f69673ff11b025fc1cc50ffb55f57' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='nelson-mandela-reference' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET fact_text=EXCLUDED.fact_text; INSERT INTO public.fact_verifications (source_page,entity_type,entity_id,claim_text,verification_status,confidence,verification_sources,audit_note) SELECT 618,'fact',(SELECT id FROM public.gk_facts WHERE canonical_hash='9df6ba8a16dc8ddd0c6488a004c7378a445f69673ff11b025fc1cc50ffb55f57'),'Nelson Mandela and F.W. de Klerk jointly received the Nobel Peace Prize in 1993.','verified','high','["https://www.nelsonmandela.org/biography"]'::jsonb,'Batch 0614–0618 verification ledger.' WHERE NOT EXISTS (SELECT 1 FROM public.fact_verifications v WHERE v.entity_type='fact' AND v.claim_text='Nelson Mandela and F.W. de Klerk jointly received the Nobel Peace Prize in 1993.');
INSERT INTO public.gk_notes (book_id,chapter_id,topic_id,title,content,source_page,source_section,display_order,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Europe country-reference exclusion boundary','Unsupported superlatives, tax claims, current-policy claims, and unqualified Kosovo status statements are excluded.',614,'Europe country-reference exclusion boundary',614,'high','605598866eaf4874959796a1377c31304b03f0546dbc5aa9ee986c8a30ba214d' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='europe-country-reference-614' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET content=EXCLUDED.content;
INSERT INTO public.gk_notes (book_id,chapter_id,topic_id,title,content,source_page,source_section,display_order,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Ukraine source-error boundary','The scan’s Chernobyl date (1988) conflicts with IAEA documentation of the 1986 accident and is excluded. Crimea content is historic/diplomatic only.',615,'Ukraine source-error boundary',615,'high','5f7ffe62dc17660cfb992efd0d8553b692196f7c48bedcc50ec57e38447d1857' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='ukraine-ireland-switzerland-reference' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET content=EXCLUDED.content;
INSERT INTO public.gk_notes (book_id,chapter_id,topic_id,title,content,source_page,source_section,display_order,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Africa map/table caveat','The source’s Africa regional country table is retained as a source-attributed memorization note; numerical counts and map-level country groupings are not converted into current facts.',616,'Africa map/table caveat',616,'high','c4c4cebfaf0b16da8ee6681955068e6a32001cac96ce387a919fda4b763121ce' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='africa-map-reference' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET content=EXCLUDED.content;
INSERT INTO public.gk_notes (book_id,chapter_id,topic_id,title,content,source_page,source_section,display_order,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Apartheid source boundary','Only externally corroborated historic apartheid, ANC, Mandela, and geographic lines are retained. Colonial priority claims, rhetorical framing, and unsupported superlatives are withheld.',617,'Apartheid source boundary',617,'high','6f0dc72c006176a4000ca6705702dce94f3ebf80bad3c25006f9fcc3be94d715' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='south-africa-apartheid-reference' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET content=EXCLUDED.content;
INSERT INTO public.gk_notes (book_id,chapter_id,topic_id,title,content,source_page,source_section,display_order,confidence,canonical_hash) SELECT b.id,c.id,t.id,'Mandela biography source boundary','Biographical facts are retained only where externally corroborated. Attributed quotations, aliases, and uncorroborated prison-code or visit lines are not neutral facts.',618,'Mandela biography source boundary',618,'high','639be122276614fa2ef1c903479423d16e3e1b1f7f7e4650b02914fbe9782acf' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug='nelson-mandela-reference' WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET content=EXCLUDED.content;
INSERT INTO public.gk_mcqs (book_id,chapter_id,topic_id,question,correct_option,explanation,source_page,source_section,source_question_number,difficulty,confidence,canonical_hash) SELECT b.id,c.id,t.id,'কোন সালে রাশিয়া ক্রিমিয়া দখল করে?','গ','Printed key visually reviewed; status in verification ledger.',615,'বিগত বছরের প্রশ্ন','02',3,'high','09d6aa1904f5f223b7a3b7a94a5cfad1b814d8e0fd148c4881f3b04076cf9583' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug=(SELECT slug FROM public.topics WHERE source_page=615 AND chapter_id=c.id LIMIT 1) WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET correct_option=EXCLUDED.correct_option;
INSERT INTO public.gk_mcq_options (mcq_id,option_key,option_text,display_order,is_correct) SELECT m.id,'ক','২০১০',1,false FROM public.gk_mcqs m WHERE m.canonical_hash='09d6aa1904f5f223b7a3b7a94a5cfad1b814d8e0fd148c4881f3b04076cf9583' AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options q WHERE q.mcq_id=m.id AND q.option_key='ক');
INSERT INTO public.gk_mcq_options (mcq_id,option_key,option_text,display_order,is_correct) SELECT m.id,'খ','২০১২',2,false FROM public.gk_mcqs m WHERE m.canonical_hash='09d6aa1904f5f223b7a3b7a94a5cfad1b814d8e0fd148c4881f3b04076cf9583' AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options q WHERE q.mcq_id=m.id AND q.option_key='খ');
INSERT INTO public.gk_mcq_options (mcq_id,option_key,option_text,display_order,is_correct) SELECT m.id,'গ','২০১৪',3,true FROM public.gk_mcqs m WHERE m.canonical_hash='09d6aa1904f5f223b7a3b7a94a5cfad1b814d8e0fd148c4881f3b04076cf9583' AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options q WHERE q.mcq_id=m.id AND q.option_key='গ');
INSERT INTO public.gk_mcq_options (mcq_id,option_key,option_text,display_order,is_correct) SELECT m.id,'ঘ','২০১৬',4,false FROM public.gk_mcqs m WHERE m.canonical_hash='09d6aa1904f5f223b7a3b7a94a5cfad1b814d8e0fd148c4881f3b04076cf9583' AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options q WHERE q.mcq_id=m.id AND q.option_key='ঘ');
INSERT INTO public.gk_mcqs (book_id,chapter_id,topic_id,question,correct_option,explanation,source_page,source_section,source_question_number,difficulty,confidence,canonical_hash) SELECT b.id,c.id,t.id,'কোন দেশে এডলফ হিটলার জন্মগ্রহণ করেন?','গ','Printed key visually reviewed; status in verification ledger.',615,'বিগত বছরের প্রশ্ন','03',3,'high','2a423d151ee99c1d247921f7cb8d46fe56264488a1300d7b87075cda0b27c65b' FROM public.books b JOIN public.chapters c ON c.book_id=b.id AND c.slug='europe' JOIN public.topics t ON t.chapter_id=c.id AND t.slug=(SELECT slug FROM public.topics WHERE source_page=615 AND chapter_id=c.id LIMIT 1) WHERE b.title='Jubayer''s GK' ON CONFLICT (canonical_hash) DO UPDATE SET correct_option=EXCLUDED.correct_option;
INSERT INTO public.gk_mcq_options (mcq_id,option_key,option_text,display_order,is_correct) SELECT m.id,'ক','জার্মানি',1,false FROM public.gk_mcqs m WHERE m.canonical_hash='2a423d151ee99c1d247921f7cb8d46fe56264488a1300d7b87075cda0b27c65b' AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options q WHERE q.mcq_id=m.id AND q.option_key='ক');
INSERT INTO public.gk_mcq_options (mcq_id,option_key,option_text,display_order,is_correct) SELECT m.id,'খ','সুইজারল্যান্ড',2,false FROM public.gk_mcqs m WHERE m.canonical_hash='2a423d151ee99c1d247921f7cb8d46fe56264488a1300d7b87075cda0b27c65b' AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options q WHERE q.mcq_id=m.id AND q.option_key='খ');
INSERT INTO public.gk_mcq_options (mcq_id,option_key,option_text,display_order,is_correct) SELECT m.id,'গ','অস্ট্রিয়া',3,true FROM public.gk_mcqs m WHERE m.canonical_hash='2a423d151ee99c1d247921f7cb8d46fe56264488a1300d7b87075cda0b27c65b' AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options q WHERE q.mcq_id=m.id AND q.option_key='গ');
INSERT INTO public.gk_mcq_options (mcq_id,option_key,option_text,display_order,is_correct) SELECT m.id,'ঘ','চেকোস্লোভাকিয়া',4,false FROM public.gk_mcqs m WHERE m.canonical_hash='2a423d151ee99c1d247921f7cb8d46fe56264488a1300d7b87075cda0b27c65b' AND NOT EXISTS (SELECT 1 FROM public.gk_mcq_options q WHERE q.mcq_id=m.id AND q.option_key='ঘ');
INSERT INTO public.flashcards (subject_id,book_id,chapter_id,topic_id,front_text,back_text,source_type,source_id,source_key) SELECT (SELECT id FROM public.subjects ORDER BY created_at LIMIT 1),f.book_id,f.chapter_id,f.topic_id,f.title,f.fact_text,'fact',f.id,'batch0614-0618:fact:'||f.id FROM public.gk_facts f WHERE f.source_page BETWEEN 614 AND 618 AND NOT EXISTS (SELECT 1 FROM public.flashcards z WHERE z.source_key='batch0614-0618:fact:'||f.id); INSERT INTO public.search_documents (entity_type,entity_id,title,body,english_metadata) SELECT 'fact',f.id,f.title,f.fact_text,'Status-marked GK fact | source page '||f.source_page FROM public.gk_facts f WHERE f.source_page BETWEEN 614 AND 618 AND NOT EXISTS (SELECT 1 FROM public.search_documents z WHERE z.entity_type='fact' AND z.entity_id=f.id); COMMIT;