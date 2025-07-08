"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Question, QuizOption } from "@/types";

interface QuestionDisplayProps {
  question: Question;
  userAnswer: string | number | null;
  onAnswerChange: (answer: string | number | null) => void;
}

const QuestionDisplay = ({
  question,
  userAnswer,
  onAnswerChange,
}: QuestionDisplayProps) => {
  // ... existing guard clause ...
  if (!question) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Loading question...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* ... existing Question Header ... */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {question.subject}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize">
            {question.type}
          </Badge>
        </div>
        <h2 className="text-xl leading-relaxed font-semibold">
          {question.text}
        </h2>
      </div>

      {/* Answer Section */}
      <div className="space-y-4">
        {question.type === "mcq" && (
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm font-medium">
              Select one option:
            </p>
            <RadioGroup
              value={userAnswer as string}
              onValueChange={(value) => onAnswerChange(value)}
            >
              {question.options.map((option: QuizOption, index: number) => {
                const isFirst = index === 0;
                const isLast = index === question.options.length - 1;
                const isSelected = userAnswer === option.id;

                return (
                  <Card
                    key={option.id}
                    className={`p-0 transition-all duration-200 ${isFirst ? "rounded-t-md rounded-b-none" : ""} ${isLast ? "rounded-t-none rounded-b-md" : ""} ${!isFirst && !isLast ? "rounded-none" : ""} ${!isFirst ? "-mt-px" : ""} ${
                      isSelected
                        ? "border-primary bg-primary/5 z-10 shadow-sm"
                        : "border-border hover:bg-accent/50"
                    } `}
                  >
                    <Label
                      htmlFor={option.id}
                      className="flex cursor-pointer items-center space-x-3 p-4"
                    >
                      <RadioGroupItem value={option.id} id={option.id} />
                      <span className="flex-1 text-sm font-medium">
                        {String.fromCharCode(65 + index)}. {option.text}
                      </span>
                    </Label>
                  </Card>
                );
              })}
            </RadioGroup>
          </div>
        )}

        {question.type === "numerical" && (
          // ... existing numerical input code ...
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm font-medium">
              Enter your numerical answer:
            </p>
            <div className="max-w-xs">
              <Input
                type="number"
                placeholder="Enter your answer"
                value={userAnswer ?? ""}
                onChange={(e) => {
                  const value = e.target.valueAsNumber;
                  onAnswerChange(isNaN(value) ? null : value);
                }}
                className="text-lg"
                step="any"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;
