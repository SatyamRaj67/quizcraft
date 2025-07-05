import type { MCQQuestion } from "@/types";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MCQQuestionProps {
  question: MCQQuestion;
  onAnswer: (questionId: string, answer: string) => void;
  userAnswer?: string;
}

const MCQQuestionComponent = ({
  question,
  onAnswer,
  userAnswer,
}: MCQQuestionProps) => {
  return (
    <RadioGroup
      onValueChange={(value) => onAnswer(question.id, value)}
      value={userAnswer}
      className="space-y-2"
    >
      {question.options.map((option) => (
        <div
          key={option.id}
          className="hover:bg-accent flex items-center space-x-2 rounded-md p-2"
        >
          <RadioGroupItem
            value={option.id}
            id={`${question.id}-${option.id}`}
          />
          <Label
            htmlFor={`${question.id}-${option.id}`}
            className="flex-1 cursor-pointer"
          >
            {option.text}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default MCQQuestionComponent;
