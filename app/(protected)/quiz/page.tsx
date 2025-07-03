import { getAllPublicQuizzes } from "@/database/quiz";
import { QuizCard } from "@/components/quiz/quiz-card";
import { FileQuestion } from "lucide-react";

const QuizPage = async () => {
  const quizzes = await getAllPublicQuizzes();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-4xl font-extrabold tracking-tight">
        Public Quizzes
      </h1>
      <p className="text-muted-foreground mb-8">
        Challenge yourself with a quiz from our community.
      </p>

      {quizzes.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      ) : (
        <div className="bg-card border-border flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
          <FileQuestion className="text-muted-foreground mb-4 h-16 w-16" />
          <h2 className="text-card-foreground text-2xl font-semibold">
            No Quizzes Found
          </h2>
          <p className="text-muted-foreground mt-2">
            There are no public quizzes available at the moment.
          </p>
        </div>
      )}
    </main>
  );
};

export default QuizPage;
