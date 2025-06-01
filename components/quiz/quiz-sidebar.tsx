"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Flag, 
  Target,
  ChevronRight,
  CheckCircle2,
  Circle
} from "lucide-react";

interface QuizSidebarProps {
  quiz: {
    _id: string;
    quizTitle: string;
    difficulty: string;
    category: string;
    timeLimitMinutes: number;
    passingScorePercentage: number;
    questions?: Array<{
      questionId: string;
      category: string;
      questionText: string;
      points: number;
    }>;
  };
  currentQuestionIndex: number;
  answers: Record<string, string>; // MCQ-only: string answers only
  flaggedQuestions: Set<string>;
  onQuestionSelect: (index: number) => void;
  timeRemaining: string;
}

export function QuizSidebar({
  quiz,
  currentQuestionIndex,
  answers,
  flaggedQuestions,
  onQuestionSelect,
  timeRemaining,
}: QuizSidebarProps) {
  const questions = quiz.questions || [];
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).length;
  const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  // Group questions by category for navigation
  const categories = [...new Set(questions.map(q => q.category))];
  const questionsByCategory = categories.reduce((acc, category) => {
    acc[category] = questions
      .map((q, index) => ({ ...q, index }))
      .filter(q => q.category === category);
    return acc;
  }, {} as Record<string, Array<any>>);

  const getQuestionStatus = (questionIndex: number, questionId: string) => {
    if (questionIndex === currentQuestionIndex) return 'current';
    if (answers[questionId]) return 'answered';
    if (flaggedQuestions.has(questionId)) return 'flagged';
    if (questionIndex < currentQuestionIndex) return 'skipped';
    return 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current': return <Circle className="h-3 w-3 fill-blue-500 text-blue-500" />;
      case 'answered': return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      case 'flagged': return <Flag className="h-3 w-3 text-purple-500" />;
      case 'skipped': return <Circle className="h-3 w-3 text-orange-500" />;
      default: return <Circle className="h-3 w-3 text-gray-300" />;
    }
  };

  return (
    <div className="w-72 bg-background border-l h-screen overflow-hidden flex flex-col">      {/* Quiz Header */}
      <div className="p-4 border-b bg-card/50">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs font-medium">
              {quiz.difficulty}
            </Badge>
            <div className="flex items-center gap-1 text-sm font-mono text-muted-foreground">
              <Clock className="h-3 w-3" />
              {timeRemaining}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{answeredQuestions}/{totalQuestions} answered</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground">
              {Math.round(progressPercentage)}% complete
            </div>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">          {categories.map((category) => {
            const categoryQuestions = questionsByCategory[category] || [];
            const answeredInCategory = categoryQuestions.filter(q => answers[q.questionId]).length;
            
            return (
              <Card key={category} className="border-none shadow-none bg-muted/30">
                <CardHeader className="pb-2 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{category}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {answeredInCategory}/{categoryQuestions.length}
                    </Badge>
                  </div>
                </CardHeader>                <CardContent className="px-3 pb-3">
                  <div className="grid grid-cols-5 gap-1.5">
                    {categoryQuestions.map((question) => {
                      const status = getQuestionStatus(question.index, question.questionId);
                      
                      return (
                        <Button
                          key={question.questionId}
                          variant="ghost"
                          size="sm"
                          className={`h-9 w-9 p-0 text-xs font-medium transition-all rounded-md ${
                            status === 'current' 
                              ? 'bg-blue-500 text-white shadow-sm' 
                              : status === 'answered'
                              ? 'bg-green-500 text-white shadow-sm'
                              : status === 'flagged'
                              ? 'bg-purple-500 text-white shadow-sm'
                              : status === 'skipped'
                              ? 'bg-orange-100 text-orange-700 border border-orange-200'
                              : 'hover:bg-gray-100 border border-gray-200'
                          }`}
                          onClick={() => onQuestionSelect(question.index)}
                          title={`Question ${question.index + 1}: ${question.questionText.substring(0, 50)}...`}
                        >
                          {question.index + 1}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>      {/* Quick Actions */}
      <div className="p-4 border-t bg-card/50 space-y-2">
        <div className="text-xs font-medium text-muted-foreground mb-2">QUICK ACTIONS</div>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start h-9"
          onClick={() => {
            const firstUnanswered = questions.findIndex(q => !answers[q.questionId]);
            if (firstUnanswered !== -1) {
              onQuestionSelect(firstUnanswered);
            }
          }}
          disabled={answeredQuestions === totalQuestions}
        >
          <Target className="h-4 w-4 mr-2" />
          Next Unanswered
        </Button>
        
        {flaggedQuestions.size > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start h-9"
            onClick={() => {
              const firstFlagged = questions.findIndex(q => flaggedQuestions.has(q.questionId));
              if (firstFlagged !== -1) {
                onQuestionSelect(firstFlagged);
              }
            }}
          >
            <Flag className="h-4 w-4 mr-2" />
            Review Flagged ({flaggedQuestions.size})
          </Button>
        )}

        {/* Quiz Statistics */}
        <div className="pt-2 border-t mt-3">
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Answered:</span>
              <span className="font-medium">{answeredQuestions}</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining:</span>
              <span className="font-medium">{totalQuestions - answeredQuestions}</span>
            </div>
            {flaggedQuestions.size > 0 && (
              <div className="flex justify-between">
                <span>Flagged:</span>
                <span className="font-medium text-purple-600">{flaggedQuestions.size}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
