import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  quizzes: defineTable({
    id: v.string(),
    quiz: v.any(),
  }).index("by_quizId", ["id"]),

  user_preferences: defineTable({
    userId: v.string(),
    preferences: v.any(),
  }).index("by_userId", ["userId"]),

  quiz_attempts: defineTable({
    userId: v.string(),
    quizId: v.string(),
    attempt: v.any(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_quizId", ["quizId"]),
});
