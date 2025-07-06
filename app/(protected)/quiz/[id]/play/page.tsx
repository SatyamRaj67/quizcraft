import { getQuizById } from "@/database/quiz";
import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/quiz/play/quiz-player";
import { transformQuestion } from "@/lib/dbUtils";
import type { Quiz } from "@/types";

const QuizPlayPage = async ({ params }: { params: { id: string } }) => {
  const quizData = await getQuizById(params.id);

  if (!quizData) {
    return notFound();
  }

  const quiz: Quiz = {
    ...quizData,
    questions: quizData.questions.map(transformQuestion),
  };

  return <QuizPlayer quiz={quiz} />;
};

export default QuizPlayPage;
