"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Award,
  RotateCcw,
  Home,
  TrendingUp,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

interface QuizResults {
  score: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  passingScore: number;
  answeredQuestions: number;
  totalQuestions: number;
  timeSpent: number;
  answers: Record<string, string>; // MCQ-only: string answers only
  quiz: {
    _id: string;
    quizTitle: string;
    quizDescription: string;
    difficulty: string;
    category: string;
    timeLimitMinutes: number;
    questions?: Array<{
      questionId: string;
      questionText: string;
      questionType: string;
      category: string;
      points: number;
      options?: Array<{ optionId: string; text: string }>;
      correctAnswer: string; // MCQ-only: single correct answer
      explanation: string;
      imageURL?: string;
    }>;
  };
}

export default function QuizResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<QuizResults | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedResults = sessionStorage.getItem("quizResults");
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    } else {
      // Redirect to home if no results found
      router.push("/");
    }
  }, [router]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 border-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "hard":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
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
    if (expandedQuestions.size === results.quiz.questions?.length) {
      setExpandedQuestions(new Set());
    } else {
      setExpandedQuestions(new Set(results.quiz.questions?.map((q) => q.questionId) || []));
    }
  };
  const getAnswerText = (question: any, answer: string) => {
    if (!answer) return "No answer provided";

    // For MCQ, find the option text
    const option = question.options?.find((opt: any) => opt.optionId === answer);
    return option ? `${option.optionId}. ${option.text}` : answer;
  };

  const getCorrectAnswerText = (question: any) => {
    const correctAnswer = question.correctAnswer;

    // For MCQ, find the option text
    const option = question.options?.find((opt: any) => opt.optionId === correctAnswer);
    return option ? `${option.optionId}. ${option.text}` : correctAnswer;
  };

  const isCorrectAnswer = (question: any, userAnswer: string) => {
    return question.correctAnswer === userAnswer;
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {results.passed ? (
              <div className="bg-green-100 flex h-16 w-16 items-center justify-center rounded-full">
                <Award className="h-8 w-8 text-green-600" />
              </div>
            ) : (
              <div className="bg-red-100 flex h-16 w-16 items-center justify-center rounded-full">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-2">
            {results.passed ? "Congratulations!" : "Quiz Complete"}
          </h1>
          <p className="text-muted-foreground">
            {results.passed
              ? `You've successfully passed the ${results.quiz.quizTitle}!`
              : `You've completed the ${results.quiz.quizTitle}. Review your answers below.`}
          </p>
        </div>

        {/* Results Summary */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">{results.quiz.quizTitle}</CardTitle>
                <p className="text-muted-foreground mt-1">{results.quiz.quizDescription}</p>
              </div>
              <Badge variant="outline" className={getDifficultyColor(results.quiz.difficulty)}>
                {results.quiz.difficulty}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{results.percentage}%</div>
                <div className="text-sm text-muted-foreground">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{results.answeredQuestions}</div>
                <div className="text-sm text-muted-foreground">Questions Answered</div>
                <div className="text-xs text-muted-foreground">out of {results.totalQuestions}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{formatTime(results.timeSpent)}</div>
                <div className="text-sm text-muted-foreground">Time Spent</div>
                <div className="text-xs text-muted-foreground">out of {results.quiz.timeLimitMinutes} min</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{results.totalScore}</div>
                <div className="text-sm text-muted-foreground">Points Earned</div>
                <div className="text-xs text-muted-foreground">out of {results.maxScore}</div>
              </div>
            </div>

            <Progress value={results.percentage} className="h-3 mb-4" />
            
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span>Passing Score: {results.passingScore}%</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                {results.passed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <span className={results.passed ? "text-green-600" : "text-red-600"}>
                  {results.passed ? "Passed" : "Not Passed"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Question Review
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleAllQuestions}
              >
                {expandedQuestions.size === results.quiz.questions?.length
                  ? "Collapse All"
                  : "Expand All"}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {results.quiz.questions?.map((question, index) => {                const userAnswer = results.answers[question.questionId];
                const isCorrect = userAnswer ? isCorrectAnswer(question, userAnswer) : false;
                const isExpanded = expandedQuestions.has(question.questionId);

                return (
                  <Collapsible key={question.questionId} open={isExpanded}>
                    <Card className={`border-l-4 ${
                      isCorrect ? "border-l-green-500" : "border-l-red-500"
                    }`}>
                      <CollapsibleTrigger
                        onClick={() => toggleQuestion(question.questionId)}
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
                                <div className="font-medium">Question {index + 1}</div>
                                <div className="text-muted-foreground text-sm max-w-96 truncate">
                                  {question.questionText}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
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
                        <CardContent className="pt-0 space-y-4">
                          <div className="bg-muted/30 rounded-lg p-4">
                            <h4 className="font-medium mb-2">{question.questionText}</h4>
                            
                            {question.imageURL && (
                              <img
                                src={question.imageURL}
                                alt="Question image"
                                className="max-h-32 rounded object-contain mb-4"
                              />
                            )}

                            <div className="space-y-3">
                              <div className={`rounded border p-3 ${
                                isCorrect
                                  ? "border-green-300 bg-green-50 text-green-800"
                                  : "border-red-300 bg-red-50 text-red-800"
                              }`}>
                                <div className="text-sm font-medium mb-1">Your Answer:</div>                                <div className="text-sm">
                                  {userAnswer ? getAnswerText(question, userAnswer) : "No answer provided"}
                                </div>
                              </div>

                              {!isCorrect && (
                                <div className="rounded border border-green-300 bg-green-50 p-3 text-green-800">
                                  <div className="text-sm font-medium mb-1">Correct Answer:</div>
                                  <div className="text-sm">{getCorrectAnswerText(question)}</div>
                                </div>
                              )}

                              <div className="rounded border border-blue-300 bg-blue-50 p-3 text-blue-800">
                                <div className="text-sm font-medium mb-1">Explanation:</div>
                                <div className="text-sm leading-relaxed">{question.explanation}</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <Link href={`/quiz/start?id=${results.quiz._id}`}>
            <Button className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Retake Quiz
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
