// Role-aware navigation for the dashboard sidebar.
// Each role gets its own menu, and every item shares the same shape so the
// sidebar can render them with a single map.

import {
  Bookmark,
  BriefcaseBusiness,
  Building,
  ChartColumn,
  CreditCard,
  FileText,
  House,
  Inbox,
  LayoutDashboard,
  LifeBuoy,
  Search,
  Settings,
  SquarePlus,
  UserCog,
  Users,
  WalletCards,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import type { UserRole } from "@/lib/roles"

export type DashboardMenuItem = {
  name: string
  url: string
  icon: LucideIcon
}

export type DashboardMenuItemsByRole = Record<UserRole, DashboardMenuItem[]>

export const menuItemsByRole: DashboardMenuItemsByRole = {
  seeker: [
    {
      name: "Home",
      url: "/",
      icon: House,
    },
    {
      name: "Dashboard",
      url: "/dashboard/seeker",
      icon: LayoutDashboard,
    },
    {
      name: "Browse Jobs",
      url: "/jobs",
      icon: Search,
    },
    {
      name: "Saved Jobs",
      url: "/dashboard/seeker/saved-jobs",
      icon: Bookmark,
    },
    {
      name: "My Applications",
      url: "/dashboard/seeker/applications",
      icon: FileText,
    },
    {
      name: "Billing",
      url: "/dashboard/seeker/billing",
      icon: CreditCard,
    },
  ],

  recruiter: [
    {
      name: "Home",
      url: "/",
      icon: House,
    },
    {
      name: "Dashboard",
      url: "/dashboard/recruiter",
      icon: LayoutDashboard,
    },
    {
      name: "My Company",
      url: "/dashboard/recruiter/company",
      icon: Building,
    },
    {
      name: "Manage Jobs",
      url: "/dashboard/recruiter/jobs",
      icon: BriefcaseBusiness,
    },
    {
      name: "Add Job",
      url: "/dashboard/recruiter/jobs/new",
      icon: SquarePlus,
    },
    {
      name: "Applications",
      url: "/dashboard/recruiter/applications",
      icon: Inbox,
    },
  ],

  admin: [
    {
      name: "Home",
      url: "/",
      icon: House,
    },
    {
      name: "Dashboard",
      url: "/dashboard/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Users",
      url: "/dashboard/admin/users",
      icon: Users,
    },
    {
      name: "Recruiters",
      url: "/dashboard/admin/recruiters",
      icon: UserCog,
    },
    {
      name: "Job Posts",
      url: "/dashboard/admin/jobs",
      icon: BriefcaseBusiness,
    },
    {
      name: "Applications",
      url: "/dashboard/admin/applications",
      icon: FileText,
    },
    {
      name: "Companies",
      url: "/dashboard/admin/companies",
      icon: Building,
    },
    {
      name: "Reports",
      url: "/dashboard/admin/reports",
      icon: ChartColumn,
    },
    {
      name: "Payments",
      url: "/dashboard/admin/payments",
      icon: WalletCards,
    },
  ],
}

// Shared links shown under the role-specific menu.
export const accountMenuItems: DashboardMenuItem[] = [
  {
    name: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
  {
    name: "Help & Support",
    url: "/support",
    icon: LifeBuoy,
  },
]
