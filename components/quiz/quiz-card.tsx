import Link from "next/link";
import { BookOpen, Users, BrainCircuit } from "lucide-react";

type QuizCardProps = {
  quiz: {
    id: string;
    title: string;
    description: string;
    creator: { name: string | null } | null;
    questions: { id: string; subject: string | null }[];
    _count: { gameResults: number };
  };
};

const getUniqueSubjects = (questions: { subject: string | null }[]) => {
  const subjects = questions
    .map((q) => q.subject)
    .filter((s): s is string => s !== null);
  return [...new Set(subjects)].slice(0, 3); 
};

export const QuizCard = ({ quiz }: QuizCardProps) => {
  const uniqueSubjects = getUniqueSubjects(quiz.questions);

  return (
    <Link
      href={`/quiz/${quiz.id}/preview`}
      className="bg-card border-border group block overflow-hidden rounded-lg border shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-md"
    >
      <div className="p-6">
        <h3 className="text-card-foreground group-hover:text-primary mb-2 text-xl font-bold transition-colors">
          {quiz.title}
        </h3>
        <p className="text-muted-foreground mb-4 h-10 overflow-hidden text-sm">
          {quiz.description}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {uniqueSubjects.map((subject) => (
            <span
              key={subject}
              className="bg-secondary text-secondary-foreground rounded-full px-2.5 py-0.5 text-xs font-medium"
            >
              {subject}
            </span>
          ))}
        </div>

        <div className="border-border text-muted-foreground border-t pt-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{quiz.questions.length} Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Played {quiz._count.gameResults} times</span>
            </div>
          </div>
          {quiz.creator?.name && (
            <div className="mt-3 flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              <span>By {quiz.creator.name}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
