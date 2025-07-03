import { getQuizById } from "@/database/quiz";
import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/quiz/quiz-player";
import { QuizSidebar } from "@/components/quiz/sidebar/quiz-sidebar";

const QuizPlayPage = async ({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) => {
  const { id } = await params;
  const quiz = await getQuizById(id);

  if (!quiz) {
    notFound();
  }

  return (
    <div className="flex h-full w-full">
      <main className="flex-1 p-4">
        <QuizPlayer quiz={quiz} />
      </main>
      <QuizSidebar />
    </div>
  );
};

export default QuizPlayPage;
