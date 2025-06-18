import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import type { Quiz, QuizSection } from "@/.example/quiz-schema";
import SeedQuizzesButton from "./seed-quizzes-button";

export default function QuizListPage({
  onStart,
}: {
  onStart: (quiz: Quiz) => void;
}) {
  // The Convex "quizzes" table stores { id, quiz }, so the result is { id: string, quiz: Quiz }
  const quizzes = useQuery(api.quizzes.getQuizzes, {});

  return (
    <div className="mx-auto max-w-2xl py-8">
      <SeedQuizzesButton />
      <h1 className="mb-4 text-3xl font-bold">Available Quizzes</h1>
      <div className="grid gap-4">
        {quizzes?.map((q: { id: string; quiz: Quiz }) => (
          <div
            key={q.quiz.id}
            className="bg-card cursor-pointer rounded-xl border p-6 shadow transition hover:shadow-lg"
            onClick={() => onStart(q.quiz)}
          >
            <h2 className="mb-1 text-xl font-semibold">{q.quiz.title}</h2>
            <p className="text-muted-foreground mb-2">{q.quiz.description}</p>
            <span className="text-primary-foreground bg-primary rounded px-2 py-1 text-xs">
              {q.quiz.sections?.reduce(
                (acc: number, s: QuizSection) =>
                  acc + (s.questions?.length ?? 0),
                0,
              ) ?? 0}{" "}
              Questions
            </span>
          </div>
        ))}
        {quizzes === undefined && <div>Loading quizzes...</div>}
        {quizzes?.length === 0 && <div>No quizzes found.</div>}
      </div>
    </div>
  );
}
