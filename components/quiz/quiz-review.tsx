import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import type { Quiz } from "@/schema";

interface QuizReviewProps {
  quiz: Quiz;
  answers: Record<string, string | string[]>;
  results: {
    totalScore: number;
    maxScore: number;
    percentage: number;
    passed: boolean;
    passingScore: number;
    results: Array<{
      questionId: string;
      correct: boolean;
      points: number;
      maxPoints: number;
    }>;
  };
  onBack: () => void;
}

export function QuizReview({
  quiz,
  answers,
  results,
  onBack,
}: QuizReviewProps) {
  const getQuestionResult = (questionId: string) => {
    return results.results.find((r) => r.questionId === questionId);
  };

  const formatUserAnswer = (question: any, userAnswer: string | string[]) => {
    if (!userAnswer) return "No answer provided";

    if (
      question.questionType === "multiple-choice" ||
      question.questionType === "true-false"
    ) {
      const option = question.options?.find(
        (opt: any) => opt.optionId === userAnswer,
      );
      return option ? `${userAnswer}. ${option.text}` : userAnswer;
    }

    if (question.questionType === "multiple-choice-multiple-answer") {
      if (Array.isArray(userAnswer)) {
        return userAnswer
          .map((answerId) => {
            const option = question.options?.find(
              (opt: any) => opt.optionId === answerId,
            );
            return option ? `${answerId}. ${option.text}` : answerId;
          })
          .join(", ");
      }
    }

    return userAnswer.toString();
  };

  const formatCorrectAnswer = (question: any) => {
    const correctAnswer = question.correctAnswer;

    if (
      question.questionType === "multiple-choice" ||
      question.questionType === "true-false"
    ) {
      const option = question.options?.find(
        (opt: any) => opt.optionId === correctAnswer,
      );
      return option ? `${correctAnswer}. ${option.text}` : correctAnswer;
    }

    if (question.questionType === "multiple-choice-multiple-answer") {
      if (Array.isArray(correctAnswer)) {
        return correctAnswer
          .map((answerId) => {
            const option = question.options?.find(
              (opt: any) => opt.optionId === answerId,
            );
            return option ? `${answerId}. ${option.text}` : answerId;
          })
          .join(", ");
      }
    }

    if (question.questionType === "short-answer") {
      if (question.acceptableAnswers && question.acceptableAnswers.length > 0) {
        return question.acceptableAnswers.join(" or ");
      }
    }

    return correctAnswer.toString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Results
        </Button>
        <Badge variant="outline" className="text-sm">
          Review Mode
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Quiz Review</CardTitle>
          <div className="text-muted-foreground text-center">
            Review your answers and see explanations for all questions
          </div>
        </CardHeader>
      </Card>

      {quiz.questions.map((question, index) => {
        const userAnswer = answers[question.id];
        const questionResult = getQuestionResult(question.id);
        const isCorrect = questionResult?.correct ?? false;

        return (
          <Card key={question.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm font-medium">
                    Question {index + 1}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {question.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="text-sm font-medium">
                    {questionResult?.points || 0} / {question.points} pts
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <h3 className="text-lg leading-relaxed font-semibold">
                {question.questionText}
              </h3>

              {question.imageURL && (
                <div className="bg-muted flex h-32 w-full items-center justify-center overflow-hidden rounded-lg">
                  <img
                    src={question.imageURL}
                    alt="Question image"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-medium">Your Answer:</span>
                    {isCorrect ? (
                      <Badge variant="default" className="text-xs">
                        Correct
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        Incorrect
                      </Badge>
                    )}
                  </div>
                  <p
                    className={`text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}
                  >
                    {formatUserAnswer(question, userAnswer!)}
                  </p>
                </div>

                {!isCorrect && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-green-800">
                        Correct Answer:
                      </span>
                    </div>
                    <p className="text-sm text-green-700">
                      {formatCorrectAnswer(question)}
                    </p>
                  </div>
                )}

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-blue-800">
                      Explanation:
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-blue-700">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2 text-center">
            <h3 className="text-lg font-semibold">Quiz Summary</h3>
            <div className="text-muted-foreground flex justify-center gap-6 text-sm">
              <span>
                Score: {results.totalScore} / {results.maxScore} points
              </span>
              <span>Accuracy: {results.percentage}%</span>
              <span>Status: {results.passed ? "Passed" : "Failed"}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
