import crypto from "node:crypto";

export type McqCandidate = {
  question: string;
  options: Record<string, string>;
  correctOption?: string | null;
  sourcePage?: number | null;
};

export function normalizeBangla(value: string) {
  return value
    .normalize("NFC")
    .replace(/[\u200c\u200d]/g, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

export function mcqIdempotencyKey(candidate: McqCandidate) {
  const options = Object.entries(candidate.options).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  return crypto
    .createHash("sha256")
    .update(
      JSON.stringify({ question: normalizeBangla(candidate.question), options })
    )
    .digest("hex");
}

export function validateMcq(candidate: McqCandidate) {
  const optionValues = Object.values(candidate.options)
    .map(normalizeBangla)
    .filter(Boolean);
  const hasAllCoreFields =
    normalizeBangla(candidate.question).length > 0 && optionValues.length >= 2;
  const hasValidAnswer = Boolean(
    candidate.correctOption &&
      Object.hasOwn(candidate.options, candidate.correctOption)
  );
  return {
    accepted: hasAllCoreFields,
    quizReady: hasAllCoreFields && hasValidAnswer,
    confidence:
      hasAllCoreFields && hasValidAnswer
        ? ("high" as const)
        : hasAllCoreFields
          ? ("low" as const)
          : ("low" as const),
  };
}
