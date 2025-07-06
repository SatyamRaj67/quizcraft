import type { Question } from "@/types";
import type { QuestionStatus } from "../quiz-player";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface QuizNavigationSidebarProps {
  questions: Question[];
  statuses: QuestionStatus[];
  onSelectQuestion: (index: number) => void;
}

export function QuizNavigationSidebar({
  questions,
  statuses,
  onSelectQuestion,
}: QuizNavigationSidebarProps) {
  return (
    <Sheet defaultOpen modal={false}>
      <SheetContent
        className="flex h-full w-80 flex-col border-l p-4"
        side="right"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader className="mb-2">
          <SheetTitle>Questions</SheetTitle>
          <SheetDescription className="grid grid-cols-5 gap-2 py-4">
            {questions.map((_, index) => (
              <Button
                size="icon"
                key={index}
                onClick={() => onSelectQuestion(index)}
                variant={statuses[index]}
                className="h-10 w-10"
              >
                {index + 1}
              </Button>
            ))}
          </SheetDescription>
        </SheetHeader>
        <SheetFooter className="mt-auto">Legend Under Construction</SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
