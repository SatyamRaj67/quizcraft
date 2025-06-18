import type { Quiz } from "@/.example/quiz-schema";
import { useState } from "react";

const PRESET_TIMES = [0, 45, 60, 180]; // 0 = No limit, 45 min, 1 hr, 3 hr
const PRESET_LABELS = ["No limit", "45 min", "1 hr", "3 hr"];

export default function QuizStartDialog({
  quiz,
  onStart,
  onClose,
}: {
  quiz: Quiz;
  onStart: (settings: { negativeMarking: boolean; timeLimit?: number }) => void;
  onClose: () => void;
}) {
  const [timeLimit, setTimeLimit] = useState<number>(quiz.settings.timeLimit ?? 0);
  const [negativeMarking, setNegativeMarking] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background relative w-full max-w-md rounded-xl p-6 shadow-lg">
        <button className="absolute top-2 right-2 text-lg" onClick={onClose}>
          &times;
        </button>
        <h2 className="mb-2 text-2xl font-bold">{quiz.title}</h2>
        <p className="text-muted-foreground mb-2">{quiz.description}</p>
        <div className="bg-muted mb-4 rounded p-2 text-sm whitespace-pre-line">
          {quiz.instructions}
        </div>
        <div className="mb-4">
          <label className="mb-2 flex items-center gap-2">
            <input
              type="checkbox"
              checked={negativeMarking}
              onChange={(e) => setNegativeMarking(e.target.checked)}
            />
            Enable Negative Marking
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {PRESET_TIMES.map((min, i) => (
              <button
                key={min}
                type="button"
                className={`px-3 py-1 rounded border text-xs font-medium transition ${
                  timeLimit === min
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card hover:bg-muted border-muted-foreground/20"
                }`}
                onClick={() => setTimeLimit(min)}
              >
                {PRESET_LABELS[i]}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2">
            <span>Custom Time (minutes):</span>
            <input
              type="number"
              min={0}
              className="w-20 rounded border px-2 py-1"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              disabled={timeLimit === 0}
            />
          </label>
        </div>
        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded py-2 font-semibold transition"
          onClick={() =>
            onStart({
              negativeMarking,
              timeLimit: timeLimit > 0 ? timeLimit : undefined,
            })
          }
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
}
