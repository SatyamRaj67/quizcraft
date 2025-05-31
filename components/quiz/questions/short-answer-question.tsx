import { useState } from "react";
import { Input } from "@/components/ui/input";
import type { Question } from "@/schema";

interface ShortAnswerQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export function ShortAnswerQuestion({
  question,
  onAnswer,
}: ShortAnswerQuestionProps) {
  const [answer, setAnswer] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAnswer(value);
    onAnswer(value);
  };

  return (
    <div className="space-y-2">
      <Input
        value={answer}
        onChange={handleChange}
        placeholder="Type your answer here..."
        className="w-full"
      />
      {question.acceptableAnswers && (
        <p className="text-muted-foreground text-xs">
          Tip: Multiple answer formats may be accepted
        </p>
      )}
    </div>
  );
}
