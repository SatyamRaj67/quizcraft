"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Flag, FlagOff, Image as ImageIcon } from "lucide-react";

interface Question {
  questionId: string;
  questionText: string;
  questionType: "multiple-choice";
  category: string;
  points: number;
  options: Array<{ optionId: string; text: string }>;
  correctAnswer: string;
  explanation: string;
  imageURL?: string;
}

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  answer?: string;
  onAnswer: (answer: string) => void;
  isFlagged: boolean;
  onFlag: () => void;
  allowSkipping: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  answer,
  onAnswer,
  isFlagged,
  onFlag,
  allowSkipping,
}: QuestionCardProps) {
  const handleRadioChange = (value: string) => {
    onAnswer(value);
  };

  const isAnswered = answer !== undefined && answer !== "";

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              Question {questionNumber} of {totalQuestions}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {question.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {question.points} {question.points === 1 ? "point" : "points"}
            </Badge>
            {isAnswered && (
              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                Answered
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onFlag}
            className={`gap-2 ${
              isFlagged
                ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                : "hover:bg-gray-50"
            }`}
          >
            {isFlagged ? (
              <>
                <Flag className="w-4 h-4 fill-current" />
                Flagged
              </>
            ) : (
              <>
                <FlagOff className="w-4 h-4" />
                Flag
              </>
            )}
          </Button>
        </div>
        <CardTitle className="text-lg leading-relaxed">
          {question.questionText}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {question.imageURL && (
          <div className="flex justify-center">
            <div className="relative rounded-lg border overflow-hidden max-w-md">
              <img
                src={question.imageURL}
                alt="Question illustration"
                className="w-full h-auto"
              />
              <div className="absolute top-2 right-2 bg-black/20 rounded-full p-1">
                <ImageIcon className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <RadioGroup
            value={answer || ""}
            onValueChange={handleRadioChange}
            className="space-y-3"
          >
            {question.options.map((option) => (
              <div key={option.optionId} className="flex items-center space-x-3">
                <RadioGroupItem
                  value={option.optionId}
                  id={option.optionId}
                  className="mt-0.5"
                />
                <Label
                  htmlFor={option.optionId}
                  className="text-sm font-normal cursor-pointer flex-1 leading-relaxed py-2"
                >
                  <span className="font-medium mr-2 text-blue-600">
                    {option.optionId}.
                  </span>
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {allowSkipping && !answer && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              You can skip this question and return to it later.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
