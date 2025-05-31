"use client";

import * as React from "react";

import { TbInnerShadowTop } from "react-icons/tb";

import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";
import { navData } from "@/constants";
import { NavMain } from "./nav-main";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

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
                <TbInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">SmartStock</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navData.main} />
      </SidebarContent>
    </Sidebar>
  );
}
