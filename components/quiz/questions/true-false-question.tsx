import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Question } from "@/schema";

interface TrueFalseQuestionProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export function TrueFalseQuestion({
  question,
  onAnswer,
}: TrueFalseQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");

  const handleChange = (value: string) => {
    setSelectedAnswer(value);
    onAnswer(value);
  };

  return (
    <RadioGroup value={selectedAnswer} onValueChange={handleChange}>
      {question.options?.map((option) => (
        <div
          key={option.optionId}
          className="hover:bg-accent/50 flex items-center space-x-2 rounded-lg border p-3 transition-colors"
        >
          <RadioGroupItem value={option.optionId} id={option.optionId} />
          <Label htmlFor={option.optionId} className="flex-1 cursor-pointer">
            {option.text}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
