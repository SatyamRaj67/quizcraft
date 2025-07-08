import { useMemo } from "react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Quiz, Question } from "@/types";

interface QuizSidebarProps {
  quiz: Quiz;
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
}

const QuizSidebar = ({
  quiz,
  currentQuestionIndex,
  onQuestionSelect,
}: QuizSidebarProps) => {
  const groupedQuestions = useMemo(() => {
    return quiz.questions.reduce(
      (acc, question, index) => {
        const subject = question.subject || "General";
        if (!acc[subject]) {
          acc[subject] = [];
        }
        acc[subject].push({ question, originalIndex: index });
        return acc;
      },
      {} as Record<string, { question: Question; originalIndex: number }[]>,
    );
  }, [quiz.questions]);

  return (
    <>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <CardDescription>
          {quiz.description || "Select a question to begin."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="space-y-4 pr-4">
            {Object.entries(groupedQuestions).map(([subject, questions]) => (
              <div key={subject}>
                <h4 className="text-muted-foreground mb-2 text-sm font-semibold capitalize">
                  {subject}
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map(({ question, originalIndex }) => (
                    <Button
                      key={question.id}
                      variant={
                        originalIndex === currentQuestionIndex
                          ? "secondary"
                          : "outline"
                      }
                      className="h-10 w-10 p-0 text-xs"
                      onClick={() => onQuestionSelect(originalIndex)}
                    >
                      {originalIndex + 1}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </>
  );
};

export default QuizSidebar;
