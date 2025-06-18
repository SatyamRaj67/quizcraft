import type { Quiz, QuizSection, QuizQuestion } from "@/.example/quiz-schema";
import { useState } from "react";
import QuizTimer from "./quiz-timer";

function flattenQuestions(sections: QuizSection[]): QuizQuestion[] {
  return sections.flatMap((section) => section.questions);
}

export default function QuizPage({
  quiz,
  settings,
  onExit,
}: {
  quiz: Quiz;
  settings: { timeLimit?: number; negativeMarking?: boolean };
  onExit: () => void;
}) {
  const allQuestions = flattenQuestions(quiz.sections);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});

  const question = allQuestions[current];
  const isLast = current === allQuestions.length - 1;

  function selectOption(optionId: string) {
    if (!question) return;
    setAnswers((a) => ({ ...a, [question.id]: optionId }));
  }

  function setNumericalAnswer(val: string) {
    if (!question) return;
    setAnswers((a) => ({ ...a, [question.id]: val }));
  }

  function next() {
    if (!isLast) setCurrent((c) => c + 1);
    else setShowResult(true);
  }

  function prev() {
    if (current > 0) setCurrent((c) => c - 1);
  }

  function restart() {
    setCurrent(0);
    setAnswers({});
    setFlagged({});
    setShowResult(false);
  }

  function handleFlag() {
    if (!question) return;
    setFlagged((f) => ({ ...f, [question.id]: !f[question.id] }));
  }

  function jumpTo(idx: number) {
    setCurrent(idx);
  }

  // Scoring logic: per-question positive/negative, MCQ/numerical
  const score = allQuestions.reduce((acc: number, q) => {
    const ans = answers[q.id];
    if (!ans) return acc;
    if (q.type === "mcq" && ans === q.answerId)
      return acc + (q.positiveMarks ?? 4);
    if (q.type === "mcq" && ans !== q.answerId)
      return acc - (q.negativeMarks ?? 1);
    if (q.type === "numerical" && Number(ans) === q.answerValue)
      return acc + (q.positiveMarks ?? 4);
    if (q.type === "numerical" && Number(ans) !== q.answerValue)
      return acc - (q.negativeMarks ?? 1);
    return acc;
  }, 0);

  function handleTimeUp() {
    setShowResult(true);
  }

  if (showResult) {
    return (
      <div className="mx-auto max-w-xl py-8">
        <h2 className="mb-4 text-2xl font-bold">Quiz Results</h2>
        <div className="mb-4">
          Score: <span className="font-semibold">{score}</span> /{" "}
          {allQuestions.reduce((acc, q) => acc + (q.positiveMarks ?? 4), 0)}
        </div>
        <button
          className="bg-primary text-primary-foreground mr-2 rounded px-4 py-2"
          onClick={restart}
        >
          Restart
        </button>
        <button
          className="bg-muted text-foreground rounded px-4 py-2"
          onClick={onExit}
        >
          Exit
        </button>
        <div className="mt-6">
          <h3 className="mb-2 font-semibold">Review:</h3>
          {allQuestions.map((q, idx) => (
            <div key={q.id} className="bg-card mb-4 rounded border p-3">
              <div className="mb-1 font-medium">
                Q{idx + 1} ({q.section}): {q.question}
              </div>
              <div className="mb-1">
                Your answer:{" "}
                {q.type === "mcq" ? (
                  <span
                    className={
                      answers[q.id] === q.answerId
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {q.options?.find((o) => o.id === answers[q.id])?.text ??
                      "Not answered"}
                  </span>
                ) : (
                  <span
                    className={
                      Number(answers[q.id]) === q.answerValue
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {answers[q.id] ?? "Not answered"}
                  </span>
                )}
              </div>
              <div className="text-muted-foreground text-xs">
                Correct:{" "}
                {q.type === "mcq"
                  ? q.options?.find((o) => o.id === q.answerId)?.text
                  : q.answerValue}
              </div>
              <div className="text-xs">
                Marks: +{q.positiveMarks ?? 4}, -{q.negativeMarks ?? 1}
              </div>
              {q.explanation && (
                <div className="mt-1 text-xs">Explanation: {q.explanation}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!question) return null;

  // Right sidebar for navigation (with timer above)
  const questionsPerRow = 5;
  // Group questions by section for navigation
  const sectionNav = quiz.sections.map((section) => {
    const sectionQuestions = section.questions;
    const navButtons = sectionQuestions.map((q, idx) => {
      const globalIdx = allQuestions.findIndex((qq) => qq.id === q.id);
      let color = "bg-muted";
      if (current === globalIdx) color = "bg-blue-500 text-white";
      else if (flagged[q.id]) color = "bg-purple-500 text-white";
      else if (answers[q.id]) color = "bg-green-500 text-white";
      else color = "bg-red-500 text-white";
      return (
        <button
          key={q.id}
          className={`mb-1 h-8 w-8 rounded-full text-xs font-bold transition ${color}`}
          onClick={() => jumpTo(globalIdx)}
        >
          {idx + 1}
        </button>
      );
    });
    // Arrange buttons in rows of 5
    const navRows = [];
    for (let i = 0; i < navButtons.length; i += questionsPerRow) {
      navRows.push(
        <div key={i} className="mb-1 flex justify-center gap-2">
          {navButtons.slice(i, i + questionsPerRow)}
        </div>,
      );
    }
    return (
      <div key={section.name} className="mb-4 w-full">
        <div className="text-primary mb-1 text-center text-xs font-bold tracking-wide uppercase">
          {section.name}
        </div>
        {navRows}
      </div>
    );
  });

  return (
    <div className="flex">
      <main className="relative mx-auto max-w-xl flex-1 px-4 py-8">
        <h2 className="mb-2 text-xl font-bold">{quiz.title}</h2>
        <div className="text-muted-foreground mb-2">
          Section: <span className="font-semibold">{question.section}</span> |
          Question {current + 1} of {allQuestions.length}
        </div>
        <div className="mb-4 font-medium">{question.question}</div>
        <button
          className={`mb-2 rounded border px-3 py-1 text-xs font-medium transition ${flagged[question.id] ? "border-purple-500 bg-purple-500 text-white" : "bg-card hover:bg-muted border-muted-foreground/20"}`}
          onClick={handleFlag}
        >
          {flagged[question.id] ? "Unflag" : "Flag"} Question
        </button>
        {question.type === "mcq" && (
          <div className="mb-4 grid gap-2">
            {question.options?.map((opt) => (
              <button
                key={opt.id}
                className={`w-full rounded border px-4 py-2 text-left font-medium transition ${answers[question.id] === opt.id ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted border-muted-foreground/20"}`}
                onClick={() => selectOption(opt.id)}
              >
                {opt.text}
              </button>
            ))}
          </div>
        )}
        {question.type === "numerical" && (
          <div className="mb-4">
            <input
              type="number"
              className="bg-card border-muted-foreground/20 focus:outline-primary w-full rounded border px-4 py-2 font-medium"
              value={answers[question.id] ?? ""}
              onChange={(e) => setNumericalAnswer(e.target.value)}
              placeholder="Enter your answer"
            />
          </div>
        )}
        <div className="text-muted-foreground mb-2 text-xs">
          Marks: +{question.positiveMarks ?? 4}, -{question.negativeMarks ?? 1}
        </div>
        <div className="flex gap-2">
          <button
            className="bg-muted text-foreground rounded px-4 py-2"
            onClick={prev}
            disabled={current === 0}
          >
            Previous
          </button>
          <button
            className="bg-primary text-primary-foreground rounded px-4 py-2"
            onClick={next}
          >
            {isLast ? "Finish" : "Next"}
          </button>
        </div>
        <button
          className="text-muted-foreground mt-4 text-xs underline"
          onClick={onExit}
        >
          Exit Quiz
        </button>
      </main>
      <aside className="bg-muted/40 sticky top-0 z-30 flex h-screen max-w-[260px] min-w-[220px] flex-col items-center gap-2 border-l py-4 shadow-lg">
        <div className="mb-4 flex w-full justify-center">
          <QuizTimer
            timeLimit={settings.timeLimit}
            onTimeUp={handleTimeUp}
            isActive={!showResult}
          />
        </div>
        <div className="w-full overflow-y-auto px-2">{sectionNav}</div>
      </aside>
    </div>
  );
}
