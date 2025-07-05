import { transformQuestion } from "@/lib/dbUtils";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import type { Question, Quiz, QuizOption } from "@/types";

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

export const createQuiz = async (quizData: Quiz, creatorId: string) => {
  const { id, title, description, difficulty, questions } = quizData;

  try {
    const newQuiz = await db.quiz.create({
      data: {
        id,
        title,
        description: description ?? "",
        difficulty: difficulty ?? "medium",
        creatorId: creatorId,
        questions: {
          create: questions.map((q: Question) => {
            const questionPayload: any = {
              id: q.id,
              type: q.type,
              text: q.text,
              subject: q.subject,
              pointsCorrect: q.pointsCorrect,
              pointsIncorrect: q.pointsIncorrect,
            };

            if (q.type === "numerical") {
              questionPayload.correctAnswer = q.correctAnswer;
            } else if (q.type === "mcq") {
              questionPayload.correctOptionId = q.correctOptionId;
              questionPayload.options = {
                create: q.options.map((opt: QuizOption) => ({
                  id: opt.id,
                  text: opt.text,
                })),
              };
            }
            return questionPayload;
          }),
        },
      },
    });
    return newQuiz;
  } catch (error) {
    console.error("Error creating quiz in database:", error);
    throw new Error("Failed to create quiz in the database.");
  }
};
