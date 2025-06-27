import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createPasswordResetToken = mutation({
  args: {
    email: v.string(),
    token: v.string(),
    expires: v.number(),
  },
  handler: async (ctx, args) => {
    const token = await ctx.db.insert("passwordResetTokens", {
      email: args.email,
      token: args.token,
      expires: args.expires,
    });

    return token;
  },
});

export const getPasswordResetTokenByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const token = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    return token;
  },
});

export const getPasswordResetTokenByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const token = await ctx.db
      .query("passwordResetTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    return token;
  },
});

export const deletePasswordResetTokenById = mutation({
  args: { id: v.id("passwordResetTokens") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
