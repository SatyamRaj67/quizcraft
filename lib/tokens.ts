import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour

  const existingToken = useQuery(
    api.two_factor_token.getTwoFactorTokenByEmail,
    {
      email,
    },
  );

  if (existingToken) {
    const deleteTwoFactorTokenById = useMutation(
      api.two_factor_token.deleteTwoFactorTokenById,
    );

    await deleteTwoFactorTokenById({ id: existingToken._id });
  }

  const createTwoFactorToken = useMutation(
    api.two_factor_token.createTwoFactorToken,
  );

  await createTwoFactorToken({
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

  const existingToken = useQuery(
    api.password_reset_token.getPasswordResetTokenByEmail,
    {
      email,
    },
  );

  if (existingToken) {
    const deletePasswordResetTokenById = useMutation(
      api.password_reset_token.deletePasswordResetTokenById,
    );

    deletePasswordResetTokenById({ id: existingToken._id });
  }

  const createPasswordResetToken = useMutation(
    api.password_reset_token.createPasswordResetToken,
  );
  const passwordResetToken = await createPasswordResetToken({
    email,
    token,
    expires: expires.getTime(),
  });

  return passwordResetToken;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60);

  const existingToken = useQuery(
    api.verification_token.getVerificationTokenByEmail,
    {
      email,
    },
  );

  if (existingToken) {
    const deleteVerificationTokenById = useMutation(
      api.verification_token.deleteVerificationTokenById,
    );
    await deleteVerificationTokenById({ id: existingToken._id });
  }

  const createVerificationToken = useMutation(
    api.verification_token.createVerificationToken,
  );

  await createVerificationToken({
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
