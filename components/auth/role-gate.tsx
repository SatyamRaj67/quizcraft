"use client";

import { useCurrentRole } from "@/hooks/useCurrentRole";
import { FormError } from "@/components/form-error";
import type { UserRole } from "@/types";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole;
}

export const RoleGate = ({ children, allowedRoles }: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRoles) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }

  return <>{children}</>;
};
