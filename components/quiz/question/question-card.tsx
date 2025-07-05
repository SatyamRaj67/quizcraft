import type { Question } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MCQQuestionComponent from "./mcq-question";
import NumericalQuestionComponent from "./numerical-question";

interface QuestionCardProps {
  question: Question;
  onAnswer: (questionId: string, answer: string | number) => void;
  userAnswers: Record<string, string | number>;
}

const QuestionCard = ({
  question,
  onAnswer,
  userAnswers,
}: QuestionCardProps) => {
  const renderQuestionType = () => {
    switch (question.type) {
      case "mcq":
        return (
          <MCQQuestionComponent
            question={question}
            onAnswer={onAnswer}
            userAnswer={userAnswers[question.id] as string}
          />
        );
      case "numerical":
        return (
          <NumericalQuestionComponent
            question={question}
            onAnswer={onAnswer}
            userAnswer={userAnswers[question.id] as number}
          />
        );
      default:
        return <p>Unsupported question type</p>;
    }
  };

  return (
    <Card
      style={
        {
          "--border-color":
            question.type === "mcq"
              ? "hsl(var(--primary))"
              : "hsl(var(--secondary))",
        } as React.CSSProperties
      }
      className="border-2"
    >
      <CardHeader>
        <CardTitle>{question.text}</CardTitle>
        <CardDescription>{question.pointsCorrect} point(s)</CardDescription>
      </CardHeader>
      <CardContent>{renderQuestionType()}</CardContent>
    </Card>
  );
};

export default QuestionCard;