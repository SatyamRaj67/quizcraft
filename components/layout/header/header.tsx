"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/layout/providers/theme-toggle";
import { usePathname } from "next/navigation";

function getBreadcrumbs(pathname: string) {
  if (!pathname || pathname === "/") {
    return [{ name: "Home", href: "/", isCurrent: true }];
  }
  const segments = pathname.replace(/^\/|\/$/g, "").split("/");
  const crumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    return {
      name: seg.charAt(0).toUpperCase() + seg.slice(1),
      href,
      isCurrent: idx === segments.length - 1,
    };
  });
  return [{ name: "Home", href: "/", isCurrent: false }, ...crumbs];
}

const Header = () => {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 flex h-12 shrink-0 items-center gap-2 border-b backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.href}>
                <BreadcrumbItem>
                  {crumb.isCurrent ? (
                    <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href}>
                      {crumb.name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {idx < breadcrumbs.length - 1 ? <BreadcrumbSeparator /> : null}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          {/* User avatar placeholder */}
          <div className="from-primary to-secondary flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-gradient-to-tr font-semibold text-white shadow">
            U
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
