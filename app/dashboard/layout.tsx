/**
 * Intentionally a pass-through. Each role layout performs the role check and
 * only mounts the DashboardShell after access is granted, which keeps the
 * sidebar hidden on the access-denied screen.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
