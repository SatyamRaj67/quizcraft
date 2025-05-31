import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
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
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[]>("");
  const [multipleAnswers, setMultipleAnswers] = useState<string[]>([]);

  const handleSubmit = () => {
    if (question.questionType === "multiple-choice-multiple-answer") {
      onAnswer(multipleAnswers);
    } else {
      onAnswer(selectedAnswer as string);
    }
    onNext();
  };

  const handleMultipleAnswerChange = (optionId: string, checked: boolean) => {
    if (checked) {
      setMultipleAnswers([...multipleAnswers, optionId]);
    } else {
      setMultipleAnswers(multipleAnswers.filter((id) => id !== optionId));
    }
  };

  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-muted-foreground text-sm font-medium">
            Question {questionNumber} of {totalQuestions}
          </CardTitle>
          <span className="text-sm font-medium">{question.points} points</span>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <h2 className="text-xl font-semibold">{question.questionText}</h2>

        {question.imageURL && (
          <div className="bg-muted flex h-48 w-full items-center justify-center rounded-lg">
            <img
              src={question.imageURL}
              alt="Question image"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}

        <div className="space-y-4">
          {question.questionType === "multiple-choice" && (
            <RadioGroup
              value={selectedAnswer as string}
              onValueChange={setSelectedAnswer}
            >
              {question.options?.map((option) => (
                <div
                  key={option.optionId}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={option.optionId}
                    id={option.optionId}
                  />
                  <Label htmlFor={option.optionId}>{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.questionType === "true-false" && (
            <RadioGroup
              value={selectedAnswer as string}
              onValueChange={setSelectedAnswer}
            >
              {question.options?.map((option) => (
                <div
                  key={option.optionId}
                  className="flex items-center space-x-2"
                >
                  <RadioGroupItem
                    value={option.optionId}
                    id={option.optionId}
                  />
                  <Label htmlFor={option.optionId}>{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.questionType === "short-answer" && (
            <Input
              value={selectedAnswer as string}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full"
            />
          )}

          {question.questionType === "multiple-choice-multiple-answer" && (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">
                Select all that apply:
              </p>
              {question.options?.map((option) => (
                <div
                  key={option.optionId}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={option.optionId}
                    checked={multipleAnswers.includes(option.optionId)}
                    onCheckedChange={(checked) =>
                      handleMultipleAnswerChange(
                        option.optionId,
                        checked as boolean,
                      )
                    }
                  />
                  <Label htmlFor={option.optionId}>{option.text}</Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={
            (!selectedAnswer &&
              question.questionType !== "multiple-choice-multiple-answer") ||
            (question.questionType === "multiple-choice-multiple-answer" &&
              multipleAnswers.length === 0)
          }
          className="w-full"
        >
          Next Question
        </Button>
      </CardContent>
    </Card>
  );
}
