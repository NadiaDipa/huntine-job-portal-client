import Link from "next/link"
import { ArrowRight, ShieldX } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { ROLE_OPTIONS, type UserRole } from "@/lib/roles"
import { cn } from "@/lib/utils"

type DashboardAccessDeniedProps = {
  requestedRole: UserRole
  currentRole: UserRole
}

function getRoleLabel(role: UserRole) {
  return ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role
}

export function DashboardAccessDenied({
  requestedRole,
  currentRole,
}: DashboardAccessDeniedProps) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#FAF7F2] px-4 py-10 dark:bg-[#0B0705]">
      <div
        role="alert"
        className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-white/5"
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand/15 text-brand ring-1 ring-brand/25">
          <ShieldX className="size-7" />
        </span>

        <h2 className="mt-5 text-xl font-bold tracking-tight text-[#1A1410] dark:text-white">
          Access denied
        </h2>

        <p className="mt-2 text-sm leading-6 text-black/60 dark:text-white/60">
          You&apos;re signed in as a{" "}
          <span className="font-semibold text-[#1A1410] dark:text-white">
            {getRoleLabel(currentRole)}
          </span>
          . The{" "}
          <span className="font-semibold text-[#1A1410] dark:text-white">
            {getRoleLabel(requestedRole)}
          </span>{" "}
          dashboard isn&apos;t available for your role.
        </p>

        <Link
          href={`/dashboard/${currentRole}`}
          className={cn(
            buttonVariants(),
            "mt-6 h-11 gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-[#0A0A0A] shadow-lg shadow-brand/20 transition-colors hover:bg-brand-hover",
          )}
        >
          Go to my dashboard
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}
