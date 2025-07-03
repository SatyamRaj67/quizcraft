"use client";

import * as React from "react";

import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { NavMain } from "@/components/layout/sidebar/nav-main";
import { NavSecondary } from "@/components/layout/sidebar/nav-secondary";
import { NavUser } from "@/components/layout/sidebar/nav-user";
import { NavAdmin } from "@/components/layout/sidebar/nav-admin";

import { useCurrentUser } from "@/hooks/useCurrentUser";

import { navData } from "@/constants";
import { RoleGate } from "@/components/auth/role-gate";
import { usePathname } from "next/navigation";
import { UserRole } from "@/types";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useCurrentUser();

  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const LogoIcon = navData.brand.logo;

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              onClick={handleLinkClick}
              isActive={pathname === "/"}
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <LogoIcon className="!size-5" />
                <span className="text-base font-semibold">
                  {navData.brand.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.navMain} />
        <RoleGate allowedRoles={UserRole.ADMIN}>
          <NavAdmin items={navData.navAdmin} />
        </RoleGate>

        <NavSecondary items={navData.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
