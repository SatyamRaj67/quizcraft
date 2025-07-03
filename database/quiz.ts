import { transformQuestion } from "@/lib/dbUtils";
import { db } from "@/server/db";
import type { Quiz } from "@/types";

export const getQuizById = async (quizId: string) => {
  try {
    const dbQuiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!dbQuiz) return null;

    const quiz: Quiz = {
      id: dbQuiz.id,
      title: dbQuiz.title,
      description: dbQuiz.description,
      questions: dbQuiz.questions.map(transformQuestion),
    };

    return quiz;
  } catch (error) {
    console.error("Error fetching quiz by ID:", error);
    return null;
  }
};

export const getAllPublicQuizzes = async () => {
  try {
    const dbQuizzes = await db.quiz.findMany({
      where: { isPublic: true },
      include: {
        questions: {
          select: { id: true, subject: true },
        },
        creator: {
          select: {
            name: true,
          },
        },
        _count: {
          select: { gameResults: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return dbQuizzes;
  } catch (error) {
    console.error("Error fetching public quizzes:", error);
    return [];
  }
};

export const getQuizzesByCreatorId = async (creatorId: string) => {
  try {
    const dbQuizzes = await db.quiz.findMany({
      where: { creatorId },
      include: {
        _count: {
          select: { gameResults: true, questions: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return dbQuizzes;
  } catch (error) {
    console.error("Error fetching quizzes by creator ID:", error);
    return [];
  }
};
