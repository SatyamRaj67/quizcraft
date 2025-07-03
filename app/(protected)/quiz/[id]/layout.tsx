"use client";

import { QuizSidebar } from "@/components/quiz/sidebar/quiz-sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";

const QuizLayout = ({ children }: { children: React.ReactNode }) => {
  const { setOpen } = useSidebar();

  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  return children;
};

export default QuizLayout;
