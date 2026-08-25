BEGIN;
INSERT INTO public.import_runs (source_filename,source_sha256,pipeline_version,status,completed_at,audit) SELECT 'Jubayer''sgk.pdf','de13f5743c7265bfcc00d120f01eed8ff019f5141d048abb57d619996b2e3fd7','local-ocr-quality-gated-batch-0844-0848-v1','completed',now(),'{"batch_pages":[844,845,846,847,848],"pipeline_version":"local-ocr-quality-gated-batch-0844-0848-v1","generated_facts":0,"generated_notes":0,"generated_mcqs":0,"generated_options":0,"generated_flashcards":0,"source_pages":[{"page":844,"review_status":"completed_image_grounded_review","image_sha256":"07e863e27ffdbc34f77eed2baa894b961b9ab149a4ec1b64ac3ddc8a22e27b15","overall_confidence":"medium"},{"page":845,"review_status":"completed_image_grounded_review","image_sha256":"1d1709eb4ed87357ed6e2cfaa688176815711e2cb4a1029e5449f963df78e100","overall_confidence":"medium"},{"page":846,"review_status":"completed_image_grounded_review","image_sha256":"948810f4d7990deb2bb247371e2901847ff8fc4545f7ee327691d33b5aea9507","overall_confidence":"medium"},{"page":847,"review_status":"completed_image_grounded_review","image_sha256":"7a70689070227c3ce2425ff13331647ef813777fdfc7693a170b33f235b24a44","overall_confidence":"medium"},{"page":848,"review_status":"completed_image_grounded_review","image_sha256":"19226583b727019f09b08607b25189ce73beb42c8bbcae86182764fbbb341664","overall_confidence":"medium"}],"verification_counts":{"verified":0,"conflicting":0,"source_attributed":0},"source_anomalies":["All 35 ordered overlap-safe source tiles were reviewed.","Local Bangla-English OCR was reconciled with visual evidence; image evidence controlled.","Geographic, border, identity, political, religious, biographical and source-imprecise claims were withheld."],"quality_gates":["Only source pages 844–848 are included.","No reviewed claim clears the conservative quality and safety boundary.","Only reviewed source provenance and page-local topic boundaries are admitted."]}'::jsonb WHERE NOT EXISTS (SELECT 1 FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-batch-0844-0848-v1');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Museums, tunnels and bridges reference source boundary','museums-tunnels-bridges-reference-boundary-844','Source-derived content with completed visual review, conservative classification, and recorded verification.',844,844 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics z WHERE z.chapter_id=c.id AND z.slug='museums-tunnels-bridges-reference-boundary-844');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Museum and tunnel exam reference source boundary','museum-tunnel-exam-reference-boundary-845','Source-derived content with completed visual review, conservative classification, and recorded verification.',845,845 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics z WHERE z.chapter_id=c.id AND z.slug='museum-tunnel-exam-reference-boundary-845');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Ethnicity reference source boundary','ethnicity-reference-boundary-846','Source-derived content with completed visual review, conservative classification, and recorded verification.',846,846 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics z WHERE z.chapter_id=c.id AND z.slug='ethnicity-reference-boundary-846');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Ethnicity exam reference source boundary','ethnicity-exam-reference-boundary-847','Source-derived content with completed visual review, conservative classification, and recorded verification.',847,847 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics z WHERE z.chapter_id=c.id AND z.slug='ethnicity-exam-reference-boundary-847');
INSERT INTO public.topics (chapter_id,title,slug,description,source_page,display_order) SELECT c.id,'Women firsts reference source boundary','women-firsts-reference-boundary-848','Source-derived content with completed visual review, conservative classification, and recorded verification.',848,848 FROM public.chapters c JOIN public.books b ON b.id=c.book_id WHERE b.title='Jubayer''s GK' AND c.slug='europe' AND NOT EXISTS (SELECT 1 FROM public.topics z WHERE z.chapter_id=c.id AND z.slug='women-firsts-reference-boundary-848');
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-batch-0844-0848-v1' ORDER BY started_at DESC LIMIT 1),b.id,844,'educational'::page_kind,'a
Educationblog24.Com
r
১.
Hee fe Le
& অবস্থান- প্যারিস, ফাল। + অবন্থান- লন্ডন, যুক্তরাজ্য |
i a*
| $ প্রতিষ্ঠিত হয়- ১৭৯৩ সালে। $ প্রতিষ্ঠিত হয়- ১৮৩৫ সালে।
» বিশেষ we লিওনার্দো দ্য Ral $ বিশেষ wy বিখ্যাত ব্যক্তিদের |.
_ ''মোনালিসা'' চিত্রকর্মটি এখানে রক্ষিত আছে মোমের মূর্তি এখানে রক্ষিত আছে। | |
- a এ * ia
পভ খুশি । a |
মু ao. “ee Tuna L/ ya
a Py ২ aa tig a oft
t মত অভি » | ক বিশ্বের দীর্ঘতম বৃহত্তম ও গাভার তম টানেলটির |
: Egle 757 ee দৈর্ঘ্য ৫৭.০৯ কিলোমিটার |
ge £:2১৯ ৫
| Ce) | $ টানেলটি সংযুক্ত করেছে সুইজারল্যান্ডের জুরিখ
ধার বেসটাদেল শহর ও ইতালির মিলান শহরকে ।
| জার টানেল অবস্থিত ইংলিশ চ্যানেলে''
| 12 55..51 Z পরিচিত
মাহি... ইউরো টানেল নামেও পারাচত।
টা: ৫০.৫ কিট |
gir | +
| ২৯১. | $ টানেলটি সংযুক্ত করেছে যুক্তরাজ্য ও SPF
ছি $ টানেল দিয়ে চলাচলকরী ট্রেনের নাম ইউরো স্টার''।
aM Sarr ae :
ra ; 2, am $ টানেলটি পরিচালনা করা ইউরো টানেল''।
| চ্যানেল টানে, কোম্পানির সদর দপ্তর ফ্রান্সের প্যারিসে |
| Ree Py, | $ টানেলটির দৈর্ঘ্য cove কিলোমিটার
রঃ ot \ Ey
|...) 0] | + টানেলটি সংযুক্ত করেছে জাপানের হনসু ও
উরি শা নাঃ oo
AAO. | হোক্কাইডো দ্বীপকে।
বশ্বের বিখ্যাত সেতু |
a ‘ : : |
he ‘ ৮. | ৃ 4
‘omens বে বিজ'' wafie- ভার্জিনিয়া, যুক্তরাষ্ট্র
9 পিস ব্রিজ'' বা শান্তি সেতু'' অবস্থিত- নায়াথা নদীর ওপর যুক্তরাষ্ট্র ও কানাড়া সীমানায়।
৮৮০3 ae) a 10985, 7৮81 ba ঃ
peters লি এ See Pg ৪5:78: [2 ‘a ak Th জিব
Be hd ১০] @ wae. ২21
বক্তা নি i |: 11, 1 | ze TIT হে - |
এর a, ase ৯1 1 ০০177118৮ ‘vs Ca ছু, are ১
২5... গোল্ডেন গেট ব্রিজ পিস বিজ বা শাস্তি OTR
| iy Feeears এ : ener i 1 eel - or¢ |
jee ?
2 —
CamScanner
','World history','museums-tunnels-bridges-reference-boundary-844','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; local OCR reconciled with visual evidence; only classified records imported.','{"physical_source_page":844,"source_image_sha256":"07e863e27ffdbc34f77eed2baa894b961b9ab149a4ec1b64ac3ddc8a22e27b15","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0844-0848/visual_review_844_848.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0844-0848/classification_decisions.md"}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages z WHERE z.book_id=b.id AND z.source_page=844);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-batch-0844-0848-v1' ORDER BY started_at DESC LIMIT 1),b.id,845,'educational'::page_kind,'Educationbloge4.Com
1১. পৃথিবীর গভীরতম ছান- (45 BCS) ১2০
| ক) ম্যারিয়ানা ট্রেঞ্চ খ) ee সী
গ) বৈকাল হুদ ঘ) লোহিত সাগর
২. ল্যুভর মিউজিয়াম কোথায় অবস্থিত? (DU খ'' ১৬-১৭) ৃ
ক) মিউনিখ খ) রোম |
গ) লন্ডন ঘ) প্যারিস
৩. বছরের সবচেয়ে দীর্ঘ দিন কোনটি? (DU খ ১৬-১৭)
| ক) ২০ জুন খ) ২১ জুন |
| গ) ২২ জুন ঘ) ২৭ জুন
ৃ 18. আয়তনে পৃথিবীর সবচেয়ে বড় মুসলিম দেশ কোনটি?
ক) ইন্দোনেশিয়া থ) কাজাকিস্তান ৃ
গ) সৌদি আরব ঘ) ইরান :
| ৫. লাইব্রেরি অব RA অবস্থিত- (DU ¥ ০৬-০৭ খ'' ০৪-০৫)
ক)লন্ডন ব) প্যারিস
|  গ) ওয়াশিংটন ডিসি ঘ) আমস্টারভাম
৬. পৃথিবীর বৃহত্তম গ্রন্থাগার- (DU খ ৯৭১৮)
ক) দ্য লেনিন লাইবেরি. খ) দ্য ইউনাইটেড লাইব্রেরি অব কংথেস
গ) বিবলিওথেক ন্যাশনাল ঘ) দ্য ব্রিটিশ লাইব্রেরি
৭, বোদলীয়ান গ্রন্থাগারটি কোন প্রতিষ্ঠানের প্রধান গবেষণা গ্রস্থাগারঃ (DU ¥ ১২-১৩)
ক) লুভেনের ক্যাথিলিক বিশ্বৃবিদ্যালয় ব) নটরডেম বিশ্ববিদ্যালয়
গ) weer বিশ্ববিদ্যালয় ঘ) ange বিশ্ববিদ্যালয়
৮, Beneath which sea has china recently unveiled its plans to bulld
the world’s longest underwater tunnel? (PKBL Officer-14)
| ক) South China Sea -.- খ) East China sea
গ) Bohai sea ~ ঘ) Yellow sea
p>. মাদাম তুশো-র জাদুঘরে কী রক্ষিত আছে? (চবি-ছ, ০৭-০৮)
ক) ম্যাদাম তুশোর ব্যক্তিগত সংগ্রহ খ) বিখ্যাত চিত্রকরদের আকা চিত্রকর্ম |
গ) বিখ্যাত ব্যক্তিদের cmap ঘ) বিখ্যাত ব্যক্তিদের মোমের মূর্তি |
(১০, কোন দেশে ল্যুভর মিউজিয়াম অবস্থিত? (জবি-খ, ০৮-০৯)
ক) যুক্তরাজ্য খ) যুক্তরাষ্ট্র ণ
| 5) স্াশিয়া | ঘ) ফ্রান্স |
>*[ew [owe len [ew [at [va [se |
. 2 টি sos : :
) | 2
ics CamScanner
','World history','museum-tunnel-exam-reference-boundary-845','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; local OCR reconciled with visual evidence; only classified records imported.','{"physical_source_page":845,"source_image_sha256":"1d1709eb4ed87357ed6e2cfaa688176815711e2cb4a1029e5449f963df78e100","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0844-0848/visual_review_844_848.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0844-0848/classification_decisions.md"}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages z WHERE z.book_id=b.id AND z.source_page=845);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-batch-0844-0848-v1' ORDER BY started_at DESC LIMIT 1),b.id,846,'educational'::page_kind,'| Educationblog24.Com.
1 নাগা- ভারতের নাগাল্যান্ডের পাহাড়ী এলাকার উপজাতি। ৃ
> দ্রাবিড়- দক্ষিণ ভারত ও শ্রীলংকায় বসবাসকারী অনার্ধ জাতি। :
৮১৯ টোডা- ভারতের নীলগিরি পর্বত উপজাতি | |
> বেদে- ভারতের যাযাবর জাতি। ৰ
> মুর- উত্তর আফ্রিকায় বসবাসরত ইসলাম ধর্মাবলম্বী উপজাতি | |
> কাফির- দক্ষিণ আফ্রিকার যুদ্ধে পারদশী জাতি।
[> বুশম্যান- দক্ষিণ আফিকার নামিবিয়া, বতসোয়ানায় ও কালাহারি মরুভূমির |
| আশেপাশে বসবাসরত উপজাতি |
> হটেনটট- দক্ষিণ আফ্রিকার আদিম অধিবাসী | }
> পিগমী- আফিকার নিরক্ষীয় অঞ্চল কঙ্গোতে বসবাসরত পৃথিবীর সর্বাপেক্ষা খর্বকায় |
বা খাটো মানুষ । |
> জুলু- দক্ষিণ আফিকার নাটালের feat আদি অধিবাসী | :
৮ বান্টু- সেন্ট্রাল এবং দক্ষিণ আফিকার নিথোদেরকে বান্টু বলা হয়।
> ছুন- মধ্য এশিয়ার একটি উপজাতি গোষ্ঠী | :
> উইঘুর- চীনের উপজাতি | |
> Peat মধ্য ও দক্ষিণ-পশ্চিম আফিকার কালো মানুষ । |
> কুদ্দী- ইরাক, ইরান ও তুরক্ষের অন্তর্ভূক্ত কুর্দস্তানের উপজাতি | |
> আফিদি- পাকিস্তানের উত্তর-পশ্চিম সীমান্ত প্রদেশে বসবাসকারী উপজাতি | |
> বেদুইন- আরবের যাযাবর জাতি।
> তাতার- সাইবেরিয়া, চেচনিয়া, তুর্কিভ্ভান ও cor অঞ্চলের জাতি |
> মঙ্গোলীয়- চীন, জাপান, মায়ানমারের অধিবাসী | |
| ৮ ছুতু ও টুটসি- রুয়ান্ডা ও বুরুত্ডিতে যুদ্ধে লিপ্ত দু''টি উপজাতি | |
> রেড ইনভিয়ান- যুক্তরাষ্ট্রের রকি পর্বত ও মিসৌরি নদীর মধ্যবর্তী স্থানে বসবাসকারী ॥
যুক্তরাষ্ট্রের আদিম অধিবাসী |
রাজারা
| এ ‘ is : y i ay | : ra ৮ | | '' :
Hf a? , রি be Ra |
: i 2 : রঃ এ টন GK - ৭৮৭ was 7 xd
(3 camscanner
','World history','ethnicity-reference-boundary-846','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; local OCR reconciled with visual evidence; only classified records imported.','{"physical_source_page":846,"source_image_sha256":"948810f4d7990deb2bb247371e2901847ff8fc4545f7ee327691d33b5aea9507","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0844-0848/visual_review_844_848.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0844-0848/classification_decisions.md"}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages z WHERE z.book_id=b.id AND z.source_page=846);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-batch-0844-0848-v1' ORDER BY started_at DESC LIMIT 1),b.id,847,'educational'::page_kind,'Educationblog24.Com
| এই অথামের সাথে জড়িত বিগত বছরের পরী...
forest বিশ্ববিদ্যাণ

১. yey’ উপজাতি বাস করে, (DU ৭ ০৬-০৭। ০১-০২/খব| আগাণণোরা ile arena গরিগাণণা। of
ক) ল্াাটিন আমেদীকারা. খ) WA fan  গ)ভাগতে. ঘ)মাগে
২, চীনের জিনজিগাং প্রদেশে বসবাসকারী প্রধান মুসলিম সম্প্রদায়ের নাম কি? (43, 37 BCS)
ক) তুর্কমেন খ) Wye
Sf) তাজিক ঘ) কাজাখ
৩, নিউজিল্যান্ড আদিবাসীদের কী বলা হয়? (বাঙিণকৃত 24 BCS)
ক) কুর্দি খ) তাতার''
গ) রেড ইত্ভিান ঘ) Gia
৪. Weyer উপজাতীয়দের বসবাস কোথায় (35 BCS/ ইবি, খ'' ১৩-১৪)
ক) টান et) রাশিয়া
গ) মঙ্গোলিয়া ঘ) তাইওয়ান
অন্যান্য বিশ্ববিদ্যালয় ও অন্যান্য চাকুরির পরী
৫. কোন জাতীয় কুকুরের সাহায্যে এক্ষিমোরা প্রেজ গাড়ি চালায়? (ডাক ও টেলিযোগাযোগ মন্তরণাল/-৯৫)
ক) গ্রালসেসিয়ান খ) ale গ) গ্রেহাউন্ড ঘ) বুলডগ
৬. কেনিয়া ও তাঙ্জানিয়ার সীমান্তে বসবাসকারী উপজাতির নাম কী? (রাবি অবণিজ্য এপ, ব্যবছাপনা। ০৮-০৯)
ক) জুলু খ) মুর গ) মার্সাই ঘ) কুলু
৭, FUSS বুরুভিতে যুদ্ধে লিপ্ত দুটি জাতি হচ্ছে" (আবহাওয়া অিদগ্ডরের সহকারী আবহাওয়াবিদ-৯৫)
ক)ছতুওটুটসি  খ)জুলুওছটু . গ)কাফিরওকুলু ঘ) পিগমি ও মুর
৮. মাউরি আদিবাসীরা বাস করে- (রাবি রাষ্রবিজঞান। ০৫-০৬)...
ক) নিউজিল্যান্ডে খ)ফিজিতে =. গ) পাপুয়া নিউগিনিতে  ঘ) মালয়েশিয়ায়
D>. ''আফ্রিদি'' কী? (রাবি-সমাজবিজ্ঞান, ০৭-০৮) রত
|. ক)দেশ ১:১১ “) উপজাতি... গ) Koa ঘ) হাতিয়া
. ক) উপজাতি খ) আদিবাসী গ) রেড ইন্ডিয়ান ঘ) নিগ্রো
৯১, রাশিয়ার পূর্ব ও দক্ষিণাঞ্চলের বসবাসকারী জাতির নাম- (ইবি-গ, ০৩-০৪, উ, ০৩-০৪)
ক) কাজানী Nee : . গ)কোজাকস ঘ) আইজোকলস
[1১৭ [st Tew [ee fet [ot [ae [৮ক ||
1৮৭ Tt pee [be fe
Lee fii 104 ee টার anes mere |
(3 camscanner
','World history','ethnicity-exam-reference-boundary-847','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; local OCR reconciled with visual evidence; only classified records imported.','{"physical_source_page":847,"source_image_sha256":"7a70689070227c3ce2425ff13331647ef813777fdfc7693a170b33f235b24a44","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0844-0848/visual_review_844_848.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0844-0848/classification_decisions.md"}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages z WHERE z.book_id=b.id AND z.source_page=847);
INSERT INTO public.source_pages (import_run_id,book_id,source_page,page_kind,raw_transcription,chapter_heading,topic_heading,confidence,extraction_method,model_name,notes,review_metadata) SELECT (SELECT id FROM public.import_runs WHERE pipeline_version='local-ocr-quality-gated-batch-0844-0848-v1' ORDER BY started_at DESC LIMIT 1),b.id,848,'educational'::page_kind,'| Educationblog24.Com

@ বিটেনের হাউস অব কমন্সে প্রথম বাঙালি নারী- রুশনারা আলী ।
| $ বিশ্বের প্রথম নারী প্রধানমন্ত্রী- শ্রীলঙ্কার শ্রীমাভো বন্দরনায়েকে, ১৯৬০ ।
+ বিশ্বের প্রথম নির্বাচিত নারী প্রধানমন্ত্রী- শ্রীমাভো বন্দরনায়েক |
+ বিশ্বের প্রথম মুসলিম নারী প্রধানমন্ত্রী- পাকিস্তানের বেনজির ভুট্টো |
+ বিশ্বের প্রথম নারী প্রেসিডেন্ট- আর্জেন্টিনার ইসাবেলা পেরন (১৯৭০ সালে নির্বাচিত) |
[$ বিশ্বের প্রথম মহাকাশগামী নারী- রাশিয়ার ভ্যালেন্টিনা তেরেসকোভা (১৯৬৩ সালে)। |
¢ শান্তিতে নোবেল পুরস্কার বিজয়ী প্রথম মুসলিম নারী- ইরানের শিরিন এবাদি; ২০০৩ সালে । |
© জাতিসংঘের প্রথম নারী ন্যায়পাল- জ্যামাইকার প্যাট্রিসিয়া ডুরাই (২০০১ সালে)
© যুক্তরাষ্ট্রের প্রথম নারী পররাষ্ট্রমন্ত্রী- মেডেলিন অল্বাইট |
> জাতিসংঘের সাধারণ পরিষদের প্রথম নরী সভপ্পতি- বিজয় rat পন্ডিত (ভারত); ১৯৫৩ সালে! |
@ ইসরাইলের প্রথম নারী প্রধানমন্ত্রী- গোল্ডা মায়ার (১৯৬৪ সালে)।
+ বিটেনের প্রথম নারী প্রধানমন্ত্রী- মার্গারেট থ্যাচার।
+ সর্বপ্রথম ভোটাধিকার অর্জন করে- নিউজিল্যান্ডের নারীরা (১৮৯৩ A) | :
+ প্রথম সংসদ নির্বাচনে অংশগ্রহণ করে- সুইডেনের নারীরা |
+ বিশ্বের প্রথম নারী প্রোগামার- লেডি অগাস্টা (ইংরেজ কবি লর্ড বায়রনের কন্যা)। |
+ এভারেস্ট বিজয়ী প্রথম নারী- জাপানের জুনকো তাবেই (১৯৭৫ সালে)!
* পাকিস্তান তথা মুসলিম বিশ্বের প্রথম নারী স্পিকার- ডা: ফাহমিদা মির্জা ।
¢ আর্জেন্টিনার প্রথম নির্বাচিত নারী প্রেসিডেন্ট- ক্রিস্টিনা ফার্নান্দেজ ডি ক্রিশনার।
$ শান্তিতে নোবেল পুরষ্কার বিজয়ী প্রথম নারী- বার্থাভন সুটনার (অস্ট্রিয়া); ১৯০৫ সালে । |
+ ইংলিশ চ্যানেল অতিক্রমকারী প্রথম বাঙালি নারী- আরতি সেন গুপ্ত ভারত)। |
| > বিশ্বের প্রথম নারী বিমান পাইলট ছিলেন- ত্যালান শেপার্ড।
$ লাইবেরিয়ার তথা আফ্রিকার প্রথম নির্বাচিত নারী প্রেসিডেন্ট- এলেন জনসন সারলিফ।
| $ দক্ষিণ এশিয়ার প্রথম নারী প্রেসিডেন্ট- শ্রীলঙ্কার চন্দ্রিকা কৃমারাতুঙ্গা (১৯৯৪ সালে) |

& + ভারতের প্রথম নারী প্পিকার- মিরা কুমার |

| + চিলির প্রথম নারী প্রেসিডেন্ট- মিশেল বাশলেট (২০০৬ সালে)।

| $+ ইউরোপের যে দেশে সর্ব প্রথম নারীরা ভোটাধিকার লাভ করে- ফিনল্যান্ডে (১৯০৬)।

পা ee: caer aK +e =

(3 camscanner
','World history','women-firsts-reference-boundary-848','medium'::confidence_level,'local_ocr_with_image_grounded_review','tesseract-ben+eng','All ordered source tiles reviewed; local OCR reconciled with visual evidence; only classified records imported.','{"physical_source_page":848,"source_image_sha256":"19226583b727019f09b08607b25189ce73beb42c8bbcae86182764fbbb341664","review_status":"completed_image_grounded_review","review_report":"/home/ubuntu/dontonyo/supabase/batch-0844-0848/visual_review_844_848.md","classification_report":"/home/ubuntu/dontonyo/supabase/batch-0844-0848/classification_decisions.md"}'::jsonb FROM public.books b WHERE b.title='Jubayer''s GK' AND NOT EXISTS (SELECT 1 FROM public.source_pages z WHERE z.book_id=b.id AND z.source_page=848);
COMMIT;