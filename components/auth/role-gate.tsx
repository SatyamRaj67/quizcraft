"use client";

import { useCurrentRole } from "@/hooks/useCurrentRole";
import { FormError } from "@/components/form-error";
import type { UserRole } from "@/types";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole;
  warning?: boolean;
}

export const RoleGate = ({
  children,
  allowedRoles,
  warning,
}: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== allowedRoles) {
    if (warning) {
      return (
        <FormError message="You do not have permission to view this content!" />
      );
    }
    return;
  }

  return <>{children}</>;
};
