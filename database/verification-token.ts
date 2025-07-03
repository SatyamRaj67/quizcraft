import { db } from "@/server/db";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const createVerificationToken = async (data: {
  email: string;
  token: string;
  expires: Date;
}) => {
  try {
    const verificationToken = await db.verificationToken.create({
      data,
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const deleteVerificationTokenById = async (id: string) => {
  try {
    const verificationToken = await db.verificationToken.delete({
      where: { id },
    });

    return verificationToken;
  } catch {
    return null;
  }
};
