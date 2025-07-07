import { getQuizById } from "@/database/quiz";
import { notFound } from "next/navigation";

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
};

export default QuizPlayPage;
