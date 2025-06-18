import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Quiz schema: stores quiz content
export const quizzes = mutation({
  args: {
    quiz: v.any(),
  },
  handler: async (ctx, args) => {
    // Upsert quiz by id
    const existing = await ctx.db
      .query("quizzes")
      .withIndex("by_quizId")
      .filter((q) => q.eq("id", args.quiz.id))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { quiz: args.quiz });
      return existing._id;
    }
    return await ctx.db.insert("quizzes", {
      id: args.quiz.id,
      quiz: args.quiz,
    });
  },
});

export const getQuizzes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("quizzes").collect();
  },
});

// User preferences schema: stores per-user preferences
export const setUserPreferences = mutation({
  args: {
    userId: v.string(),
    preferences: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("user_preferences")
      .withIndex("by_userId")
      .filter((q) => q.eq("userId", args.userId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { preferences: args.preferences });
      return existing._id;
    }
    return await ctx.db.insert("user_preferences", {
      userId: args.userId,
      preferences: args.preferences,
    });
  },
});

export const getUserPreferences = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("user_preferences")
      .withIndex("by_userId")
      .filter((q) => q.eq("userId", args.userId))
      .first();
  },
});

// Quiz attempts schema: stores user quiz attempts
export const saveQuizAttempt = mutation({
  args: {
    userId: v.string(),
    quizId: v.string(),
    attempt: v.any(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("quiz_attempts", {
      userId: args.userId,
      quizId: args.quizId,
      attempt: args.attempt,
      createdAt: Date.now(),
    });
  },
});

export const getQuizAttempts = query({
  args: { userId: v.string(), quizId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.quizId) {
      return await ctx.db
        .query("quiz_attempts")
        .withIndex("by_userId")
        .filter((q) => q.eq("userId", args.userId))
        .filter((q) => q.eq("quizId", args.quizId))
        .collect();
    } else {
      return await ctx.db
        .query("quiz_attempts")
        .withIndex("by_userId")
        .filter((q) => q.eq("userId", args.userId))
        .collect();
    }
  },
});
