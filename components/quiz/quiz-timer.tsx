import { useEffect, useRef, useState } from "react";

export default function QuizTimer({
  timeLimit,
  onTimeUp,
  isActive = true,
}: {
  timeLimit?: number; // in minutes
  onTimeUp: () => void;
  isActive?: boolean;
}) {
  const [secondsLeft, setSecondsLeft] = useState(
    timeLimit && timeLimit > 0 ? timeLimit * 60 : 0,
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    if (!isActive || !timeLimit || timeLimit === 0) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [isActive, timeLimit]);

  useEffect(() => {
    if (secondsLeft === 0 && isActive && !calledRef.current) {
      calledRef.current = true;
      onTimeUp();
    }
  }, [secondsLeft, isActive, onTimeUp]);

  if (!timeLimit || timeLimit === 0) return null;

  const min = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const sec = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <div className="bg-primary text-primary-foreground fixed top-4 right-4 z-40 rounded px-4 py-2 font-mono text-lg shadow">
      Time Left: {min}:{sec}
    </div>
  );
}
