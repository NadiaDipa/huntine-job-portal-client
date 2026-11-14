import { DashboardAccessDenied } from "@/app/components/DashboardAccessDenied"
import { DashboardShell } from "@/app/components/DashboardShell"
import { getCurrentDashboardRole } from "@/lib/dashboard-role"

export default async function RecruiterDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const role = await getCurrentDashboardRole()

  if (role !== "recruiter") {
    return (
      <DashboardAccessDenied requestedRole="recruiter" currentRole={role} />
    )
  }

  return <DashboardShell>{children}</DashboardShell>
}
