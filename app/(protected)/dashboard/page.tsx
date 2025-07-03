import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowRight,
  BookCopy,
  FilePlus2,
  Gamepad2,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getQuizzesByCreatorId } from "@/database/quiz";
import { getQuizGameResultsByUserId } from "@/database/quiz-game-result";
import { auth } from "@/server/auth";

const DashboardPage = async () => {
  const session = await auth();
  const user = session?.user;

  const [userQuizzes, userGames] = await Promise.all([
    getQuizzesByCreatorId(user!.id),
    getQuizGameResultsByUserId(user!.id),
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's a summary of your activity.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button asChild>
            <Link href="/quiz/create">
              <FilePlus2 className="mr-2 h-4 w-4" /> Create Quiz
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/quiz">Browse Quizzes</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quizzes Played
            </CardTitle>
            <Gamepad2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userGames.length}</div>
            <p className="text-muted-foreground text-xs">
              Total quizzes you've completed.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Quizzes Created
            </CardTitle>
            <BookCopy className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userQuizzes.length}</div>
            <p className="text-muted-foreground text-xs">
              Total quizzes you've shared.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and My Quizzes */}
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" /> Recent Activity
            </CardTitle>
            <CardDescription>
              Your most recently played quizzes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userGames.length > 0 ? (
              <ul className="space-y-4">
                {userGames.slice(0, 5).map((game) => (
                  <li
                    key={game.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <Link
                        href={`/quiz/${game.quizId}`}
                        className="font-semibold hover:underline"
                      >
                        {game.quizTitle}
                      </Link>
                      <p className="text-muted-foreground text-sm">
                        {formatDistanceToNow(new Date(game.playedAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{game.finalScore}</p>
                      <p className="text-muted-foreground text-sm">Score</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground py-4 text-center text-sm">
                No games played yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Quizzes</CardTitle>
            <CardDescription>
              Your most recently created quizzes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userQuizzes.length > 0 ? (
              <ul className="space-y-4">
                {userQuizzes.slice(0, 5).map((quiz) => (
                  <li
                    key={quiz.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <Link
                        href={`/quiz/edit/${quiz.id}`}
                        className="font-semibold hover:underline"
                      >
                        {quiz.title}
                      </Link>
                      <p className="text-muted-foreground text-sm">
                        {quiz._count.questions} Questions &bull;{" "}
                        {quiz._count.gameResults} Plays
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/quiz/edit/${quiz.id}`}>
                        Edit <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground py-4 text-center text-sm">
                You haven't created any quizzes yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default DashboardPage;
