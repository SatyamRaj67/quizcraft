import { getQuizById } from "@/database/quiz";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Clock, HelpCircle, Layers } from "lucide-react";
import { QuizStartCard } from "@/components/quiz/quiz-start-card";

const QuizPreparePage = async ({
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
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="space-y-6">
          <Badge variant="outline" className="text-sm">
            {quiz.difficulty}
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {quiz.title}
          </h1>
          <p className="text-muted-foreground text-lg">{quiz.description}</p>

          <div className="bg-card text-card-foreground space-y-4 rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <HelpCircle className="text-primary h-5 w-5" />
              <span className="font-semibold">
                {quiz.questions.length} Questions
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Layers className="text-primary h-5 w-5" />
              <span className="font-semibold">
                {quiz.questions.reduce((acc, q) => acc + q.pointsCorrect, 0)}{" "}
                Total Points
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-primary h-5 w-5" />
              <span className="font-semibold">Estimated 15 minutes</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <QuizStartCard quizId={quiz.id} />
        </div>
      </div>
    </main>
  );
};

export default QuizPreparePage;
