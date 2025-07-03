import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

import {
  createVerificationToken,
  deleteVerificationTokenById,
  getVerificationTokenByEmail,
} from "@/database/verification-token";
import {
  createTwoFactorToken,
  deleteTwoFactorTokenById,
  getTwoFactorTokenByEmail,
} from "@/database/two-factor-token";
import {
  createPasswordResetToken,
  deletePasswordResetTokenById,
  getPasswordResetTokenByEmail,
} from "@/database/password-reset-token";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await deleteTwoFactorTokenById(existingToken.id);
  }

  const twoFactorToken = await createTwoFactorToken({
    email,
    token,
    expires,
  });

  return twoFactorToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await deletePasswordResetTokenById(existingToken.id);
  }

  const passwordResetToken = await createPasswordResetToken({
    email,
    token,
    expires,
  });

  return passwordResetToken;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hour

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await deleteVerificationTokenById(existingToken.id);
  }

  const verificationToken = await createVerificationToken({
    email,
    token,
    expires,
  });

  return verificationToken;
};
