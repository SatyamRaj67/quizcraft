import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createTwoFactorToken = mutation({
  args: {
    email: v.string(),
    token: v.string(),
    expires: v.number(),
  },
  handler: async (ctx, args) => {
    const token = await ctx.db.insert("twoFactorTokens", {
      email: args.email,
      token: args.token,
      expires: args.expires,
    });

    return token;
  },
});

export const getTwoFactorTokenByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const twoFactorToken = await ctx.db
      .query("twoFactorTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    return twoFactorToken;
  },
});

export const getTwoFactorTokenByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const twoFactorToken = await ctx.db
      .query("twoFactorTokens")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    return twoFactorToken;
  },
});

export const deleteTwoFactorTokenById = mutation({
  args: { id: v.id("twoFactorTokens") },
  handler: async (ctx, args) => {
    const twoFactorToken = await ctx.db.delete(args.id);
    return twoFactorToken;
  },
});
