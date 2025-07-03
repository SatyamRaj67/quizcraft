"use client";

import { useState } from "react";
import type { Quiz } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";

type QuizPlayerProps = {
  quiz: Quiz;
};

export const QuizPlayer = ({ quiz }: QuizPlayerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <main className="container mx-auto max-w-2xl px-4 py-12">
      <Card>
        <CardHeader>
          <Progress value={progress} className="mb-4" />
          <CardTitle>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-lg font-semibold">{currentQuestion!.text}</p>

          {currentQuestion!.type === "mcq" && (
            <RadioGroup className="space-y-2">
              {currentQuestion!.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2 rounded-md border p-3"
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
              onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              disabled={currentQuestionIndex === quiz.questions.length - 1}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};
