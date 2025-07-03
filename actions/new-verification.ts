"use server";

import { getUserByEmail, updateUserById } from "@/database/user";
import {
  deleteVerificationTokenById,
  getVerificationTokenByToken,
} from "@/database/verification-token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "User (Email) does not exist!" };
  }

  await updateUserById(existingUser.id, {
    emailVerified: new Date(),
    email: existingToken.email,
  });

  await deleteVerificationTokenById(existingToken.id);

  return { success: "Email Verified!" };
};
