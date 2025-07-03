import { db } from "@/server/db";

export const createPasswordResetToken = async (data: {
  email: string;
  token: string;
  expires: Date;
}) => {
  try {
    const passwordResetToken = await db.passwordResetToken.create({
      data,
    });
    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { email },
    });
    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const deletePasswordResetTokenById = async (id: string) => {
  try {
    const deletedToken = await db.passwordResetToken.delete({
      where: { id },
    });
    return deletedToken;
  } catch {
    return null;
  }
};
