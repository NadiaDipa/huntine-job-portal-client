import { DashboardAccessDenied } from "@/app/components/DashboardAccessDenied"
import { DashboardShell } from "@/app/components/DashboardShell"
import { getCurrentDashboardRole } from "@/lib/dashboard-role"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const role = await getCurrentDashboardRole()

  if (role !== "admin") {
    return <DashboardAccessDenied requestedRole="admin" currentRole={role} />
  }

  return <DashboardShell>{children}</DashboardShell>
}
