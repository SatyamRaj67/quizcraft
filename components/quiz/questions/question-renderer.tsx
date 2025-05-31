import type { Question } from "@/schema";
import { MultipleChoiceQuestion } from "./multiple-choice-question";
import { TrueFalseQuestion } from "./true-false-question";
import { ShortAnswerQuestion } from "./short-answer-question";
import { MultipleAnswerQuestion } from "./multiple-answer-question";

interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: string | string[]) => void;
}

export function QuestionRenderer({
  question,
  onAnswer,
}: QuestionRendererProps) {
  switch (question.questionType) {
    case "multiple-choice":
      return (
        <MultipleChoiceQuestion
          question={question}
          onAnswer={onAnswer as (answer: string) => void}
        />
      );

    case "true-false":
      return (
        <TrueFalseQuestion
          question={question}
          onAnswer={onAnswer as (answer: string) => void}
        />
      );

    case "short-answer":
      return (
        <ShortAnswerQuestion
          question={question}
          onAnswer={onAnswer as (answer: string) => void}
        />
      );

    case "multiple-choice-multiple-answer":
      return (
        <MultipleAnswerQuestion
          question={question}
          onAnswer={onAnswer as (answer: string[]) => void}
        />
      );

    default:
      return (
        <div className="text-muted-foreground text-center">
          Unsupported question type: {question.questionType}
        </div>
      );
  }
}
