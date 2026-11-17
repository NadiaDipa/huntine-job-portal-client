import {
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  Laptop,
  MapPin,
  Share2,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { formatJobSalary, type JobDetail } from "@/lib/job-detail"
import { cn } from "@/lib/utils"

import { jobCardClassName } from "./styles"

const shareButtonClassName =
  "flex size-9 items-center justify-center rounded-full border border-black/[0.08] bg-white text-[#1A1410]/55 transition-colors hover:border-brand/40 hover:bg-brand/10 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/60 dark:hover:border-brand/40 dark:hover:bg-brand/10 dark:hover:text-brand"

export function JobDetailsSidebar({ job }: { job: JobDetail }) {
  return (
    <aside
      aria-label="Job summary and sharing"
      className="space-y-4 xl:sticky xl:top-24"
    >
      <JobSummaryCard job={job} />
      <SalaryCard job={job} />
      <ShareCard />
    </aside>
  )
}

function JobSummaryCard({ job }: { job: JobDetail }) {
  return (
    <section className={cn(jobCardClassName, "p-5")}>
      <div className="flex items-center gap-2.5">
        <span aria-hidden="true" className="h-5 w-1 rounded-full bg-brand" />
        <h2 className="text-base font-bold tracking-tight text-[#1A1410] dark:text-white">
          Job Summary
        </h2>
      </div>

      <dl className="mt-5 space-y-4">
        <SummaryRow
          icon={BriefcaseBusiness}
          label="Job Type"
          value={job.employmentType}
        />
        <SummaryRow
          icon={Clock3}
          label="Experience Level"
          value={job.experience ?? "Not specified"}
        />
        <SummaryRow icon={MapPin} label="Location" value={job.location} />
        <SummaryRow icon={Laptop} label="Remote" value={job.remote} />
        <SummaryRow
          icon={CalendarDays}
          label="Application Deadline"
          value={job.applyBy ?? "Not specified"}
        />
      </dl>
    </section>
  )
}

function SalaryCard({ job }: { job: JobDetail }) {
  return (
    <section className={cn(jobCardClassName, "p-5")}>
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Wallet className="size-4" aria-hidden="true" />
        </span>
        <h2 className="text-base font-bold tracking-tight text-[#1A1410] dark:text-white">
          Salary &amp; Benefits
        </h2>
      </div>

      <p className="mt-4 text-lg font-bold tracking-tight text-[#1A1410] dark:text-white">
        {formatJobSalary(job) ?? "Salary not disclosed"}
        {job.salary && (
          <span className="ml-1 text-xs font-medium text-[#1A1410]/50 dark:text-white/45">
            / {job.salary.frequency}
          </span>
        )}
      </p>

      {job.benefits.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {job.benefits.map((benefit) => (
            <li
              key={benefit.title}
              className="flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-[11px] font-medium text-[#1A1410]/80 dark:bg-brand/10 dark:text-white/80"
            >
              <Check className="size-3 shrink-0" aria-hidden="true" />
              {benefit.title}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function ShareCard() {
  return (
    <section className={cn(jobCardClassName, "p-5")}>
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <Share2 className="size-4" aria-hidden="true" />
        </span>
        <h2 className="text-base font-bold tracking-tight text-[#1A1410] dark:text-white">
          Share This Job
        </h2>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          aria-label="Share on Facebook"
          title="Share on Facebook"
          className={shareButtonClassName}
        >
          <FacebookIcon className="size-4" />
        </button>

        <button
          type="button"
          aria-label="Share on LinkedIn"
          title="Share on LinkedIn"
          className={shareButtonClassName}
        >
          <LinkedInIcon className="size-4" />
        </button>

        <button
          type="button"
          aria-label="Share on X"
          title="Share on X"
          className={cn(
            shareButtonClassName,
            "hover:text-black dark:hover:text-white"
          )}
        >
          <XIcon className="size-3.5" />
        </button>

        <button
          type="button"
          aria-label="Copy job link"
          title="Copy job link"
          className={shareButtonClassName}
        >
          <Copy className="size-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="flex min-w-0 items-center gap-2 text-[13px] text-[#1A1410]/55 dark:text-white/50">
        <Icon className="size-4 shrink-0 text-brand" aria-hidden="true" />
        <span className="leading-5">{label}</span>
      </dt>
      <dd className="max-w-[52%] text-right text-[13px] font-semibold text-[#1A1410] dark:text-white/85">
        {value}
      </dd>
    </div>
  )
}

/* Brand marks are not part of Lucide, so they are inlined as decorative SVGs. */

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M14 9h3V6h-3c-2.21 0-4 1.79-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2c0-.55.45-1 1-1Z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M6.94 8.5a1.94 1.94 0 1 0 0-3.88 1.94 1.94 0 0 0 0 3.88ZM5.3 10h3.28v9.5H5.3V10Zm5.36 0h3.14v1.3h.05c.44-.83 1.5-1.7 3.1-1.7 3.32 0 3.93 2.18 3.93 5.02v4.88h-3.27v-4.33c0-1.03-.02-2.36-1.44-2.36-1.44 0-1.66 1.12-1.66 2.28v4.41h-3.27V10Z" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M17.53 3h3.1l-6.77 7.74L21.75 21h-6.24l-4.89-6.39L5.03 21H1.92l7.24-8.28L2.25 3h6.4l4.42 5.84L17.53 3Zm-1.09 16.15h1.72L6.63 4.75H4.79l11.65 14.4Z" />
    </svg>
  )
}
