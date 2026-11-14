import { DashboardAccessDenied } from "@/app/components/DashboardAccessDenied"
import { DashboardShell } from "@/app/components/DashboardShell"
import { getCurrentDashboardRole } from "@/lib/dashboard-role"

export default async function SeekerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const role = await getCurrentDashboardRole()

  if (role !== "seeker") {
    return <DashboardAccessDenied requestedRole="seeker" currentRole={role} />
  }

  return <DashboardShell>{children}</DashboardShell>
}
