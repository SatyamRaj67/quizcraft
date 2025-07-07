import { transformQuestion } from "@/lib/dbUtils";
import { db } from "@/server/db";
import type { Question, Quiz, QuizOption } from "@/types";

export const getQuizById = async (quizId: string) => {
  try {
    const quizData = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!quizData) {
      return null;
    }

    const quiz: Quiz = {
      ...quizData,
      questions: quizData!.questions.map(transformQuestion),
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

export const createQuiz = async (quizData: Quiz, creatorId: string) => {
  const { title, description, difficulty, questions } = quizData;

  try {
    const newQuiz = await db.quiz.create({
      data: {
        title,
        description: description ?? "",
        difficulty: difficulty ?? "medium",
        creatorId: creatorId,
        questions: {
          create: questions.map((question) => ({
            type: question.type,
            text: question.text,
            subject: question.subject,
            pointsCorrect: question.pointsCorrect,
            pointsIncorrect: question.pointsIncorrect,
            correctAnswer:
              question.type === "numerical" ? question.correctAnswer : null,
            correctOptionId:
              question.type === "mcq" ? question.correctOptionId : null,
            options:
              question.type === "mcq" && question.options
                ? {
                    create: question.options.map((option) => ({
                      text: option.text,
                    })),
                  }
                : undefined,
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    return newQuiz;
  } catch (error) {
    console.error("Error creating quiz in database:", error);
    throw new Error("Failed to create quiz in the database.");
  }
};
