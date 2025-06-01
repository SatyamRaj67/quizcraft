import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get all quizzes
export const getAllQuizzes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quizzes").collect();
  },
});

// Get a specific quiz with its questions
export const getQuizById = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) return null;

    const questions = await ctx.db
      .query("questions")
      .filter((q) => q.eq(q.field("quizId"), args.quizId))
      .collect();

    return {
      ...quiz,
      questions,
    };
  },
});

// Create a new quiz
export const createQuiz = mutation({
  args: {
    quizTitle: v.string(),
    quizDescription: v.string(),
    difficulty: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    timeLimitMinutes: v.float64(),
    passingScorePercentage: v.float64(),
  },
  handler: async (ctx, args) => {
    const quizId = await ctx.db.insert("quizzes", {
      ...args,
      createdAt: Date.now(),
    });
    return quizId;
  },
});

// Submit quiz attempt
export const submitQuizAttempt = mutation({
  args: {
    quizId: v.id("quizzes"),
    answers: v.array(
      v.object({
        questionId: v.string(),
        selectedAnswer: v.string(),
        isCorrect: v.boolean(),
      })
    ),
    score: v.float64(),
    timeSpent: v.float64(),
    totalQuestions: v.float64(),
  },
  handler: async (ctx, args) => {
    const attemptId = await ctx.db.insert("quizAttempts", {
      ...args,
      completedAt: Date.now(),
    });
    return attemptId;
  },
});

// Get quiz attempts for a specific quiz
export const getQuizAttempts = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quizAttempts")
      .filter((q) => q.eq(q.field("quizId"), args.quizId))
      .order("desc")
      .collect();
  },
});
