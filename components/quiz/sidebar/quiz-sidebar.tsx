"use client";

import { Button } from "@/components/ui/button";

export const QuizSidebar = () => {
  const questions = Array.from({ length: 15 }, (_, i) => `Question ${i + 1}`);

  return (
    <aside className="w-64 border-l p-4">
      <h3 className="mb-4 text-lg font-semibold">Questions</h3>
      <div className="flex flex-col gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant={index === 0 ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            {question}
          </Button>
        ))}
      </div>
    </aside>
  );
};
