import { LayoutDashboard, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/**
 * Only routes that exist are listed. Each later milestone adds its routes here
 * (files, shared, trash, departments, members, activity, settings) as it ships them.
 */
export const WORKSPACE_NAV: readonly NavItem[] = [{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }];
