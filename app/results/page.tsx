"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QuizResults } from "@/components/quiz/quiz-results";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [loading, setLoading] = useState(true);

  const { data: quiz } = api.quiz.getQuiz.useQuery({ id: "default" });

  useEffect(() => {
    // Get results from session storage
    const storedResults = sessionStorage.getItem("quizResults");
    const storedAnswers = sessionStorage.getItem("quizAnswers");

    if (storedResults && storedAnswers) {
      setResults(JSON.parse(storedResults));
      setAnswers(JSON.parse(storedAnswers));
    } else {
      // No results found, redirect to home
      router.push("/");
      return;
    }

    setLoading(false);
  }, [router]);

  const handleRestart = () => {
    // Clear session storage
    sessionStorage.removeItem("quizResults");
    sessionStorage.removeItem("quizAnswers");

    // Redirect to home
    router.push("/");
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleRetakeQuiz = () => {
    // Clear session storage
    sessionStorage.removeItem("quizResults");
    sessionStorage.removeItem("quizAnswers");

    // Go directly to quiz
    router.push("/quiz");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading results...</div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="bg-background min-h-screen px-4 py-8">
        <div className="container mx-auto">
          <Card className="mx-auto w-full max-w-md">
            <CardHeader>
              <CardTitle>No Results Found</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                No quiz results were found. Please take the quiz first.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleBackToHome}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Home
                </Button>
                <Button onClick={handleRetakeQuiz} className="flex-1">
                  Take Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen px-4 py-8">
      <div className="container mx-auto">
        <QuizResults
          results={results}
          onRestart={handleRestart}
          quiz={quiz}
          answers={answers}
        />
      </div>
    </div>
  );
}
