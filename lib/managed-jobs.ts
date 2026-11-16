export type JobPostStatus = "active" | "paused" | "expired" | "draft"

export type JobCompensation = {
  currency: string
  min: number
  max: number
  frequency: string
}

/**
 * What the jobs table renders. Normalized from the Mongo documents so the table
 * does not care whether a job was seeded directly in the database or created
 * through `NewJobForm`.
 */
export type ManagedJob = {
  id: string
  title: string
  company: string
  category: string
  location: string | null
  isRemote: boolean
  jobType: string
  compensation: JobCompensation | null
  salary: string | null
  applicants: number
  status: JobPostStatus
  applicationDeadline: string | null
  createdAt: string | null
  description: string
  requirements: string[]
}

/** Loose shape of a document in the `jobs` collection. */
export type JobDocument = {
  _id?: string
  id?: string
  title?: string
  company?: string
  category?: string
  experienceLevel?: string | null
  location?: string | null
  isRemote?: boolean
  jobType?: string
  salary?: string
  compensation?: Partial<JobCompensation>
  applicants?: number
  status?: JobPostStatus
  applicationDeadline?: string | null
  createdAt?: string | null
  description?: string
  requirements?: string[]
  responsibilities?: string[]
  qualifications?: string[]
}

export const DEFAULT_CATEGORY = "General"

const CATEGORY_KEYWORDS: [RegExp, string][] = [
  [/develop|engineer|programmer|frontend|front-end|backend|back-end|full ?stack|react|node|javascript|typescript|html|css|next\.js/, "Engineering"],
  [/design|figma|wireframe|prototyp|\bui\b|\bux\b/, "Design"],
  [/market|seo|social media|content|campaign|brand/, "Marketing"],
  [/data|analytics|python|sql|machine learning/, "Data & Analytics"],
  [/sales|business development/, "Sales"],
  [/support|service desk|helpdesk/, "Customer Support"],
  [/finance|account/, "Finance"],
  [/recruit|human resource|\bhr\b/, "Human Resources"],
  [/operations|logistics|supply chain/, "Operations"],
]

const REMOTE_LOCATION = /^remote$/i

function guessCategory(doc: JobDocument) {
  const haystack = [
    doc.title,
    doc.description,
    ...(doc.requirements ?? []),
    ...(doc.responsibilities ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  for (const [pattern, category] of CATEGORY_KEYWORDS) {
    if (pattern.test(haystack)) return category
  }

  return DEFAULT_CATEGORY
}

function deriveStatus(deadline?: string | null): JobPostStatus {
  if (!deadline) return "active"

  const time = new Date(deadline).getTime()

  if (Number.isNaN(time)) return "active"

  return time < Date.now() ? "expired" : "active"
}

export function toManagedJob(doc: JobDocument): ManagedJob {
  const { min, max } = doc.compensation ?? {}

  const compensation =
    typeof min === "number" && typeof max === "number"
      ? {
          currency: doc.compensation?.currency ?? "USD",
          min,
          max,
          frequency: doc.compensation?.frequency ?? "month",
        }
      : null

  return {
    id: doc._id ?? doc.id ?? "",
    title: doc.title?.trim() || "Untitled role",
    company: doc.company?.trim() || "Unknown company",
    category: doc.category?.trim() || guessCategory(doc),
    location: doc.location?.trim() || null,
    isRemote:
      Boolean(doc.isRemote) ||
      REMOTE_LOCATION.test(doc.location?.trim() ?? ""),
    jobType: (doc.jobType ?? "full-time").toLowerCase(),
    compensation,
    salary: doc.salary?.trim() || null,
    applicants: typeof doc.applicants === "number" ? doc.applicants : 0,
    status: doc.status ?? deriveStatus(doc.applicationDeadline),
    applicationDeadline: doc.applicationDeadline || null,
    createdAt: doc.createdAt || null,
    description: doc.description ?? "",
    requirements: doc.requirements ?? doc.responsibilities ?? [],
  }
}
