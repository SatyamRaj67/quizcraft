import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: { name: v.string(), email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      password: args.password,
      role: "USER", // Default role
      isTwoFactorEnabled: false,
    });
    return user;
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    return user;
  },
});

export const getUserById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    
    return user;
  },
});

export const updateUserById = mutation({
  args: {
    id: v.id("users"),
    data: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      password: v.optional(v.string()),
      emailVerified: v.optional(v.number()), // Use number for timestamps
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.patch(args.id, args.data);
    return user;
  },
});
