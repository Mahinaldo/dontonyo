import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

type Answer = { selectedOption: string | null; isCorrect: boolean };

export default function Practice() {
  const { isAuthenticated } = useAuth();
  const { data: questions, isLoading, refetch } = trpc.practice.questions.useQuery({ limit: 10 });
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const submit = trpc.practice.submit.useMutation();
  const answered = useMemo(() => Object.keys(answers).length, [answers]);
  const score = Object.values(answers).filter(item => item.isCorrect).length;
  const answer = (mcqId: number, optionKey: string, isCorrect: boolean) => setAnswers(current => current[mcqId] ? current : { ...current, [mcqId]: { selectedOption: optionKey, isCorrect } });
  const finish = () => { if (!questions?.length || !isAuthenticated) return; submit.mutate({ questions: questions.map(question => ({ mcqId: question.id, selectedOption: answers[question.id]?.selectedOption ?? null, isCorrect: answers[question.id]?.isCorrect ?? false })) }); };
  return <div className="space-y-8"><header className="max-w-2xl"><p className="eyebrow">Practice</p><h1 className="page-title">Make the material stick.</h1><p className="mt-3 text-muted-foreground">A small, focused set of questions. Answer once, see why, and carry the weak spots into review.</p></header>{!isAuthenticated && <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5"><p className="font-medium">Practice is open. Sign in to save your score.</p><Button onClick={() => startLogin()} className="mt-3" size="sm">Sign in with Manus</Button></div>}{isLoading ? <div className="quiet-panel">Loading questions…</div> : questions?.length ? <div className="space-y-4">{questions.map((question, index) => { const result = answers[question.id]; return <article key={question.id} className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><Badge variant="secondary">Question {index + 1}</Badge>{result && (result.isCorrect ? <CheckCircle2 className="size-5 text-emerald-600" /> : <XCircle className="size-5 text-rose-600" />)}</div><h2 className="mt-5 text-lg font-medium leading-8">{question.question}</h2><div className="mt-5 grid gap-2 sm:grid-cols-2">{question.options.map(option => { const selected = result?.selectedOption === option.optionKey; const correct = option.isCorrect; return <button key={option.id} type="button" disabled={Boolean(result)} onClick={() => answer(question.id, option.optionKey, correct)} className={`rounded-xl border p-4 text-left text-sm leading-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${selected ? correct ? "border-emerald-500 bg-emerald-50" : "border-rose-500 bg-rose-50" : "border-border hover:border-primary/40 hover:bg-accent/40"}`}><span className="mr-2 font-semibold">{option.optionKey}.</span>{option.optionText}</button>; })}</div>{result && <p className={`mt-4 text-sm font-medium ${result.isCorrect ? "text-emerald-700" : "text-rose-700"}`}>{result.isCorrect ? "Correct. Keep going." : "Not this time. Add it to your review list."}</p>}</article>; })}<div className="flex flex-wrap items-center gap-3"><Button onClick={finish} disabled={!isAuthenticated || !answered || submit.isPending}>{submit.isSuccess ? "Score saved" : "Finish and save score"}</Button><Button variant="outline" className="gap-2" onClick={() => { setAnswers({}); refetch(); }}><RotateCcw className="size-4" /> New questions</Button><span className="text-sm text-muted-foreground">{score}/{questions.length} correct so far</span></div></div> : <div className="quiet-panel">No practice questions are available yet. The imported source will populate this page without placeholder questions.</div>}</div>;
}
