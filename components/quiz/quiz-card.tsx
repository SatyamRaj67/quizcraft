import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Award, BookOpen } from "lucide-react";
import type { Quiz } from "@/schema";

interface QuizCardProps {
  quiz: Quiz;
  onStart: () => void;
}

export function QuizCard({ quiz, onStart }: QuizCardProps) {
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">
              {quiz.quizTitle}
            </CardTitle>
            <CardDescription className="mt-2">
              {quiz.quizDescription}
            </CardDescription>
          </div>
          <Badge variant="outline">{quiz.difficulty}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {quiz.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="text-muted-foreground flex items-center gap-6 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{quiz.timeLimitMinutes} minutes</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span>{quiz.questions.length} questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            <span>{quiz.passingScorePercentage}% to pass</span>
          </div>
        </div>

        <Button onClick={onStart} className="w-full">
          Start Quiz
        </Button>
      </CardContent>
    </Card>
  );
}
