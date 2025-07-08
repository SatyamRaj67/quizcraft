import { getQuizById } from "@/database/quiz";
import { notFound } from "next/navigation";
import QuizPlayerLayout from "@/components/quiz/play/quiz-player-layout";

const QuizPlayPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const quizData = await getQuizById(id);

  if (!quizData) {
    return notFound();
  }

  console.log("Quiz Data:", quizData);

  return <QuizPlayerLayout quiz={quizData} />;
};

export default QuizPlayPage;
