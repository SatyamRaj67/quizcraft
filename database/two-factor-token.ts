import { db } from "@/server/db";

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token },
    });
    return twoFactorToken;
  } catch {
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email },
    });
    return twoFactorToken;
  } catch {
    return null;
  }
};

export const createTwoFactorToken = async (data: {
  email: string;
  token: string;
  expires: Date;
}) => {
  try {
    const twoFactorToken = await db.twoFactorToken.create({
      data,
    });
    return twoFactorToken;
  } catch {
    return null;
  }
};

export const deleteTwoFactorTokenById = async (id: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.delete({
      where: { id },
    });
    return twoFactorToken;
  } catch {
    return null;
  }
};
