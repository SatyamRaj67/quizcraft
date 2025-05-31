// filepath: c:\Users\HP\Documents\VSC\Next\quizcraft\app\quiz\page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QuestionCard } from "@/components/quiz/question-card";
import { QuizSidebar } from "@/components/quiz/quiz-sidebar";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pause, Play } from "lucide-react";
import { useQuizTimer } from "@/hooks/use-quiz-timer";

export default function QuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  const { data: quiz, isLoading } = api.quiz.getQuiz.useQuery({
    id: "default",
  });

  const submitResultsMutation = api.quiz.getQuizResults.useMutation();

  // Timer functionality
  const timer = useQuizTimer(quiz?.timeLimitMinutes || 30, () => {
    // Auto-submit when time is up
    handleQuizComplete();
  });

  // Start timer when quiz loads
  useEffect(() => {
    if (quiz && !timer.isActive) {
      timer.start();
    }
  }, [quiz]);

  // Initialize from URL params if present (for page refresh)
  useEffect(() => {
    const questionParam = searchParams.get("question");
    if (questionParam) {
      const questionIndex = parseInt(questionParam) - 1;
      if (questionIndex >= 0) {
        setCurrentQuestion(questionIndex);
      }
    }
  }, [searchParams]);

  // Update URL when question changes
  useEffect(() => {
    const newUrl = `/quiz?question=${currentQuestion + 1}`;
    window.history.replaceState(null, "", newUrl);
  }, [currentQuestion]);

  const handleAnswer = (answer: string | string[]) => {
    if (!quiz) return;

    const questionId = quiz.questions[currentQuestion]?.id;
    if (questionId) {
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    }
  };

  const handleQuizComplete = async () => {
    if (!quiz) return;

    timer.pause();

    try {
      const results = await submitResultsMutation.mutateAsync({ answers });

      // Store results in session storage for the results page
      sessionStorage.setItem("quizResults", JSON.stringify(results));
      sessionStorage.setItem("quizAnswers", JSON.stringify(answers));

      router.push("/results");
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };

  const handleNextQuestion = async () => {
    if (!quiz) return;

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      await handleQuizComplete();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleBackToHome = () => {
    timer.pause();
    router.push("/");
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
      <div className="bg-background min-h-screen px-4 py-8">
        <div className="container mx-auto">
          <Card className="mx-auto w-full max-w-md">
            <CardHeader>
              <CardTitle>Quiz Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleBackToHome} className="w-full">
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 px-4 py-8">
          <div className="container mx-auto">
            {/* Header Controls */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToHome}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>

                {currentQuestion > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousQuestion}
                  >
                    Previous Question
                  </Button>
                )}
              </div>

              {/* Timer Control */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={timer.isActive ? timer.pause : timer.start}
                  className="flex items-center gap-2"
                >
                  {timer.isActive ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Resume
                    </>
                  )}
                </Button>
                <div
                  className={`font-mono text-lg ${timer.timeRemaining < 300 ? "text-red-600" : ""}`}
                >
                  {timer.formattedTime}
                </div>
              </div>
            </div>

            <QuestionCard
              question={quiz.questions[currentQuestion]!}
              questionNumber={currentQuestion + 1}
              totalQuestions={quiz.questions.length}
              onAnswer={handleAnswer}
              onNext={handleNextQuestion}
            />

            {submitResultsMutation.isPending && (
              <div className="bg-background/80 fixed inset-0 flex items-center justify-center">
                <div className="text-lg">Submitting quiz...</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <QuizSidebar
          quiz={quiz}
          currentQuestionIndex={currentQuestion}
          answers={answers}
          timeRemaining={timer.formattedTime}
        />
      </div>
    </div>
  );
}
