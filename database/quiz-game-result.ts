import { db } from "@/server/db";

export const getQuizGameResultsByUserId = async (userId: string) => {
  try {
    return await db.gameResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        quizTitle: true,
        finalScore: true,
        playedAt: true,
        quizId: true,
      },
    });
  } catch (error) {
    console.error("Error fetching quiz game results by user ID:", error);
    return [];
  }
};
