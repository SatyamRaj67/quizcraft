"use server";

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

export const newVerification = async (token: string) => {
  const existingToken = useQuery(
    api.verification_token.getVerificationTokenByToken,
    {
      token,
    },
  );

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = useQuery(api.user.getUserByEmail, {
    email: existingToken.email,
  });

  if (!existingUser) {
    return { error: "User (Email) does not exist!" };
  }

  const updateUserById = useMutation(api.user.updateUserById);

  await updateUserById({
    id: existingUser._id,
    data: {
      emailVerified: new Date().getTime(),
      email: existingToken.email,
    },
  });

  const deleteVerificationTokenById = useMutation(
    api.verification_token.deleteVerificationTokenById,
  );
  deleteVerificationTokenById({ id: existingToken._id });

  return { success: "Email Verified!" };
};
