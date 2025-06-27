"use server";

import { currentRole } from "@/lib/auth";
import { UserRoleEnum } from "@/types";

export const admin = async () => {
  const role = await currentRole();

  if (role !== UserRoleEnum.ADMIN) {
    return { error: "Forbidden Server Action!" };
  }

  return { success: "Allowed Server Action!" };
};
