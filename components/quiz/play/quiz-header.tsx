import { Clock } from "lucide-react";

interface QuizHeaderProps {
  time: number;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export const QuizHeader = ({ time }: QuizHeaderProps) => (
  <header className="flex flex-shrink-0 items-center justify-between border-b p-4">
    <h1 className="text-xl font-bold">Quiz</h1>
    <div className="flex items-center gap-2 rounded-md border px-3 py-1">
      <Clock size={16} />
      <span className="font-mono text-base font-semibold">
        {formatTime(time)}
      </span>
    </div>
  </header>
);
