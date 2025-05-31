// filepath: c:\Users\HP\Documents\VSC\Next\quizcraft\src\server\api\routers\quiz.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { QuizSchema } from "@/schema";

// Mock data - replace with your actual data source
const mockQuiz = {
  quizTitle: "General Knowledge Challenge",
  quizDescription:
    "A fun quiz to test your general knowledge on various topics.",
  difficulty: "Medium",
  category: "General Knowledge",
  tags: ["Trivia", "Fun", "Education", "Mixed"],
  timeLimitMinutes: 20,
  passingScorePercentage: 70,
  questions: [
    {
      id: "GK001",
      questionText: "What is the capital city of France?",
      questionType: "multiple-choice" as const,
      points: 10,
      options: [
        { optionId: "A", text: "Berlin" },
        { optionId: "B", text: "Madrid" },
        { optionId: "C", text: "Paris" },
        { optionId: "D", text: "Rome" },
      ],
      correctAnswer: "C",
      explanation: "Paris is the capital and most populous city of France.",
    },
  ],
};

export const quizRouter = createTRPCRouter({
  getQuiz: publicProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(({ input }) => {
      return QuizSchema.parse(mockQuiz);
    }),

  submitAnswer: publicProcedure
    .input(
      z.object({
        questionId: z.string(),
        answer: z.union([z.string(), z.array(z.string())]),
      }),
    )
    .mutation(({ input }) => {
      // Logic to check answer and return result
      return {
        correct: true,
        explanation: "Great job!",
        points: 10,
      };
    }),
});
