import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  CheckCircle,
  XCircle,
  Award,
  RotateCcw,
  Home,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { useState } from "react";
import type { Quiz } from "@/schema";

interface QuizResultsProps {
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
  quiz?: Quiz;
  answers?: Record<string, string | string[]>;
  onRestart: () => void;
}

export function QuizResults({
  results,
  quiz,
  answers,
  onRestart,
}: QuizResultsProps) {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set(),
  );

  const correctAnswers = results.results.filter((r) => r.correct).length;
  const totalQuestions = results.results.length;

  const handleBackToHome = () => {
    window.location.href = "/";
  };

  const handleRetakeQuiz = () => {
    window.location.href = "/quiz";
  };

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const toggleAllQuestions = () => {
    if (expandedQuestions.size === totalQuestions) {
      setExpandedQuestions(new Set());
    } else {
      setExpandedQuestions(new Set(quiz?.questions.map((q) => q.id) || []));
    }
  };

  const getQuestionResult = (questionId: string) => {
    return results.results.find((r) => r.questionId === questionId);
  };

  const formatAnswer = (
    question: any,
    answer: string | string[],
    isCorrect = false,
  ) => {
    if (!answer) return "No answer provided";

    if (
      question.questionType === "multiple-choice" ||
      question.questionType === "true-false"
    ) {
      const option = question.options?.find(
        (opt: any) => opt.optionId === answer,
      );
      return option ? option.text : answer;
    }

    if (question.questionType === "multiple-choice-multiple-answer") {
      if (Array.isArray(answer)) {
        return answer.map((answerId) => {
          const option = question.options?.find(
            (opt: any) => opt.optionId === answerId,
          );
          return option ? option.text : answerId;
        });
      }
    }

    if (question.questionType === "short-answer" && isCorrect) {
      if (question.acceptableAnswers && question.acceptableAnswers.length > 1) {
        return question.acceptableAnswers;
      }
    }

    return Array.isArray(answer) ? answer : [answer];
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          {results.passed ? (
            <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-full">
              <Award className="text-primary-foreground h-8 w-8" />
            </div>
          ) : (
            <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
              <RotateCcw className="text-muted-foreground h-8 w-8" />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl">
          {results.passed ? "Congratulations!" : "Quiz Complete"}
        </CardTitle>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            {results.passed
              ? "You've successfully passed the quiz!"
              : `You need ${results.passingScore}% to pass. Try again!`}
          </p>
          <Badge
            variant={results.passed ? "default" : "secondary"}
            className="px-4 py-1 text-lg"
          >
            {results.percentage}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{results.totalScore}</div>
            <div className="text-muted-foreground text-sm">Total Points</div>
            <div className="text-muted-foreground text-xs">
              out of {results.maxScore}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{correctAnswers}</div>
            <div className="text-muted-foreground text-sm">Correct Answers</div>
            <div className="text-muted-foreground text-xs">
              out of {totalQuestions}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold">{results.percentage}%</div>
            <div className="text-muted-foreground text-sm">Accuracy</div>
            <div className="text-muted-foreground text-xs">
              {results.passed ? "Passed!" : `Need ${results.passingScore}%`}
            </div>
          </div>
        </div>

        <Progress value={results.percentage} className="h-3 w-full" />

        {/* Question Review Section */}
        {quiz && answers && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Question Review</h3>
              <Button
                onClick={toggleAllQuestions}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {expandedQuestions.size === totalQuestions
                  ? "Collapse All"
                  : "Expand All"}
              </Button>
            </div>

            <div className="space-y-3">
              {quiz.questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const questionResult = getQuestionResult(question.id);
                const isCorrect = questionResult?.correct ?? false;
                const isExpanded = expandedQuestions.has(question.id);

                return (
                  <Collapsible key={question.id} open={isExpanded}>
                    <Card
                      className="border-l-4"
                      style={{
                        borderLeftColor: isCorrect ? "#22c55e" : "#ef4444",
                      }}
                    >
                      <CollapsibleTrigger
                        onClick={() => toggleQuestion(question.id)}
                        className="w-full"
                      >
                        <CardHeader className="hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                              <div className="text-left">
                                <div className="font-medium">
                                  Question {index + 1}
                                </div>
                                <div className="text-muted-foreground max-w-96 truncate text-sm">
                                  {question.questionText}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {questionResult?.points || 0} /{" "}
                                {question.points} pts
                              </Badge>
                              {isExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <CardContent className="space-y-4 pt-0">
                          <div className="bg-muted/30 rounded-lg p-3">
                            <h4 className="mb-2 font-medium">
                              {question.questionText}
                            </h4>
                            {question.imageURL && (
                              <img
                                src={question.imageURL}
                                alt="Question image"
                                className="max-h-32 rounded object-contain"
                              />
                            )}
                          </div>

                          {/* Show options for MCQ types */}
                          {(question.questionType === "multiple-choice" ||
                            question.questionType === "true-false" ||
                            question.questionType ===
                              "multiple-choice-multiple-answer") && (
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium">Options:</h5>
                              {question.options?.map((option: any) => {
                                const isUserAnswer = Array.isArray(userAnswer)
                                  ? userAnswer.includes(option.optionId)
                                  : userAnswer === option.optionId;
                                const isCorrectAnswer = Array.isArray(
                                  question.correctAnswer,
                                )
                                  ? question.correctAnswer.includes(
                                      option.optionId,
                                    )
                                  : question.correctAnswer === option.optionId;

                                let bgColor = "";
                                let textColor = "";
                                let icon = null;

                                if (isCorrectAnswer) {
                                  bgColor = "bg-green-100 border-green-300";
                                  textColor = "text-green-800";
                                  icon = (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  );
                                } else if (isUserAnswer) {
                                  bgColor = "bg-red-100 border-red-300";
                                  textColor = "text-red-800";
                                  icon = (
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  );
                                }

                                return (
                                  <div
                                    key={option.optionId}
                                    className={`flex items-center gap-2 rounded border p-2 ${bgColor} ${textColor}`}
                                  >
                                    {icon}
                                    <span className="text-sm">
                                      {option.optionId}. {option.text}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Show answers for short answer */}
                          {question.questionType === "short-answer" && (
                            <div className="space-y-2">
                              <div
                                className={`rounded border p-2 ${
                                  isCorrect
                                    ? "border-green-300 bg-green-100 text-green-800"
                                    : "border-red-300 bg-red-100 text-red-800"
                                }`}
                              >
                                <div className="mb-1 text-xs font-medium">
                                  Your Answer:
                                </div>
                                <div className="text-sm">
                                  {userAnswer || "No answer provided"}
                                </div>
                              </div>
                              {!isCorrect && (
                                <div className="rounded border border-green-300 bg-green-100 p-2 text-green-800">
                                  <div className="mb-1 text-xs font-medium">
                                    Correct Answer(s):
                                  </div>
                                  <div className="text-sm">
                                    {question.acceptableAnswers?.join(", ") ||
                                      question.correctAnswer}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Explanation */}
                          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                            <div className="mb-2 flex items-center gap-2">
                              <Info className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">
                                Explanation
                              </span>
                            </div>
                            <p className="text-sm leading-relaxed text-blue-700">
                              {question.explanation}
                            </p>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleBackToHome}
            variant="outline"
            className="flex-1"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <Button onClick={handleRetakeQuiz} className="flex-1">
            <RotateCcw className="mr-2 h-4 w-4" />
            Take Quiz Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
