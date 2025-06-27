import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createTwoFactorConfirmationByUserId = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const twoFactorConfirmation = await ctx.db.insert(
      "twoFactorConfirmations",
      {
        userId: args.userId,
      },
    );
    return twoFactorConfirmation;
  },
});

export const getTwoFactorConfirmationByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const twoFactorConfirmation = await ctx.db
      .query("twoFactorConfirmations")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    return twoFactorConfirmation;
  },
});

export const deleteTwoFactorConfirmationById = mutation({
  args: { id: v.id("twoFactorConfirmations") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const deleteTwoFactorConfirmationByUserId = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const twoFactorConfirmation = await ctx.db
      .query("twoFactorConfirmations")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (twoFactorConfirmation) {
      await ctx.db.delete(twoFactorConfirmation._id);
    }
  },
});
