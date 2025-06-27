import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    emailVerified: v.optional(v.number()), // Use number for timestamps
    image: v.optional(v.string()),
    password: v.optional(v.string()),
    role: v.union(v.literal("USER"), v.literal("ADMIN")),
    isTwoFactorEnabled: v.boolean(),
  }).index("by_email", ["email"]),

  accounts: defineTable({
    userId: v.id("users"),
    type: v.string(),
    provider: v.string(),
    providerAccountId: v.string(),
    refresh_token: v.optional(v.string()),
    access_token: v.optional(v.string()),
    expires_at: v.optional(v.number()),
    token_type: v.optional(v.string()),
    scope: v.optional(v.string()),
    id_token: v.optional(v.string()),
    session_state: v.optional(v.string()),
  })
    .index("by_provider", ["provider", "providerAccountId"])
    .index("by_userId", ["userId"]),

  verificationTokens: defineTable({
    email: v.string(),
    token: v.string(),
    expires: v.number(), // Use number for timestamps
  })
    .index("by_email", ["email"])
    .index("by_token", ["token"]),

  passwordResetTokens: defineTable({
    email: v.string(),
    token: v.string(),
    expires: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_token", ["token"]),

  twoFactorTokens: defineTable({
    email: v.string(),
    token: v.string(),
    expires: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_token", ["token"]),

  twoFactorConfirmations: defineTable({
    userId: v.id("users"),
  }).index("by_userId", ["userId"]),
});
