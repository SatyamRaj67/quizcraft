import { useMemo, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { QuestionRenderer } from "./questions/question-renderer";
import type { Question } from "@/schema";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string | string[]) => void;
  onNext: () => void;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onNext,
}: QuestionCardProps) {
  const [currentAnswer, setCurrentAnswer] = useState<string | string[]>("");

  // Memoize calculations
  const progress = useMemo(
    () => (questionNumber / totalQuestions) * 100,
    [questionNumber, totalQuestions],
  );

  const isAnswered = useMemo(() => {
    if (Array.isArray(currentAnswer)) {
      return currentAnswer.length > 0;
    }
    return currentAnswer.length > 0;
  }, [currentAnswer]);

  // Use useCallback to prevent infinite re-renders
  const handleAnswer = useCallback(
    (answer: string | string[]) => {
      setCurrentAnswer(answer);
      onAnswer(answer);
    },
    [onAnswer],
  );

  const handleNext = () => {
    onNext();
    setCurrentAnswer(
      question.questionType === "multiple-choice-multiple-answer" ? [] : "",
    );
  };

  // Reset answer when question changes
  const resetAnswer = useCallback(() => {
    setCurrentAnswer(
      question.questionType === "multiple-choice-multiple-answer" ? [] : "",
    );
  }, [question.questionType]);

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-medium">
              Question {questionNumber} of {totalQuestions}
            </span>
            <Badge variant="outline" className="text-xs">
              {question.category}
            </Badge>
          </div>
          <span className="text-sm font-medium">{question.points} points</span>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>

      <CardContent className="space-y-6">
        <h2 className="text-xl leading-relaxed font-semibold">
          {question.questionText}
        </h2>

        {question.imageURL && (
          <div className="bg-muted flex h-48 w-full items-center justify-center overflow-hidden rounded-lg">
            <img
              src={question.imageURL}
              alt="Question image"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}

        <QuestionRenderer
          question={question}
          onAnswer={handleAnswer}
          key={question.id} // Force re-mount when question changes
        />

        <Button onClick={handleNext} disabled={!isAnswered} className="w-full">
          {questionNumber === totalQuestions ? "Finish Quiz" : "Next Question"}
        </Button>
      </CardContent>
    </Card>
  );
}
