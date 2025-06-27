"use server";

import { api } from "@/convex/_generated/api";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas";
import * as z from "zod";

import { ConvexHttpClient } from "convex/browser";
import { env } from "@/env";

// Initialize a server-side client to interact with Convex
const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Email!" };
  }

  const { email } = validatedFields.data;

  const exisitingUser = await convex.query(api.user.getUserByEmail, {
    email,
  });

  if (!exisitingUser) {
    return { error: "Email Not Found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token,
  );

  return { success: "Password Reset Email Sent!" };
};
