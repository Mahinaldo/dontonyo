import { ArrowLeft, Brain, FileText, Lightbulb } from "lucide-react";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Empty } from "./Learn";

export default function Topic() {
  const [, params] = useRoute("/learn/topic/:id");
  const topicId = params?.id ?? "";
  const query = trpc.gk.topic.useQuery({ topicId }, { enabled: Boolean(topicId) });
  if (query.isLoading) return <div className="brutal-card p-8 font-bold">Loading topic source material…</div>;
  if (!query.data) return <Empty text="This topic is unavailable in the current source library."/>;
  const { topic, notes, facts, mcqs } = query.data;
  return <div className="space-y-8"><Link href="/learn" className="inline-flex items-center gap-2 border-b-2 border-black pb-1 text-sm font-bold"><ArrowLeft className="size-4"/> Library</Link><header className="brutal-card bg-lilac p-6 sm:p-9"><p className="eyebrow">Topic study / Source-linked</p><h1 className="bangla mt-4 text-4xl font-bold tracking-[-.06em] sm:text-6xl">{topic.title}</h1><p className="mt-4 max-w-2xl font-medium leading-7">{topic.description ?? "Read source-preserved notes, build recall with key facts, then move into related practice."}</p></header><section className="grid gap-6 lg:grid-cols-2"><ContentList icon={FileText} label="Notes" items={notes} field="content"/><ContentList icon={Lightbulb} label="Key facts" items={facts} field="factText"/></section><section><div className="mb-4 flex items-center gap-2"><Brain className="size-5"/><h2 className="section-title">RELATED QUESTIONS</h2></div>{mcqs.length ? <div className="grid gap-3">{mcqs.map((mcq,index)=><article key={mcq.id} className="brutal-card-sm p-5"><span className="mono bg-lemon px-2 py-1 text-[10px]">Q {String(index+1).padStart(2,"0")}</span><p className="bangla mt-4 text-lg font-bold leading-8">{mcq.question}</p><p className="mono mt-4 text-[10px] text-muted-foreground">SOURCE PAGE {mcq.sourcePage ?? "—"}</p></article>)}</div> : <Empty text="Related questions will appear here once the source has a complete verified MCQ set for this topic."/>}</section></div>;
}
function ContentList({ icon: Icon, label, items, field }: { icon: typeof FileText; label: string; items: Array<Record<string, unknown>>; field: "content" | "factText" }) { return <div><div className="mb-4 flex items-center gap-2"><Icon className="size-5"/><h2 className="section-title">{label.toUpperCase()}</h2></div>{items.length ? <div className="space-y-3">{items.map(item=><article key={String(item.id)} className="brutal-card-sm p-5"><h3 className="bangla font-bold">{String(item.title ?? "Source record")}</h3><p className="bangla mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">{String(item[field])}</p>{item.sourcePage ? <p className="mono mt-4 text-[10px]">SOURCE PAGE {String(item.sourcePage)}</p> : null}</article>)}</div> : <Empty text={`No ${label.toLowerCase()} have been imported for this topic yet.`}/>}</div>; }
