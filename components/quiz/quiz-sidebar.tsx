import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, Target } from "lucide-react";
import type { Quiz } from "@/schema";

interface QuizSidebarProps {
  quiz: Quiz;
  currentQuestionIndex: number;
  answers: Record<string, string | string[]>;
  results?: {
    results: Array<{
      questionId: string;
      correct: boolean;
      points: number;
      maxPoints: number;
    }>;
  };
  timeRemaining?: string;
}

export function QuizSidebar({
  quiz,
  currentQuestionIndex,
  answers,
  results,
  timeRemaining,
}: QuizSidebarProps) {
  // Group questions by category
  const questionsByCategory = quiz.questions.reduce(
    (acc, question, index) => {
      if (!acc[question.category]) {
        acc[question.category] = [];
      }
      acc[question.category]!.push({ ...question, originalIndex: index });
      return acc;
    },
    {} as Record<string, Array<any>>,
  );

  const getQuestionStatus = (questionId: string) => {
    if (results) {
      const result = results.results.find((r) => r.questionId === questionId);
      return result ? (result.correct ? "correct" : "incorrect") : "unanswered";
    }
    return answers[questionId] ? "answered" : "unanswered";
  };

  const getCategoryStats = (categoryQuestions: any[]) => {
    const total = categoryQuestions.length;
    const answered = categoryQuestions.filter((q) => answers[q.id]).length;

    if (results) {
      const correct = categoryQuestions.filter((q) => {
        const result = results.results.find((r) => r.questionId === q.id);
        return result?.correct;
      }).length;
      return { total, answered, correct };
    }

    return { total, answered, correct: 0 };
  };

  const totalQuestions = quiz.questions.length;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="bg-muted/30 w-80 space-y-4 border-l p-4">
      {/* Quiz Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{quiz.quizTitle}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {quiz.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {quiz.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Timer */}
          {timeRemaining && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="text-muted-foreground h-4 w-4" />
              <span>Time: {timeRemaining}</span>
            </div>
          )}

          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {answeredQuestions} / {totalQuestions}
              </span>
            </div>
            <Progress
              value={(answeredQuestions / totalQuestions) * 100}
              className="h-2"
            />
          </div>

          {/* Current Question */}
          <div className="flex items-center gap-2 text-sm">
            <Target className="text-muted-foreground h-4 w-4" />
            <span>
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Questions by Category */}
      <div className="space-y-3">
        <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
          Questions by Category
        </h3>

        {Object.entries(questionsByCategory).map(
          ([category, categoryQuestions]) => {
            const stats = getCategoryStats(categoryQuestions);
            const progressValue = results
              ? (stats.correct / stats.total) * 100
              : (stats.answered / stats.total) * 100;

            return (
              <Card key={category} className="border-l-primary/50 border-l-4">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {category}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {stats.total} questions
                    </Badge>
                  </div>

                  {/* Category Progress */}
                  <div className="space-y-1">
                    <div className="text-muted-foreground flex justify-between text-xs">
                      <span>
                        {results
                          ? `${stats.correct}/${stats.total} correct`
                          : `${stats.answered}/${stats.total} answered`}
                      </span>
                      <span>{Math.round(progressValue)}%</span>
                    </div>
                    <Progress value={progressValue} className="h-1.5" />
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Question Grid */}
                  <div className="grid grid-cols-5 gap-1">
                    {categoryQuestions.map((question) => {
                      const status = getQuestionStatus(question.id);
                      const isCurrent =
                        question.originalIndex === currentQuestionIndex;

                      let bgColor = "bg-muted";
                      let icon = null;

                      if (status === "correct") {
                        bgColor = "bg-green-100 border-green-300";
                        icon = (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        );
                      } else if (status === "incorrect") {
                        bgColor = "bg-red-100 border-red-300";
                        icon = <XCircle className="h-3 w-3 text-red-600" />;
                      } else if (status === "answered") {
                        bgColor = "bg-blue-100 border-blue-300";
                      }

                      if (isCurrent) {
                        bgColor += " ring-2 ring-primary";
                      }

                      return (
                        <div
                          key={question.id}
                          className={`flex h-8 w-8 items-center justify-center rounded border text-xs font-medium transition-all duration-200 ${bgColor} ${isCurrent ? "scale-110" : ""} `}
                          title={`Question ${question.originalIndex + 1}: ${question.questionText.slice(0, 50)}...`}
                        >
                          {icon || question.originalIndex + 1}
                        </div>
                      );
                    })}
                  </div>

                  {/* Category Points */}
                  <div className="text-muted-foreground mt-3 border-t pt-2 text-xs">
                    <div className="flex justify-between">
                      <span>Total Points:</span>
                      <span>
                        {categoryQuestions.reduce(
                          (sum, q) => sum + q.points,
                          0,
                        )}
                      </span>
                    </div>
                    {results && (
                      <div className="flex justify-between">
                        <span>Earned Points:</span>
                        <span>
                          {categoryQuestions.reduce((sum, q) => {
                            const result = results.results.find(
                              (r) => r.questionId === q.id,
                            );
                            return sum + (result?.points || 0);
                          }, 0)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          },
        )}
      </div>

      {/* Legend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Legend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="bg-muted h-4 w-4 rounded border"></div>
              <span>Not answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-blue-300 bg-blue-100"></div>
              <span>Answered</span>
            </div>
            {results && (
              <>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border border-green-300 bg-green-100"></div>
                  <span>Correct</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border border-red-300 bg-red-100"></div>
                  <span>Incorrect</span>
                </div>
              </>
            )}
            <div className="col-span-2 flex items-center gap-2">
              <div className="bg-muted ring-primary h-4 w-4 rounded border ring-2"></div>
              <span>Current question</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
