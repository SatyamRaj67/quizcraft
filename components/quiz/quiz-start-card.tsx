"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Rocket } from "lucide-react";

type QuizStartCardProps = {
  quizId: string;
};

export const QuizStartCard = ({ quizId }: QuizStartCardProps) => {
  const router = useRouter();
  const [enableTimer, setEnableTimer] = useState(true);
  const [instantAnswers, setInstantAnswers] = useState(false);

  const handleStartQuiz = () => {
    const params = new URLSearchParams({
      timer: String(enableTimer),
      instant: String(instantAnswers),
    });
    router.push(`/quiz/${quizId}/play?${params.toString()}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="timer-switch" className="font-semibold">
            Enable Timer
          </Label>
          <Switch
            id="timer-switch"
            checked={enableTimer}
            onCheckedChange={setEnableTimer}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="instant-answers-switch" className="font-semibold">
            Show Instant Answers
          </Label>
          <Switch
            id="instant-answers-switch"
            checked={instantAnswers}
            onCheckedChange={setInstantAnswers}
          />
        </div>
        <Button onClick={handleStartQuiz} className="w-full" size="lg">
          <Rocket className="mr-2 h-5 w-5" />
          Start Quiz
        </Button>
      </CardContent>
    </Card>
  );
};
