"use server";

import { api } from "@/convex/_generated/api";
import { NewPasswordSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { useMutation, useQuery } from "convex/react";
import * as z from "zod";

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

  const existingToken = useQuery(
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

  const existingUser = useQuery(api.user.getUserByEmail, {
    email: existingToken.email,
  });

  if (!existingUser) {
    return { error: "Email does not exist!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const updateUserById = useMutation(api.user.updateUserById);
  await updateUserById({
    id: existingUser._id,
    data: {
      password: hashedPassword,
    },
  });

  const deletePasswordResetTokenById = useMutation(
    api.password_reset_token.deletePasswordResetTokenById,
  );

  deletePasswordResetTokenById({ id: existingToken._id });

  return { success: "Password Updated!" };
};
