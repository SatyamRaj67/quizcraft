import type { NumericalQuestion } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NumericalQuestionProps {
  question: NumericalQuestion;
  onAnswer: (questionId: string, answer: number) => void;
  userAnswer?: number;
}

const NumericalQuestionComponent = ({
  question,
  onAnswer,
  userAnswer,
}: NumericalQuestionProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={`answer-${question.id}`}>Your Answer</Label>
      <Input
        id={`answer-${question.id}`}
        type="number"
        placeholder="Enter a number"
        onChange={(e) => onAnswer(question.id, e.target.valueAsNumber)}
        value={userAnswer ?? ""}
        className="max-w-sm"
      />
    </div>
  );
};

export default NumericalQuestionComponent;
