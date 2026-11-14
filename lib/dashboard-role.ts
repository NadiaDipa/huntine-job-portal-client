import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { isUserRole, type UserRole } from "@/lib/roles"

/**
 * Reads the signed-in user's role on the server.
 * Guests are sent to sign-in, and unknown roles fall back to "seeker".
 */
export async function getCurrentDashboardRole(): Promise<UserRole> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  return isUserRole(session.user.role) ? session.user.role : "seeker"
}
