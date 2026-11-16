import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight, Plus } from "lucide-react"
import { getJobs } from "@/app/api/jobs"
import { toManagedJob, type ManagedJob } from "@/lib/managed-jobs"

import { ManageJobsTable } from "@/app/components/ManageJobsTable"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Manage job posts | Huntine",
  description:
    "Review live listings, monitor applicants, and update job details across your organization.",
}

export default async function ManageJobsPage() {
  let jobs: ManagedJob[] = []
  let loadFailed = false

  try {
    const documents = await getJobs()
    jobs = documents.map(toManagedJob)
  } catch {
    loadFailed = true
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs font-medium text-[#1A1410]/45 dark:text-white/40"
          >
            <Link
              href="/dashboard/recruiter/jobs"
              className="transition-colors hover:text-brand"
            >
              Manage Jobs
            </Link>
            <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate text-[#1A1410]/65 dark:text-white/55">
              Job Listings &amp; Postings
            </span>
          </nav>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#1A1410] sm:text-3xl dark:text-white">
            Manage Job Posts
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#1A1410]/55 dark:text-white/50">
            Review live listings, monitor applicants, and update job details
            across your organization.
          </p>
        </div>

        <Button
          render={<Link href="/dashboard/recruiter/jobs/new" />}
          nativeButton={false}
          className="h-10 gap-2 self-start rounded-xl bg-brand px-4 text-sm font-semibold text-[#0A0A0A] shadow-lg shadow-brand/20 transition-colors hover:bg-brand-hover"
        >
          <Plus className="size-4" />
          New Job Post
        </Button>
      </div>

      {loadFailed ? (
        <p
          role="status"
          className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-xs font-medium text-amber-700 dark:text-amber-400"
        >
          Could not reach the jobs API. Start the backend on port 5000 and
          refresh this page.
        </p>
      ) : null}

      <ManageJobsTable jobs={jobs} />
    </div>
  )
}
