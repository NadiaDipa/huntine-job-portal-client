// Shared user-role definitions for the Huntine job portal.
// Imported by the Better Auth config (server) and the sign-up form (client),
// so the allowed values never drift apart.

export const USER_ROLES = ["seeker", "recruiter", "admin"] as const

export type UserRole = (typeof USER_ROLES)[number]

export const ROLE_OPTIONS = [
  { value: "seeker", label: "Seeker" },
  { value: "recruiter", label: "Recruiter" },
  { value: "admin", label: "Admin" },
] satisfies ReadonlyArray<{ value: UserRole; label: string }>

export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === "string" &&
    (USER_ROLES as readonly string[]).includes(value)
  )
}

/**
 * Standard Schema validator for the Better Auth `role` additional field.
 * Better Auth runs this on the server, so a client cannot persist a role
 * outside the allowed list even if it bypasses the form.
 */
export const userRoleSchema = {
  "~standard": {
    version: 1 as const,
    vendor: "huntine",
    validate(value: unknown) {
      if (isUserRole(value)) {
        return { value }
      }

      return {
        issues: [
          {
            message: "Role must be one of: seeker, recruiter, admin.",
          },
        ],
      }
    },
  },
}
