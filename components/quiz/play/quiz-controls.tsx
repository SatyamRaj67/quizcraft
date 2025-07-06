import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";

interface QuizControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onFlag: () => void;
  isFirst: boolean;
  isLast: boolean;
  isFlagged: boolean;
}

export const QuizControls = ({
  onPrevious,
  onNext,
  onFlag,
  isFirst,
  isLast,
  isFlagged,
}: QuizControlsProps) => (
  <footer className="flex flex-shrink-0 items-center justify-between border-t">
    <Button onClick={onPrevious} disabled={isFirst} variant="outline">
      <ChevronLeft className="mr-2 h-4 w-4" /> Previous
    </Button>
    <Button
      onClick={onFlag}
      variant={isFlagged ? "secondary" : "outline"}
      className={isFlagged ? "font-bold" : ""}
    >
      <Flag className="mr-2 h-4 w-4" /> {isFlagged ? "Unflag" : "Flag"}
    </Button>
    <Button onClick={onNext} disabled={isLast}>
      Next <ChevronRight className="ml-2 h-4 w-4" />
    </Button>
  </footer>
);
