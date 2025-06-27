import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

import { api } from "@/convex/_generated/api";

import { ConvexHttpClient } from "convex/browser";
import { env } from "@/env";

// Initialize a server-side client to interact with Convex
const convex = new ConvexHttpClient(env.NEXT_PUBLIC_CONVEX_URL);

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour

  const existingToken = await convex.query(
    api.two_factor_token.getTwoFactorTokenByEmail,
    {
      email,
    },
  );

  if (existingToken) {
    await convex.mutation(api.two_factor_token.deleteTwoFactorTokenById, {
      id: existingToken._id,
    });
  }

  await convex.mutation(api.two_factor_token.createTwoFactorToken, {
    email,
    token,
    expires: expires.getTime(),
  });

  return {
    email,
    token,
    expires: expires.getTime(),
  };
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour

  const existingToken = await convex.query(
    api.password_reset_token.getPasswordResetTokenByEmail,
    {
      email,
    },
  );

  if (existingToken) {
    await convex.mutation(
      api.password_reset_token.deletePasswordResetTokenById,
      { id: existingToken._id },
    );
  }

  await convex.mutation(api.password_reset_token.createPasswordResetToken, {
    email,
    token,
    expires: expires.getTime(),
  });

  return {
    email,
    token,
    expires: expires.getTime(),
  };
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60);

  const existingToken = await convex.query(
    api.verification_token.getVerificationTokenByEmail,
    {
      email,
    },
  );

  if (existingToken) {
    await convex.mutation(api.verification_token.deleteVerificationTokenById, {
      id: existingToken._id,
    });
  }

  await convex.mutation(api.verification_token.createVerificationToken, {
    email,
    token,
    expires: expires.getTime(),
  });

  return {
    email,
    token,
    expires: expires.getTime(),
  };
};
