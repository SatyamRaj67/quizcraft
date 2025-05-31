import { useState, useCallback, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { Question } from "@/schema";

interface MultipleAnswerQuestionProps {
  question: Question;
  onAnswer: (answers: string[]) => void;
}

export function MultipleAnswerQuestion({
  question,
  onAnswer,
}: MultipleAnswerQuestionProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  const handleAnswerChange = useCallback(
    (optionId: string, checked: boolean) => {
      setSelectedAnswers((prev) => {
        return checked
          ? [...prev, optionId]
          : prev.filter((id) => id !== optionId);
      });
    },
    [],
  );

  // Call onAnswer in useEffect to avoid render cycle issues
  useEffect(() => {
    onAnswer(selectedAnswers);
  }, [selectedAnswers, onAnswer]);

  // Reset when question changes
  useEffect(() => {
    setSelectedAnswers([]);
  }, [question.id]);

  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm font-medium">
        Select all that apply:
      </p>
      {question.options?.map((option) => (
        <div
          key={option.optionId}
          className="hover:bg-accent/50 flex items-center space-x-2 rounded-lg border p-3 transition-colors"
        >
          <Checkbox
            id={option.optionId}
            checked={selectedAnswers.includes(option.optionId)}
            onCheckedChange={(checked) =>
              handleAnswerChange(option.optionId, checked as boolean)
            }
          />
          <Label htmlFor={option.optionId} className="flex-1 cursor-pointer">
            {option.text}
          </Label>
        </div>
      ))}
    </div>
  );
}
