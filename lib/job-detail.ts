import type { JobDocument, JobPostStatus } from "@/lib/managed-jobs"

/**
 * View model for the public job details page.
 *
 * The page is fed by the jobs API (`GET /jobs`), adapted through
 * `toJobDetail`. Optional fields are nullable so the same UI can render a
 * complete document or a sparse one without inventing data.
 */

export type BenefitIcon =
  "health" | "hours" | "bonus" | "learning" | "remote" | "leave"

export type HighlightIcon = "company" | "type" | "location" | "experience"

export type JobSalary = {
  min: number
  max: number
  currency: string
  frequency: string
}

export type JobDetail = {
  id: string
  category?: string
  title: string
  company: {
    name: string
    initials: string
    tagline?: string | null
    about: string[]
    industry?: string | null
    size?: string | null
    founded?: string | null
    headquarters?: string | null
    website?: string | null
    values: string[]
    verified: boolean
  }
  employmentType: string
  experience?: string | null
  remote: string
  location: string
  applyBy?: string | null
  salary: JobSalary | null
  /** Salary text used when the API only exposes a free-form salary string. */
  salaryText?: string | null
  salaryNote?: string | null
  description: string[]
  mission?: string | null
  highlights: {
    icon: HighlightIcon
    label: string
    value: string
  }[]
  qualifications: string[]
  skills: string[]
  niceToHave: string[]
  responsibilities: string[]
  benefits: {
    icon: BenefitIcon
    title: string
    description: string
  }[]
  status?: JobPostStatus
}

export function formatSalary(salary: JobSalary) {
  const format = (value: number) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)

  // Currency codes read better with a space; symbols (৳, $) stay attached.
  const separator = /^[A-Za-z]/.test(salary.currency) ? " " : ""

  return `${salary.currency}${separator}${format(
    salary.min
  )} – ${salary.currency}${separator}${format(salary.max)}`
}

/** Prefers the structured range and falls back to the API's salary string. */
export function formatJobSalary(job: Pick<JobDetail, "salary" | "salaryText">) {
  if (job.salary) return formatSalary(job.salary)

  const text = job.salaryText?.trim()
  return text ? text : null
}

const REMOTE_LOCATION = /^remote\b/i

function getInitials(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return initials || "?"
}

function formatJobType(jobType?: string) {
  if (!jobType?.trim()) return "Not specified"

  const normalized = jobType.trim().toLowerCase()

  switch (normalized) {
    case "full-time":
    case "fulltime":
      return "Full-time"
    case "part-time":
    case "parttime":
      return "Part-time"
    case "contract":
      return "Contract"
    case "internship":
      return "Internship"
    default:
      return jobType.charAt(0).toUpperCase() + jobType.slice(1)
  }
}

function formatDeadline(value?: string | null) {
  const raw = value?.trim()
  if (!raw) return null

  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return raw

  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(raw)

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(isDateOnly ? { timeZone: "UTC" } : {}),
  }).format(date)
}

function splitParagraphs(text?: string) {
  return (text ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
}

function cleanList(items?: string[]) {
  return (items ?? []).map((item) => item.trim()).filter(Boolean)
}

function toSalary(compensation?: Partial<JobSalary> | null): JobSalary | null {
  const { min, max } = compensation ?? {}

  if (typeof min !== "number" || typeof max !== "number") return null

  return {
    min,
    max,
    currency: compensation?.currency ?? "",
    frequency: compensation?.frequency ?? "month",
  }
}

/** Maps a jobs API document onto the job details page view model. */
export function toJobDetail(doc: JobDocument): JobDetail {
  const title = doc.title?.trim() || "Untitled role"
  const companyName = doc.company?.trim() || "Unknown company"
  const location = doc.location?.trim() || null
  const isRemote =
    Boolean(doc.isRemote) || (location ? REMOTE_LOCATION.test(location) : false)
  const employmentType = formatJobType(doc.jobType)
  const experience = doc.experienceLevel?.trim() || null
  const locationLabel = location ?? "Location not specified"

  const qualifications = cleanList(doc.qualifications)
  const requirements = qualifications.length
    ? qualifications
    : cleanList(doc.requirements)

  return {
    id: doc._id ?? doc.id ?? "",
    category: doc.category?.trim() || undefined,
    title,
    company: {
      name: companyName,
      initials: getInitials(companyName),
      tagline: doc.category?.trim() || null,
      about: [],
      industry: doc.category?.trim() || null,
      size: null,
      founded: null,
      headquarters: location,
      website: null,
      values: [],
      verified: false,
    },
    employmentType,
    experience,
    remote: isRemote ? "Remote" : "On-site",
    location: locationLabel,
    applyBy: formatDeadline(doc.applicationDeadline),
    salary: toSalary(doc.compensation),
    salaryText: doc.salary?.trim() || null,
    salaryNote: null,
    description: splitParagraphs(doc.description),
    mission: null,
    highlights: [
      { icon: "company", label: "Company", value: companyName },
      { icon: "type", label: "Job type", value: employmentType },
      { icon: "location", label: "Location", value: locationLabel },
      {
        icon: "experience",
        label: "Experience",
        value: experience ?? "Not specified",
      },
    ],
    qualifications: requirements,
    skills: [],
    niceToHave: [],
    responsibilities: cleanList(doc.responsibilities),
    benefits: [],
    status: doc.status,
  }
}
