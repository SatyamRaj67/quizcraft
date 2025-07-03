import { db } from "@/server/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });
    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });
    return user;
  } catch {
    return null;
  }
};

export const createUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const user = await db.user.create({
      data,
    });
    return user;
  } catch {
    return null;
  }
};

export const updateUserById = async (
  id: string,
  data: Partial<{
    name: string;
    email: string;
    password: string;
    emailVerified: Date;
  }>,
) => {
  try {
    const user = await db.user.update({
      where: { id },
      data,
    });
    return user;
  } catch {
    return null;
  }
};
