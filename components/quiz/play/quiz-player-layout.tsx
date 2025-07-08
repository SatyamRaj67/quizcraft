"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { PanelLeft, ChevronLeft, ChevronRight } from "lucide-react";
import type { Quiz } from "@/types";
import QuizSidebar from "./quiz-sidebar";
import QuestionDisplay from "./question-display";

interface QuizPlayerLayoutProps {
  quiz: Quiz;
}

const QuizPlayerLayout = ({ quiz }: QuizPlayerLayoutProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | number | null)[]>(
    Array(quiz.questions.length).fill(null),
  );
  const question = quiz.questions[currentQuestionIndex];

  const handleAnswerChange = (answer: string | number | null) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const goToNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="grid w-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
      {/* Question Card Section */}
      <div className="flex flex-col items-center justify-center p-6 md:col-span-2 lg:col-span-3">
        <Card className="flex w-full max-w-3xl flex-col">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
            {/* Drawer Trigger for Mobile */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <PanelLeft className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-sm p-0">
                  <QuizSidebar
                    quiz={quiz}
                    currentQuestionIndex={currentQuestionIndex}
                    onQuestionSelect={setCurrentQuestionIndex}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            {question && (
              <QuestionDisplay
                question={question}
                userAnswer={answers[currentQuestionIndex]!}
                onAnswerChange={handleAnswerChange}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={goToPrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
              onClick={goToNext}
              disabled={currentQuestionIndex === quiz.questions.length - 1}
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Sidebar Section (for desktop) */}
      <div className="bg-muted/30 hidden h-full md:col-span-1 md:flex md:items-center md:justify-center md:border-l md:p-6">
        <Card className="h-full w-full max-w-sm">
          <QuizSidebar
            quiz={quiz}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionSelect={setCurrentQuestionIndex}
          />
        </Card>
      </div>
    </div>
  );
};

export default QuizPlayerLayout;
