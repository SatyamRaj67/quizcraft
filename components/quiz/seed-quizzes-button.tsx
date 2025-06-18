import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { exampleQuizzes } from "@/.example/example-quizzes";

export default function SeedQuizzesButton() {
  const seed = useMutation(api.quizzes.quizzes);

  async function handleSeed() {
    for (const quiz of exampleQuizzes) {
      await seed({ quiz });
    }
    alert("Example quizzes seeded to Convex!");
  }

  return (
    <button
      className="bg-primary text-primary-foreground rounded px-4 py-2 mb-4"
      onClick={handleSeed}
    >
      Seed Example Quizzes
    </button>
  );
}
