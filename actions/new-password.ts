"use server";

import { api } from "@/convex/_generated/api";
import { NewPasswordSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import * as z from "zod";

import { ConvexHttpClient } from "convex/browser";
import { env } from "@/env";

// Initialize a server-side client to interact with Convex
const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null,
) => {
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  if (!token) {
    return { error: "Missing Token!" };
  }

  const existingToken = await convex.query(
    api.password_reset_token.getPasswordResetTokenByToken,
    {
      token,
    },
  );

  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await convex.query(api.user.getUserByEmail, {
    email: existingToken.email,
  });

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await convex.mutation(api.user.updateUserById, {
    id: existingUser._id,
    data: {
      password: hashedPassword,
    },
  });

  await convex.mutation(api.password_reset_token.deletePasswordResetTokenById, {
    id: existingToken._id,
  });

  return { success: "Password Updated!" };
};
