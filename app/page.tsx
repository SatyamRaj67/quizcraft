"use client";

import { QuestionCard } from "@/components/quiz/question-card";
import { QuizCard } from "@/components/quiz/quiz-card";
import { api } from "@/trpc/react";
import { useState } from "react";

export default function Home() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const { data: quiz, isLoading } = api.quiz.getQuiz.useQuery({
    id: "default",
  });

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswer = (answer: string | string[]) => {
    if (!quiz) return;

    const questionId = quiz.questions[currentQuestion]?.id;
    if (questionId) {
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    }
  };

  const handleNextQuestion = () => {
    if (!quiz) return;

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Quiz completed
      console.log("Quiz completed!", answers);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Quiz not found</div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen px-4 py-8">
      <div className="container mx-auto">
        {!quizStarted ? (
          <QuizCard quiz={quiz} onStart={handleStartQuiz} />
        ) : (
          <QuestionCard
            question={quiz.questions[currentQuestion]!}
            questionNumber={currentQuestion + 1}
            totalQuestions={quiz.questions.length}
            onAnswer={handleAnswer}
            onNext={handleNextQuestion}
          />
        )}
      </div>
    </div>
  );
}
