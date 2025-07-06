"use client";

import { useState, useEffect, useCallback } from "react";
import type { Quiz } from "@/types";
import { QuizNavigationSidebar } from "./sidebar/quiz-navigation-sidebar";
import { QuizHeader } from "./quiz-header";
import QuestionCard from "../question/question-card";
import { QuizControls } from "./quiz-controls";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

type QuizPlayerProps = {
  quiz: Quiz;
};

export type QuestionStatus =
  | "current"
  | "answered"
  | "visited"
  | "flagged"
  | "default";

export const QuizPlayer = ({ quiz }: QuizPlayerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<
    Record<string, string | number>
  >({});
  const [questionStatuses, setQuestionStatuses] = useState<QuestionStatus[]>(
    Array(quiz.questions.length).fill("default"),
  );
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const updateStatus = useCallback(
    (index: number, newStatus: QuestionStatus) => {
      setQuestionStatuses((prev) => {
        const newStatuses = [...prev];
        if (newStatuses[index] !== "answered" || newStatus === "answered") {
          newStatuses[index] = newStatus;
        }
        return newStatuses;
      });
    },
    [],
  );

  useEffect(() => {
    updateStatus(currentQuestionIndex, "current");
  }, [currentQuestionIndex, updateStatus]);

  const handleAnswer = (questionId: string, answer: string | number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
    updateStatus(currentQuestionIndex, "answered");
  };

  const updatePreviousQuestionStatus = useCallback(() => {
    const prevStatus = questionStatuses[currentQuestionIndex];
    if (prevStatus === "current") {
      updateStatus(
        currentQuestionIndex,
        userAnswers[quiz.questions[currentQuestionIndex]!.id]
          ? "answered"
          : "visited",
      );
    }
  }, [
    currentQuestionIndex,
    questionStatuses,
    quiz.questions,
    userAnswers,
    updateStatus,
  ]);

  const goToQuestion = (index: number) => {
    if (index < 0 || index >= quiz.questions.length) return;
    updatePreviousQuestionStatus();
    setCurrentQuestionIndex(index);
  };

  const handleFlag = () => {
    const currentStatus = questionStatuses[currentQuestionIndex];
    updateStatus(
      currentQuestionIndex,
      currentStatus === "flagged" ? "current" : "flagged",
    );
  };

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div className="flex h-screen gap-4 p-4">
      {/* Main Quiz Card */}
      <Card className="flex flex-1 flex-col">
        <CardHeader className="p-4">
          <QuizHeader time={time} />
        </CardHeader>
        <CardContent className="flex flex-1 flex-col p-4">
          <p className="mb-4 text-lg font-semibold">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
          <div className="flex-1">
            <QuestionCard
              question={currentQuestion!}
              onAnswer={handleAnswer}
              userAnswers={userAnswers}
            />
          </div>
        </CardContent>
        <CardFooter className="p-4">
          <QuizControls
            onPrevious={() => goToQuestion(currentQuestionIndex - 1)}
            onNext={() => goToQuestion(currentQuestionIndex + 1)}
            onFlag={handleFlag}
            isFirst={currentQuestionIndex === 0}
            isLast={currentQuestionIndex === quiz.questions.length - 1}
            isFlagged={questionStatuses[currentQuestionIndex] === "flagged"}
          />
        </CardFooter>
      </Card>

      {/* Navigation Sidebar Card */}
      <QuizNavigationSidebar
        questions={quiz.questions}
        statuses={questionStatuses}
        onSelectQuestion={goToQuestion}
      />
    </div>
  );
};
