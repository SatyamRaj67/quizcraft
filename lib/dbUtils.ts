import type { Question } from "@/types";

export function transformQuestion(q: any): Question {
  const baseQuestion = {
    id: q.id,
    subject: q.subject,
    text: q.text,
    pointsCorrect: q.pointsCorrect,
    pointsIncorrect: q.pointsIncorrect,
  };

  if (q.type === "mcq") {
    return {
      ...baseQuestion,
      type: "mcq" as const,
      options: q.options as Array<{ id: string; text: string }>,
      correctOptionId: q.correctOptionId!,
    };
  }

  return {
    ...baseQuestion,
    type: "numerical" as const,
    correctAnswer: q.correctAnswer!,
    tolerance: q.tolerance || undefined,
  };
}
