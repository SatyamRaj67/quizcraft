import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({  questions: defineTable({
    category: v.string(),
    correctAnswer: v.string(),
    explanation: v.string(),
    imageURL: v.optional(v.string()),
    options: v.array(v.object({ optionId: v.string(), text: v.string() })),
    points: v.float64(),
    questionId: v.string(),
    questionText: v.string(),
    questionType: v.literal("multiple-choice"),
    quizId: v.id("quizzes"),
  }),  quizAttempts: defineTable({
    answers: v.array(
      v.object({
        isCorrect: v.boolean(),
        questionId: v.string(),
        selectedAnswer: v.string(),
      }),
    ),
    completedAt: v.float64(),
    quizId: v.id("quizzes"),
    score: v.float64(),
    timeSpent: v.float64(),
    totalQuestions: v.float64(),
  }),
  quizzes: defineTable({
    category: v.string(),
    createdAt: v.float64(),
    difficulty: v.string(),
    passingScorePercentage: v.float64(),
    quizDescription: v.string(),
    quizTitle: v.string(),
    tags: v.array(v.string()),
    timeLimitMinutes: v.float64(),
  }),
});
