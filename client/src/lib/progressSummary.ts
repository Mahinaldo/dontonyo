export type ContentProgressRecord = {
  status: string;
  correctCount: number;
  incorrectCount: number;
};

export type PracticeAttemptRecord = {
  totalQuestions: number;
  correctAnswers: number;
};

export type DailyProgressRecord = { isComplete: boolean };

export function getProgressSummary({
  content,
  attempts,
  daily,
}: {
  content: ContentProgressRecord[];
  attempts: PracticeAttemptRecord[];
  daily: DailyProgressRecord[];
}) {
  const completed = content.filter(item => item.status === "completed").length;
  const contentAnswered = content.reduce(
    (total, item) => total + item.correctCount + item.incorrectCount,
    0
  );
  const contentCorrect = content.reduce(
    (total, item) => total + item.correctCount,
    0
  );
  const practiceAnswered = attempts.reduce(
    (total, attempt) => total + attempt.totalQuestions,
    0
  );
  const practiceCorrect = attempts.reduce(
    (total, attempt) => total + attempt.correctAnswers,
    0
  );
  const answered = contentAnswered + practiceAnswered;
  const correct = contentCorrect + practiceCorrect;

  return {
    completed,
    answered,
    correct,
    accuracy: answered ? Math.round((correct / answered) * 100) : 0,
    days: daily.filter(item => item.isComplete).length,
  };
}
