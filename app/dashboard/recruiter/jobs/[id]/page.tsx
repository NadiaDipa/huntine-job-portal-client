import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  Banknote,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CalendarDays,
  Clock,
  Globe2,
  GraduationCap,
  Info,
  Layers,
  ListChecks,
  MapPin,
  Pencil,
  Target,
  type LucideIcon,
} from "lucide-react"

import { getJobById } from "@/app/api/jobs"
import { JobPageState } from "@/app/components/JobPageState"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { toManagedJob, type JobDocument } from "@/lib/managed-jobs"

export const metadata: Metadata = {
  title: "Job details | Huntine",
  description:
    "Review the role, compensation, responsibilities, and requirements for this job post.",
}

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

function formatCompensation(job: JobDocument) {
  const compensation = job.compensation

  if (
    compensation &&
    typeof compensation.min === "number" &&
    typeof compensation.max === "number"
  ) {
    const currency = compensation.currency ?? "USD"
    const symbol = CURRENCY_SYMBOLS[currency] ?? currency
    const range =
      compensation.min === compensation.max
        ? `${symbol}${formatAmount(compensation.min)}`
        : `${symbol}${formatAmount(compensation.min)} – ${symbol}${formatAmount(compensation.max)}`

    return `${range} / ${compensation.frequency ?? "month"}`
  }

  const salary = job.salary?.trim()
  if (!salary) return "Not specified"

  const [min, max] = salary
    .split(/[-–]/)
    .map((part) => Number(part.replace(/[^\d.]/g, "")))

  if (Number.isFinite(min) && Number.isFinite(max)) {
    return `${DEFAULT_SALARY_SYMBOL}${formatAmount(min)} – ${DEFAULT_SALARY_SYMBOL}${formatAmount(max)} / month`
  }

  return salary
}

function parseDate(value: string) {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)

  if (dateOnly) {
    return new Date(
      Number(dateOnly[1]),
      Number(dateOnly[2]) - 1,
      Number(dateOnly[3])
    )
  }

  return new Date(value)
}

function formatDate(value?: string | null) {
  if (!value) return "Not set"

  const date = parseDate(value)
  if (Number.isNaN(date.getTime())) return "Not set"

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function toList(values?: string[]) {
  return (values ?? []).map((value) => value.trim()).filter(Boolean)
}

const cardClassName =
  "rounded-3xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(16,10,6,0.04),0_16px_40px_-32px_rgba(16,10,6,0.5)] dark:border-white/10 dark:bg-white/[0.04]"

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let job: JobDocument | null = null
  let loadFailed = false

  try {
    job = await getJobById(id)
  } catch {
    loadFailed = true
  }

  if (loadFailed) {
    return <JobPageState variant="error" />
  }

  if (!job || !(job._id ?? job.id)) {
    return <JobPageState variant="missing" />
  }

  const managed = toManagedJob(job)
  const responsibilities = toList(job.responsibilities)
  const qualifications = toList(job.qualifications ?? job.requirements)
  const experienceLevel = job.experienceLevel?.trim() || "Not specified"
  const location =
    managed.location ?? (managed.isRemote ? "Remote" : "Not specified")

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            href="/dashboard/recruiter/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A1410]/50 transition-colors hover:text-brand dark:text-white/40 dark:hover:text-brand"
          >
            <ArrowLeft className="size-3.5" />
            Back to manage jobs
          </Link>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#1A1410] sm:text-3xl dark:text-white">
            {managed.title}
          </h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[#1A1410]/55 dark:text-white/50">
            <Building2 className="size-4 shrink-0" />
            <span className="truncate">{managed.company}</span>
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            <Badge
              variant="outline"
              className="rounded-full border-brand/30 bg-brand/10 text-[11px] font-semibold text-brand"
            >
              {managed.category}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full border-black/10 bg-[#FAF7F2] text-[11px] font-medium text-[#1A1410]/70 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
            >
              {formatJobType(managed.jobType)}
            </Badge>
            <Badge
              variant="outline"
              className="rounded-full border-black/10 bg-[#FAF7F2] text-[11px] font-medium text-[#1A1410]/70 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
            >
              {managed.isRemote ? "Remote" : "On-site"}
            </Badge>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-start">
          <Button
            render={<Link href="/dashboard/recruiter/jobs" />}
            nativeButton={false}
            variant="outline"
            className="h-10 gap-2 rounded-xl border-black/10 px-4 text-sm font-semibold dark:border-white/15"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          <Button
            render={<Link href={`/dashboard/recruiter/jobs/${id}/edit`} />}
            nativeButton={false}
            className="h-10 gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-[#0A0A0A] shadow-lg shadow-brand/20 transition-colors hover:bg-brand-hover"
          >
            <Pencil className="size-4" />
            Edit Job
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <section className={cn(cardClassName, "p-5 sm:p-6")}>
          <SectionHeader
            icon={Info}
            title="Role overview"
            description="The key details candidates will see on this listing."
          />

          <Separator className="my-5 bg-black/5 dark:bg-white/10" />

          <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <DetailItem
              icon={BriefcaseBusiness}
              label="Job title"
              value={managed.title}
            />
            <DetailItem
              icon={Building2}
              label="Company name"
              value={managed.company}
            />
            <DetailItem
              icon={Target}
              label="Category"
              value={managed.category}
            />
            <DetailItem
              icon={Layers}
              label="Experience level"
              value={experienceLevel}
            />
            <DetailItem
              icon={Clock}
              label="Job type"
              value={formatJobType(managed.jobType)}
            />
            <DetailItem
              icon={Globe2}
              label="Remote status"
              value={managed.isRemote ? "Remote" : "On-site"}
            />
            <DetailItem icon={MapPin} label="Location" value={location} />
            <DetailItem
              icon={Banknote}
              label="Compensation"
              value={formatCompensation(job)}
            />
            <DetailItem
              icon={CalendarClock}
              label="Application deadline"
              value={formatDate(job.applicationDeadline)}
            />
            <DetailItem
              icon={CalendarDays}
              label="Created date"
              value={formatDate(job.createdAt)}
            />
          </dl>
        </section>

        <section className={cn(cardClassName, "p-5 sm:p-6")}>
          <SectionHeader
            icon={ListChecks}
            title="Responsibilities"
            description="What this person will own day to day."
          />

          <Separator className="my-5 bg-black/5 dark:bg-white/10" />

          <BulletList
            items={responsibilities}
            empty="No responsibilities were provided for this role."
          />
        </section>

        <section className={cn(cardClassName, "p-5 sm:p-6")}>
          <SectionHeader
            icon={GraduationCap}
            title="Qualifications"
            description="The experience and skills this role requires."
          />

          <Separator className="my-5 bg-black/5 dark:bg-white/10" />

          <BulletList
            items={qualifications}
            empty="No qualifications were provided for this role."
          />
        </section>

        <div className="flex items-center justify-between gap-3 rounded-3xl border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-xs text-[#1A1410]/50 dark:text-white/40">
            Last reviewed from the live jobs collection.
          </p>

          <Button
            render={<Link href="/dashboard/recruiter/jobs" />}
            nativeButton={false}
            variant="outline"
            className="h-9 shrink-0 gap-2 rounded-xl border-black/10 px-3.5 text-xs font-semibold dark:border-white/15"
          >
            <ArrowLeft className="size-3.5" />
            Back to Manage Jobs
          </Button>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3.5">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand/15 text-brand ring-1 ring-brand/25">
        <Icon className="size-5" />
      </span>

      <div className="min-w-0">
        <h2 className="text-lg font-bold tracking-tight text-[#1A1410] dark:text-white">
          {title}
        </h2>
        <p className="mt-0.5 text-sm text-[#1A1410]/50 dark:text-white/40">
          {description}
        </p>
      </div>
    </div>
  )
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-black/[0.04] text-[#1A1410]/45 dark:bg-white/5 dark:text-white/40">
        <Icon className="size-4" />
      </span>

      <div className="min-w-0">
        <dt className="text-[10px] font-semibold tracking-[0.14em] text-[#1A1410]/45 uppercase dark:text-white/40">
          {label}
        </dt>
        <dd className="mt-1 text-sm font-medium break-words text-[#1A1410] dark:text-white/90">
          {value}
        </dd>
      </div>
    </div>
  )
}

function BulletList({ items, empty }: { items: string[]; empty: string }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-[#1A1410]/45 dark:text-white/35">{empty}</p>
    )
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex items-start gap-3 text-sm leading-6 text-[#1A1410]/75 dark:text-white/65"
        >
          <span
            className="mt-2 size-1.5 shrink-0 rounded-full bg-brand"
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
