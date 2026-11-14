"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BriefcaseBusiness, LoaderCircle, LogOut } from "lucide-react"
import { toast } from "sonner"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipProvider } from "@/components/ui/tooltip"
import { authClient, useSession } from "@/lib/auth-client"
import { isUserRole, ROLE_OPTIONS, type UserRole } from "@/lib/roles"
import { cn } from "@/lib/utils"
import {
  accountMenuItems,
  menuItemsByRole,
  type DashboardMenuItem,
} from "./dashboard-menu-items"

// Only the role root should match exactly; the rest of the dashboard routes
// are nested below it and would otherwise keep the "Dashboard" item active.
function isActivePath(pathname: string, url: string) {
  if (/^\/dashboard\/[^/]+$/.test(url)) {
    return pathname === url
  }

  return pathname === url || pathname.startsWith(`${url}/`)
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "H"
  )
}

const menuButtonClassName =
  "relative h-10 gap-3 rounded-xl px-3 text-[13px] font-medium text-white/65 transition-colors duration-150 hover:bg-white/10 hover:text-white data-active:bg-brand/15 data-active:text-brand data-active:before:opacity-100 before:absolute before:top-1/2 before:left-0 before:h-4 before:w-0.5 before:-translate-y-1/2 before:rounded-full before:bg-brand before:opacity-0 before:transition-opacity [&_svg]:size-[18px]"

function MenuList({ items }: { items: DashboardMenuItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarMenu className="gap-1">
      {items.map((item) => (
        <SidebarMenuItem key={item.name}>
          <SidebarMenuButton
            render={<Link href={item.url} />}
            isActive={isActivePath(pathname, item.url)}
            tooltip={item.name}
            className={menuButtonClassName}
          >
            <item.icon />
            <span>{item.name}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export function DashboardSidebar() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const role: UserRole = isUserRole(session?.user?.role)
    ? session.user.role
    : "seeker"

  const roleLabel =
    ROLE_OPTIONS.find((option) => option.value === role)?.label ?? "Seeker"
  const displayName = session?.user?.name?.trim() || "Huntine Member"
  const initials = getInitials(displayName)

  async function handleSignOut() {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully!")
            router.replace("/sign-in")
            router.refresh()
          },
          onError: () => {
            toast.error("Unable to sign out. Please try again.")
          },
        },
      })
    } catch {
      toast.error("Unable to sign out. Please try again.")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <TooltipProvider delay={0}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border p-2">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl p-1 outline-none ring-sidebar-ring group-data-[collapsible=icon]:p-0 focus-visible:ring-2"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand text-black shadow-lg shadow-brand/20 group-data-[collapsible=icon]:size-8">
              <BriefcaseBusiness className="size-[18px]" />
            </span>

            <span className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
              <span className="flex items-baseline text-lg leading-none font-extrabold tracking-tight text-white">
                HUNT
                <span className="font-medium text-brand">ine</span>
              </span>
              <span className="mt-1.5 text-[10px] font-medium tracking-[0.2em] text-white/40 uppercase">
                {roleLabel} workspace
              </span>
            </span>
          </Link>
        </SidebarHeader>

        <SidebarContent className="py-2">
          <SidebarGroup className="p-2">
            <SidebarGroupLabel className="h-7 px-3 text-[10px] font-semibold tracking-[0.2em] text-white/35 uppercase">
              Main menu
            </SidebarGroupLabel>

            <SidebarGroupContent>
              {isPending ? (
                <SidebarMenu className="gap-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <div className="flex h-10 items-center gap-3 rounded-xl px-3">
                        <Skeleton className="size-[18px] shrink-0 rounded-md bg-white/10" />
                        <Skeleton className="h-3.5 w-28 rounded-full bg-white/10" />
                      </div>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              ) : (
                <MenuList items={menuItemsByRole[role]} />
              )}
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-auto p-2">
            <SidebarGroupLabel className="h-7 px-3 text-[10px] font-semibold tracking-[0.2em] text-white/35 uppercase">
              Account
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <MenuList items={accountMenuItems} />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-2">
          <div
            className={cn(
              "flex items-center gap-3 rounded-2xl bg-white/5 p-2 ring-1 ring-white/10",
              "group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:ring-0",
            )}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-sm font-bold text-brand ring-1 ring-brand/25 group-data-[collapsible=icon]:size-8">
              {isPending ? "…" : initials}
            </span>

            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-[13px] font-semibold text-white">
                {isPending ? "Loading…" : displayName}
              </p>
              <p className="truncate text-[10px] font-medium tracking-[0.16em] text-white/40 uppercase">
                {roleLabel}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            aria-label="Sign out"
            className="mt-1 flex h-9 w-full items-center gap-2.5 rounded-xl px-3 text-[13px] font-medium text-white/50 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:pointer-events-none disabled:opacity-60 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          >
            {isLoggingOut ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : (
              <LogOut className="size-4" />
            )}

            <span className="group-data-[collapsible=icon]:hidden">
              {isLoggingOut ? "Signing out..." : "Sign out"}
            </span>
          </button>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  )
}
