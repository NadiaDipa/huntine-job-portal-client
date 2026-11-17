
import { cache } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  BadgeCheck,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  Laptop,
  MapPin,
  Send,
  type LucideIcon,
} from "lucide-react"

import { getJobById } from "@/app/api/jobs"
import { CompanyMark } from "@/app/components/job-details/CompanyMark"
import { JobDetailsSidebar } from "@/app/components/job-details/JobDetailsSidebar"
import { JobDetailsTabs } from "@/app/components/job-details/JobDetailsTabs"
import { Button } from "@/components/ui/button"
import { getDemoJobById } from "@/lib/demo-jobs"
import { toJobDetail, type JobDetail } from "@/lib/job-detail"
import ApplyNowButton from "@/app/components/job-details/ApplyNowButton"


type JobDetailsPageProps = {
  params: Promise<{ id: string }>
}

/**
 * The API is the source of truth. The local design-preview records are only
 * used when an id is not present in the database, so the page still renders
 * without a running backend.
 */
const resolveJob = cache(async (id: string): Promise<JobDetail | null> => {
  try {
    const document = await getJobById(id)
    if (document) return toJobDetail(document)
  } catch {
    // The jobs API is unreachable; fall through to the local preview.
  }

  return getDemoJobById(id)
})

export async function generateMetadata({
  params,
}: JobDetailsPageProps): Promise<Metadata> {
  const { id } = await params
  const job = await resolveJob(id)

  if (!job) {
    return {
      title: "Job not found | Huntine",
      description: "This job post could not be found on Huntine.",
    }
  }

  return {
    title: `${job.title} at ${job.company.name} | Huntine`,
    description: `Explore the ${job.title} role at ${job.company.name}: requirements, responsibilities, company details, salary and benefits.`,
  }
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params
  const job = await resolveJob(id);


  if (!job) {
    notFound()
  }


  return (
    <main className="min-h-svh bg-[#FAF7F2] pb-16 dark:bg-[#0A0908]">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <Link
          href="/browse-jobs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1A1410]/55 transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none dark:text-white/50 dark:hover:text-brand"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Browse Jobs
        </Link>

        <section className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <CompanyMark initials={job.company.initials} size="large" />

            <div className="min-w-0 pt-0.5">
              <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-[11px] font-semibold text-[#1A1410] ring-1 ring-brand/25 dark:text-white dark:ring-brand/30">
                {job.employmentType}
              </span>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#1A1410] sm:text-4xl dark:text-white">
                {job.title}
              </h1>

              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-sm">
                <span className="font-semibold text-[#1A1410]/75 dark:text-white/80">
                  {job.company.name}
                </span>
                {job.company.verified && (
                  <BadgeCheck
                    className="size-4 text-brand"
                    aria-label="Verified company"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Button
              type="button"
              variant="outline"
              aria-label="Save job"
              title="Save job"
              className="size-11 shrink-0 rounded-xl border-black/10 bg-white text-[#1A1410]/60 shadow-none transition-colors hover:border-brand/40 hover:bg-white hover:text-brand dark:border-white/10 dark:bg-white/[0.04] dark:text-white/60 dark:hover:border-brand/40 dark:hover:bg-white/[0.06] dark:hover:text-brand"
            >
              <Bookmark className="size-5" aria-hidden="true" />
            </Button>

          
            <ApplyNowButton jobId={id}/>

          </div>
        </section>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-[13px] text-[#1A1410]/60 sm:text-sm dark:text-white/55">
          <MetaItem icon={MapPin}>{job.location}</MetaItem>
          {job.experience && (
            <MetaItem icon={BriefcaseBusiness}>{job.experience}</MetaItem>
          )}
          <MetaItem icon={Laptop}>{job.remote}</MetaItem>
          {job.applyBy && (
            <MetaItem icon={CalendarDays}>Apply by: {job.applyBy}</MetaItem>
          )}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-start xl:gap-8">
          <JobDetailsTabs key={job.id} job={job} />
          <JobDetailsSidebar job={job} />
        </div>
      </div>
    </main>
  )
}

function MetaItem({
  icon: Icon,
  children,
}: {
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="size-4 shrink-0 text-brand" aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}
