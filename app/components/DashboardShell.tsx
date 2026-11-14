import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DashboardSidebar } from "./DashboardSidebar"

/**
 * Shared dashboard chrome. Only rendered after a role check succeeds, so the
 * access-denied screen never shows the sidebar or dashboard header.
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />

      <SidebarInset className="min-h-svh bg-[#FAF7F2] dark:bg-[#0B0705]">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-black/5 px-3 sm:px-4 dark:border-white/10">
          <SidebarTrigger className="-ml-1 text-[#1A1410] hover:bg-black/5 dark:text-white dark:hover:bg-white/10" />
          <span className="h-4 w-px bg-black/10 dark:bg-white/10" />
          <p className="text-sm font-semibold text-[#1A1410] dark:text-white">
            Dashboard
          </p>
        </header>

        <div className="flex-1 p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
