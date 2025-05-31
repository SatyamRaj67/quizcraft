"use client";

import { QuizCard } from "@/components/quiz/quiz-card";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const {
    data: quiz,
    isLoading,
    error,
  } = api.quiz.getQuiz.useQuery({
    id: "default",
  });

  const handleStartQuiz = () => {
    router.push("/quiz");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading quiz...</div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-destructive text-lg">
          {error?.message || "Quiz not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen px-4 py-8">
      <div className="container mx-auto">
        <QuizCard quiz={quiz} onStart={handleStartQuiz} />
      </div>
    </div>
  );
}
