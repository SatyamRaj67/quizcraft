"use client";
import { useState } from "react";
import QuizListPage from "@/components/quiz/quiz-list-page";
import QuizStartDialog from "@/components/quiz/quiz-start-dialog";
import QuizPage from "@/components/quiz/quiz-page";
import type { Quiz, QuizSettings } from "@/.example/quiz-schema";

export default function QuizRoot() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showStart, setShowStart] = useState(false);
  const [quizSettings, setQuizSettings] = useState<QuizSettings | null>(null);
  const [inQuiz, setInQuiz] = useState(false);

  function handleStart(quiz: Quiz) {
    setSelectedQuiz(quiz);
    setShowStart(true);
  }

  function handleBegin(settings: QuizSettings) {
    setQuizSettings(settings);
    setShowStart(false);
    setInQuiz(true);
  }

  function handleExit() {
    setSelectedQuiz(null);
    setQuizSettings(null);
    setInQuiz(false);
  }

  return (
    <div className="min-h-[60vh]">
      {!selectedQuiz && <QuizListPage onStart={handleStart} />}
      {selectedQuiz && showStart && (
        <QuizStartDialog
          quiz={selectedQuiz}
          onStart={handleBegin}
          onClose={handleExit}
        />
      )}
      {selectedQuiz && inQuiz && quizSettings && (
        <QuizPage
          quiz={selectedQuiz}
          settings={quizSettings}
          onExit={handleExit}
        />
      )}
    </div>
  );
}
