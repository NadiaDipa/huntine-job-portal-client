import Link from "next/link"
import { ArrowLeft, BriefcaseBusiness, TriangleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

export function JobPageState({
  variant,
  message,
}: {
  variant: "missing" | "error"
  message?: string
}) {
  const isMissing = variant === "missing"
  const Icon = isMissing ? BriefcaseBusiness : TriangleAlert

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link
        href="/dashboard/recruiter/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A1410]/50 transition-colors hover:text-brand dark:text-white/40 dark:hover:text-brand"
      >
        <ArrowLeft className="size-3.5" />
        Back to manage jobs
      </Link>

      <div className="mt-6 flex flex-col items-center rounded-3xl border border-black/5 bg-white px-6 py-16 text-center shadow-[0_1px_2px_rgba(16,10,6,0.04),0_16px_40px_-32px_rgba(16,10,6,0.5)] dark:border-white/10 dark:bg-white/[0.04]">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20">
          <Icon className="size-6" />
        </span>

        <h1 className="mt-5 text-xl font-extrabold tracking-tight text-[#1A1410] dark:text-white">
          {isMissing ? "Job not found" : "Could not load this job"}
        </h1>
        <p className="mt-2 max-w-md text-sm leading-6 text-[#1A1410]/55 dark:text-white/50">
          {message ??
            (isMissing
              ? "This job post may have been deleted, or the link is incorrect."
              : "The jobs API could not be reached. Make sure the backend is running and try again.")}
        </p>

        <Button
          render={<Link href="/dashboard/recruiter/jobs" />}
          nativeButton={false}
          className="mt-6 h-10 gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-[#0A0A0A] shadow-lg shadow-brand/20 transition-colors hover:bg-brand-hover"
        >
          <ArrowLeft className="size-4" />
          Back to Manage Jobs
        </Button>
      </div>
    </div>
  )
}
