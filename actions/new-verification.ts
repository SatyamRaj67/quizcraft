"use server";

import { api } from "@/convex/_generated/api";

import { ConvexHttpClient } from "convex/browser";
import { env } from "@/env";

// Initialize a server-side client to interact with Convex
const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);

export const newVerification = async (token: string) => {
  const existingToken = await convex.query(
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

  const existingUser = await convex.query(api.user.getUserByEmail, {
    email: existingToken.email,
  });

  if (!existingUser) {
    return { error: "User (Email) does not exist!" };
  }

  await convex.mutation(api.user.updateUserById, {
    id: existingUser._id,
    data: {
      emailVerified: new Date().getTime(),
      email: existingToken.email,
    },
  });

  await convex.mutation(api.verification_token.deleteVerificationTokenById, {
    id: existingToken._id,
  });

  return { success: "Email Verified!" };
};
