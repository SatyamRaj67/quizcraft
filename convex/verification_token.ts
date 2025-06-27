import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createVerificationToken = mutation({
  args: { email: v.string(), token: v.string(), expires: v.number() },
  handler: async (ctx, args) => {
    const verificationToken = await ctx.db.insert("verificationTokens", {
      email: args.email,
      token: args.token,
      expires: args.expires,
    });
    return verificationToken;
  },
});

export const getVerificationTokenByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const verificationToken = await ctx.db
      .query("verificationTokens")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    return verificationToken;
  },
});

export const getVerificationTokenByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const verificationToken = await ctx.db
      .query("verificationTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    return verificationToken;
  },
});

export const deleteVerificationTokenById = mutation({
  args: { id: v.id("verificationTokens") },
  handler: async (ctx, args) => {
    const verificationToken = await ctx.db.delete(args.id);
    return verificationToken;
  },
});
