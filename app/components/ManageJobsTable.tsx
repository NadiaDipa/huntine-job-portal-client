"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, MapPin, Pencil, Plus, Users } from "lucide-react"

import { DeleteJobDialog } from "@/app/components/DeleteJobDialog"
import { Button } from "@/components/ui/button"
import type { JobPostStatus, ManagedJob } from "@/lib/managed-jobs"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Formatting helpers                                                        */
/* -------------------------------------------------------------------------- */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  BDT: "৳",
  INR: "₹",
}

const JOB_TYPE_LABELS: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
}

const DEFAULT_SALARY_SYMBOL = "৳"

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    value
  )
}

function formatJobType(jobType: string) {
  return (
    JOB_TYPE_LABELS[jobType.toLowerCase()] ??
    jobType.charAt(0).toUpperCase() + jobType.slice(1)
  )
}

function formatCompensation(job: ManagedJob) {
  if (job.compensation) {
    const { currency, min, max, frequency } = job.compensation
    const symbol = CURRENCY_SYMBOLS[currency] ?? currency
    const range =
      min === max
        ? `${symbol}${formatAmount(min)}`
        : `${symbol}${formatAmount(min)} – ${symbol}${formatAmount(max)}`

    return `${range} / ${frequency}`
  }

  if (job.salary) {
    const [min, max] = job.salary
      .split(/[-–]/)
      .map((part) => Number(part.replace(/[^\d.]/g, "")))

    if (Number.isFinite(min) && Number.isFinite(max)) {
      return `${DEFAULT_SALARY_SYMBOL}${formatAmount(min)} – ${DEFAULT_SALARY_SYMBOL}${formatAmount(max)} / month`
    }

    return job.salary
  }

  return "—"
}

function formatLocation(job: ManagedJob) {
  const location = job.location

  if (location && /^remote$/i.test(location)) return "Remote"
  if (job.isRemote) return location ? `Remote (${location})` : "Remote"

  return location ?? "On-site"
}

function formatDeadline(value: string | null) {
  if (!value) return "No deadline"

  const [year, month, day] = value.slice(0, 10).split("-").map(Number)
  if (!year || !month || !day) return "No deadline"

  return `${MONTHS[month - 1]} ${String(day).padStart(2, "0")}, ${year}`
}

function formatPostedAgo(createdAt: string | null) {
  if (!createdAt) return null

  const created = new Date(createdAt).getTime()
  if (Number.isNaN(created)) return null

  const days = Math.floor((Date.now() - created) / 86_400_000)

  if (days <= 0) return "Posted today"
  if (days === 1) return "Posted 1d ago"
  if (days < 7) return `Posted ${days}d ago`
  if (days < 30) return `Posted ${Math.floor(days / 7)}w ago`

  return `Posted ${Math.floor(days / 30)}mo ago`
}

function getDeadlineHint(job: ManagedJob) {
  if (job.status === "expired") return "Closed"
  if (job.status === "draft") return "Not published"
  if (job.status === "paused") return "Paused"

  return formatPostedAgo(job.createdAt)
}

/* -------------------------------------------------------------------------- */
/*  Visual tokens                                                             */
/* -------------------------------------------------------------------------- */

const CATEGORY_TONES: Record<string, string> = {
  Engineering:
    "bg-violet-500/10 text-violet-600 ring-violet-500/20 dark:text-violet-300",
  Design: "bg-sky-500/10 text-sky-600 ring-sky-500/20 dark:text-sky-300",
  "Data & Analytics":
    "bg-cyan-500/10 text-cyan-600 ring-cyan-500/20 dark:text-cyan-300",
  Marketing:
    "bg-rose-500/10 text-rose-600 ring-rose-500/20 dark:text-rose-300",
  Sales:
    "bg-orange-500/10 text-orange-600 ring-orange-500/20 dark:text-orange-300",
  "Customer Support":
    "bg-teal-500/10 text-teal-600 ring-teal-500/20 dark:text-teal-300",
  Finance:
    "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
  "Human Resources":
    "bg-fuchsia-500/10 text-fuchsia-600 ring-fuchsia-500/20 dark:text-fuchsia-300",
  Operations:
    "bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:text-amber-300",
}

const DEFAULT_CATEGORY_TONE =
  "bg-brand/10 text-brand ring-brand/25 dark:text-brand"

const STATUS_META: Record<JobPostStatus, { label: string; className: string }> =
  {
    active: {
      label: "Active",
      className:
        "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    paused: {
      label: "Paused",
      className:
        "border-sky-500/25 bg-sky-500/10 text-sky-600 dark:text-sky-400",
    },
    expired: {
      label: "Expired",
      className:
        "border-black/10 bg-black/[0.04] text-[#1A1410]/50 dark:border-white/10 dark:bg-white/5 dark:text-white/40",
    },
    draft: {
      label: "Draft",
      className:
        "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
  }

const headCellClassName =
  "px-3 py-4 text-[10px] font-semibold tracking-[0.14em] text-[#1A1410]/45 uppercase dark:text-white/40"

const bodyCellClassName = "px-3 py-4"

const mobileLabelClassName =
  "text-[10px] font-semibold tracking-[0.14em] text-[#1A1410]/40 uppercase dark:text-white/40"

/* -------------------------------------------------------------------------- */
/*  Table                                                                     */
/* -------------------------------------------------------------------------- */

export function ManageJobsTable({ jobs }: { jobs: ManagedJob[] }) {
  const [items, setItems] = useState<ManagedJob[]>(jobs)

  function handleDeleted(id: string) {
    setItems((current) => current.filter((job) => job.id !== id))
  }

  return (
    <section
      className="mt-6 @container"
      aria-label="Job listings and postings"
    >
      <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(16,10,6,0.04),0_16px_40px_-32px_rgba(16,10,6,0.5)] dark:border-white/10 dark:bg-white/[0.03]">
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Fixed layout keeps every column inside the container on desktop. */}
            <div className="hidden @min-[950px]:block">
              <table className="w-full table-fixed border-collapse text-left">
                <caption className="sr-only">
                  Job posts with company, type, compensation, applicants, status
                  and deadline
                </caption>

                <colgroup>
                  <col className="w-[18%]" />
                  <col className="w-[14%]" />
                  <col className="w-[10%]" />
                  <col className="w-[12%]" />
                  <col className="w-[12%]" />
                  <col className="w-[9%]" />
                  <col className="w-[11%]" />
                  <col className="w-[14%]" />
                </colgroup>

                <thead>
                  <tr className="border-b border-black/5 dark:border-white/10">
                    <th scope="col" className={headCellClassName}>
                      Job title &amp; dept
                    </th>
                    <th scope="col" className={headCellClassName}>
                      Company &amp; location
                    </th>
                    <th scope="col" className={cn(headCellClassName, "px-2")}>
                      Type
                    </th>
                    <th scope="col" className={headCellClassName}>
                      Compensation
                    </th>
                    <th scope="col" className={headCellClassName}>
                      Applicants
                    </th>
                    <th scope="col" className={headCellClassName}>
                      Status
                    </th>
                    <th scope="col" className={headCellClassName}>
                      Deadline
                    </th>
                    <th
                      scope="col"
                      className={cn(headCellClassName, "px-2 text-right")}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-black/5 dark:divide-white/10">
                  {items.map((job) => (
                    <tr
                      key={job.id}
                      className="transition-colors hover:bg-[#FAF7F2]/60 dark:hover:bg-white/[0.02]"
                    >
                      <td className={bodyCellClassName}>
                        <JobTitleCell job={job} />
                      </td>

                      <td className={bodyCellClassName}>
                        <CompanyCell job={job} />
                      </td>

                      <td className={cn(bodyCellClassName, "px-2")}>
                        <TypePill jobType={job.jobType} />
                      </td>

                      <td className="px-3 py-4 text-[13px] leading-5 break-words text-[#1A1410]/70 tabular-nums dark:text-white/60">
                        {formatCompensation(job)}
                      </td>

                      <td className={bodyCellClassName}>
                        <ApplicantsCell count={job.applicants} />
                      </td>

                      <td className={bodyCellClassName}>
                        <StatusPill status={job.status} />
                      </td>

                      <td className={bodyCellClassName}>
                        <DeadlineCell job={job} />
                      </td>

                      <td className={cn(bodyCellClassName, "px-2")}>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            render={
                              <Link
                                href={`/dashboard/recruiter/jobs/${job.id}`}
                              />
                            }
                            nativeButton={false}
                            variant="outline"
                            size="icon"
                            aria-label={`View ${job.title}`}
                            title={`View ${job.title}`}
                            className="size-8 rounded-lg border-black/10 bg-transparent text-[#1A1410]/60 shadow-none hover:border-brand/40 hover:bg-brand/5 hover:text-brand dark:border-white/10 dark:bg-transparent dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            <Eye className="size-3.5" />
                          </Button>

                          <Button
                            render={
                              <Link
                                href={`/dashboard/recruiter/jobs/${job.id}/edit`}
                              />
                            }
                            nativeButton={false}
                            variant="outline"
                            size="icon"
                            aria-label={`Edit ${job.title}`}
                            title={`Edit ${job.title}`}
                            className="size-8 rounded-lg border-black/10 bg-transparent text-[#1A1410]/60 shadow-none hover:border-brand/40 hover:bg-brand/5 hover:text-brand dark:border-white/10 dark:bg-transparent dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white"
                          >
                            <Pencil className="size-3.5" />
                          </Button>

                          <DeleteJobDialog
                            jobId={job.id}
                            jobTitle={job.title}
                            onDeleted={() => handleDeleted(job.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card layout for phones and tablets. */}
            <ul className="divide-y divide-black/5 @min-[950px]:hidden dark:divide-white/10">
              {items.map((job) => (
                <li key={job.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <JobTitleCell job={job} />
                    <StatusPill status={job.status} />
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                    <div className="min-w-0">
                      <dt className={mobileLabelClassName}>Company</dt>
                      <dd className="mt-1 text-[13px] font-medium break-words text-[#1A1410] dark:text-white/90">
                        {job.company}
                      </dd>
                    </div>

                    <div className="min-w-0">
                      <dt className={mobileLabelClassName}>Location</dt>
                      <dd className="mt-1 flex items-start gap-1 text-[13px] text-[#1A1410]/70 dark:text-white/60">
                        <MapPin className="mt-0.5 size-3.5 shrink-0" />
                        <span className="min-w-0 break-words">
                          {formatLocation(job)}
                        </span>
                      </dd>
                    </div>

                    <div>
                      <dt className={mobileLabelClassName}>Type</dt>
                      <dd className="mt-1">
                        <TypePill jobType={job.jobType} />
                      </dd>
                    </div>

                    <div>
                      <dt className={mobileLabelClassName}>Compensation</dt>
                      <dd className="mt-1 text-[13px] text-[#1A1410]/70 tabular-nums dark:text-white/60">
                        {formatCompensation(job)}
                      </dd>
                    </div>

                    <div>
                      <dt className={mobileLabelClassName}>Applicants</dt>
                      <dd className="mt-1">
                        <ApplicantsCell count={job.applicants} />
                      </dd>
                    </div>

                    <div>
                      <dt className={mobileLabelClassName}>Deadline</dt>
                      <dd className="mt-1">
                        <DeadlineCell job={job} />
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex items-center justify-end gap-2 border-t border-black/5 pt-3 dark:border-white/10">
                    <Button
                      render={
                        <Link href={`/dashboard/recruiter/jobs/${job.id}`} />
                      }
                      nativeButton={false}
                      variant="outline"
                      size="icon"
                      aria-label={`View ${job.title}`}
                      title={`View ${job.title}`}
                      className="size-8 rounded-lg border-black/10 bg-transparent text-[#1A1410]/60 shadow-none hover:border-brand/40 hover:bg-brand/5 hover:text-brand dark:border-white/10 dark:bg-transparent dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                      <Eye className="size-3.5" />
                    </Button>

                    <Button
                      render={
                        <Link
                          href={`/dashboard/recruiter/jobs/${job.id}/edit`}
                        />
                      }
                      nativeButton={false}
                      variant="outline"
                      size="icon"
                      aria-label={`Edit ${job.title}`}
                      title={`Edit ${job.title}`}
                      className="size-8 rounded-lg border-black/10 bg-transparent text-[#1A1410]/60 shadow-none hover:border-brand/40 hover:bg-brand/5 hover:text-brand dark:border-white/10 dark:bg-transparent dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                      <Pencil className="size-3.5" />
                    </Button>

                    <DeleteJobDialog
                      jobId={job.id}
                      jobTitle={job.title}
                      onDeleted={() => handleDeleted(job.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/*  Cells                                                                     */
/* -------------------------------------------------------------------------- */

function JobTitleCell({ job }: { job: ManagedJob }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ring-1",
          CATEGORY_TONES[job.category] ?? DEFAULT_CATEGORY_TONE
        )}
      >
        {job.title.charAt(0).toUpperCase()}
      </span>

      <div className="min-w-0">
        <p className="text-sm font-semibold break-words text-[#1A1410] dark:text-white">
          {job.title}
        </p>
        <p className="mt-0.5 text-[11px] break-words text-[#1A1410]/45 dark:text-white/40">
          {job.category}
        </p>
      </div>
    </div>
  )
}

function CompanyCell({ job }: { job: ManagedJob }) {
  return (
    <div className="min-w-0">
      <p className="text-[13px] font-medium break-words text-[#1A1410] dark:text-white/90">
        {job.company}
      </p>
      <p className="mt-0.5 flex items-start gap-1 text-[11px] break-words text-[#1A1410]/45 dark:text-white/40">
        <MapPin className="mt-0.5 size-3 shrink-0" />
        <span className="min-w-0 break-words">{formatLocation(job)}</span>
      </p>
    </div>
  )
}

function TypePill({ jobType }: { jobType: string }) {
  return (
    <span className="inline-flex rounded-full border border-black/10 px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-[#1A1410]/65 dark:border-white/10 dark:text-white/60">
      {formatJobType(jobType)}
    </span>
  )
}

function ApplicantsCell({ count }: { count: number }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 text-[13px] whitespace-nowrap text-[#1A1410]/70 dark:text-white/60">
      <Users className="size-3.5 shrink-0 translate-y-0.5 text-[#1A1410]/35 dark:text-white/30" />
      <span className="font-semibold text-[#1A1410] dark:text-white/90">
        {count}
      </span>
      <span className="text-[11px]">candidates</span>
    </span>
  )
}

function StatusPill({ status }: { status: JobPostStatus }) {
  const meta = STATUS_META[status]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap",
        meta.className
      )}
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {meta.label}
    </span>
  )
}

function DeadlineCell({ job }: { job: ManagedJob }) {
  const hint = getDeadlineHint(job)

  return (
    <div className="leading-5 break-words">
      <p className="text-[13px] font-medium text-[#1A1410] dark:text-white/90">
        {formatDeadline(job.applicationDeadline)}
      </p>
      {hint ? (
        <p className="mt-0.5 text-[11px] text-[#1A1410]/40 dark:text-white/35">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20">
        <Plus className="size-5" />
      </span>

      <p className="mt-4 text-sm font-bold text-[#1A1410] dark:text-white">
        No job posts yet
      </p>
      <p className="mt-1 max-w-sm text-xs leading-5 text-[#1A1410]/50 dark:text-white/40">
        Publish your first role and it will show up here with applicants, status
        and deadlines.
      </p>

      <Link
        href="/dashboard/recruiter/jobs/new"
        className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-xl bg-brand px-3.5 text-xs font-semibold text-[#0A0A0A] transition-colors hover:bg-brand-hover"
      >
        <Plus className="size-3.5" />
        New Job Post
      </Link>
    </div>
  )
}
