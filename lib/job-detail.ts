import type { JobDocument, JobPostStatus } from "@/lib/managed-jobs"

/**
 * View model for the public job details page.
 *
 * The page is fed by the jobs API (`GET /jobs`), adapted through
 * `toJobDetail`. Optional fields are nullable so the same UI can render a
 * complete document or a sparse one without turning missing fields into fake
 * facts. Sparse documents still get a role-specific overview composed from
 * their own title, company, arrangement, responsibilities and qualifications.
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
  /**
   * Overview paragraphs. A substantial API description is used verbatim;
   * otherwise a role-specific summary is composed from the document's own
   * fields (never from placeholder copy).
   */
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

type RoleProfile = {
  match: RegExp
  focus: string
}

/**
 * Role-specific framing used when a database document has no usable
 * description. Each entry describes the kind of work the role actually does, so
 * two jobs never fall back to the same generic paragraph.
 */
const ROLE_PROFILES: RoleProfile[] = [
  {
    match: /ui\/?ux|user experience|product designer/i,
    focus:
      "The role centres on user research, journey mapping, wireframes, and prototypes, with usability findings carried through into a maintainable design system.",
  },
  {
    match: /graphic|brand designer|visual designer/i,
    focus:
      "The role focuses on visual identity, layout, and production-ready brand assets across digital and campaign work.",
  },
  {
    match: /full.?stack/i,
    focus:
      "The role spans both sides of the product: building client-facing interfaces and connecting them to APIs, data, and server-side services.",
  },
  {
    match: /front.?end|react|next\.?js|vue|angular/i,
    focus:
      "The role centres on building responsive, accessible interfaces and reusable components, with attention to frontend architecture and performance.",
  },
  {
    match: /back.?end|server-side|api developer|python|django|flask/i,
    focus:
      "The role centres on API design, server-side logic, and database work, with an emphasis on clean service boundaries and dependable production behaviour.",
  },
  {
    match: /mobile|android|ios|react native|flutter/i,
    focus:
      "The role focuses on mobile development end to end, from screen flows and state handling to release quality across devices.",
  },
  {
    match: /devops|sre|platform engineer|infrastructure|cloud engineer/i,
    focus:
      "The role focuses on deployment pipelines, cloud infrastructure, and observability, keeping releases repeatable and production healthy.",
  },
  {
    match: /security engineer|security analyst|application security/i,
    focus:
      "The role focuses on hardening systems and reviewing risk across application code, infrastructure, and access controls.",
  },
  {
    match: /\bqa\b|quality assurance|test engineer|automation engineer/i,
    focus:
      "The role focuses on test strategy and automation, turning requirements into dependable checks that catch regressions before release.",
  },
  {
    match: /data analyst|analytics|business intelligence/i,
    focus:
      "The role focuses on turning raw data into clear analysis, reporting, and models that inform day-to-day decisions.",
  },
  {
    match: /data scien|machine learning/i,
    focus:
      "The role focuses on building and evaluating models, working from data preparation through to practical, measurable outcomes.",
  },
  {
    match: /product manager|product owner/i,
    focus:
      "The role focuses on discovery, prioritisation, and delivery, turning user and business needs into a clear product direction.",
  },
  {
    match: /seo|search engine opt/i,
    focus:
      "The role focuses on technical SEO, keyword research, and on-page improvements that grow qualified organic traffic.",
  },
  {
    match: /content|writer|copywriter|editor/i,
    focus:
      "The role focuses on research, drafting, and editing content that fits both the brand and the audience it is written for.",
  },
  {
    match: /market|growth|social media|campaign|brand/i,
    focus:
      "The role focuses on campaign planning, channel execution, and measurement, with the results feeding the next round of work.",
  },
  {
    match: /\bhr\b|human resources|recruit|talent/i,
    focus:
      "The role focuses on hiring, onboarding, and day-to-day people operations that keep teams supported and compliant.",
  },
  {
    match: /support|customer success|helpdesk/i,
    focus:
      "The role focuses on resolving customer issues clearly and consistently, feeding recurring problems back to the product team.",
  },
  {
    match: /sales|business development/i,
    focus:
      "The role focuses on pipeline development, client conversations, and closing business in line with the company's growth plan.",
  },
  {
    match: /finance|account/i,
    focus:
      "The role focuses on accurate reporting, reconciliation, and the financial controls behind day-to-day operations.",
  },
  {
    match: /operations|logistics|supply chain/i,
    focus:
      "The role focuses on coordinating day-to-day operations, removing bottlenecks, and keeping delivery predictable.",
  },
  {
    match: /engineer|developer|software|programmer/i,
    focus:
      "The role focuses on building and maintaining software through the full delivery cycle, from implementation and review to release and support.",
  },
  {
    match: /design/i,
    focus:
      "The role focuses on interface and visual design work, from early concepts through to production-ready assets.",
  },
]

const DEFAULT_ROLE_FOCUS =
  "The role focuses on shipping maintainable work, carrying it from implementation through release and ongoing support."

const INLINE_SENTENCE_STARTS =
  /^(experience|knowledge|understanding|ability|familiarity|proven|strong|good|excellent|comfort|attention|hands|solid|working|background|degree|bachelor|master|build|develop|design|create|manage|maintain|collaborate|own|lead|write|review|test|support|partner|improve|analy[sz]e|coordinate|implement|ship|work|help|monitor|optimi[sz]e|report|mentor|deliver|drive|run|translate|conduct|research|prototype|wireframe|define|plan|execute|measure|handle|resolve|prepare|assist|contribute|ensure|provide|troubleshoot|communicate|present|negotiate|recruit|onboard|forecast|reconcile|automate|join|apply)$/i

export function getRoleFocus(title: string, category?: string) {
  const haystack = `${title} ${category ?? ""}`.trim()

  return (
    ROLE_PROFILES.find((profile) => profile.match.test(haystack))?.focus ??
    DEFAULT_ROLE_FOCUS
  )
}

/** Keeps proper nouns and acronyms intact while fitting list items into prose. */
function inlineItem(item: string) {
  const cleaned = item.trim().replace(/[.;]+$/, "")
  const [first, ...rest] = cleaned.split(/\s+/)

  if (!first || !INLINE_SENTENCE_STARTS.test(first)) return cleaned

  return [`${first.charAt(0).toLowerCase()}${first.slice(1)}`, ...rest].join(
    " "
  )
}

function joinList(items: string[]) {
  if (items.length <= 1) return items[0] ?? ""
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`
}

function articleFor(word: string) {
  return /^[aeiou]/i.test(word) ? "an" : "a"
}

function buildOverview(
  doc: JobDocument,
  context: {
    title: string
    companyName: string
    category?: string
    location: string
    isRemote: boolean
    employmentType: string
  }
): string[] {
  const description = splitParagraphs(doc.description)
  const descriptionText = description.join(" ")

  // A real, substantial description is the strongest source; leave it alone.
  if (description.length > 1 || descriptionText.length > 180) {
    return description
  }

  const { title, companyName, category, location, isRemote, employmentType } =
    context
  const responsibilities = cleanList(doc.responsibilities)
  const qualifications = cleanList(doc.qualifications)
  const requirements = qualifications.length
    ? qualifications
    : cleanList(doc.requirements)

  const intro = `${companyName} is hiring a ${title}${
    category ? ` for its ${category} team` : ""
  }. ${getRoleFocus(title, category)}`

  const type =
    employmentType !== "Not specified" ? employmentType.toLowerCase() : null
  const locationIsRemote = /^remote\b/i.test(location)
  const hasLocation = location !== "Location not specified"
  const article = type ? articleFor(type) : "a"

  let arrangement = ""

  if (isRemote) {
    arrangement =
      hasLocation && !locationIsRemote
        ? `This is ${article} ${type ?? "remote"} role, with the team anchored in ${location}.`
        : `This is ${article} ${type ?? "remote"} role with the team working fully remotely.`
  } else if (hasLocation) {
    arrangement = `This is ${article} ${
      type ?? "on-site"
    } role based in ${location}.`
  } else if (type) {
    arrangement = `This is ${article} ${type} role.`
  }

  const experienceNote = doc.experienceLevel?.trim()
    ? `It is aimed at candidates with ${doc.experienceLevel
        .trim()
        .toLowerCase()} experience.`
    : ""

  const details: string[] = []

  if (arrangement) details.push(arrangement)
  if (experienceNote) details.push(experienceNote)

  if (responsibilities.length) {
    details.push(
      `Day to day, you'll ${joinList(
        responsibilities.slice(0, 3).map(inlineItem)
      )}.`
    )
  }

  if (requirements.length) {
    details.push(
      `The role calls for ${joinList(
        requirements.slice(0, 3).map(inlineItem)
      )}.`
    )
  }

  return details.length ? [intro, details.join(" ")] : [intro]
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

  const category = doc.category?.trim() || undefined
  const description = buildOverview(doc, {
    title,
    companyName,
    category,
    location: locationLabel,
    isRemote,
    employmentType,
  })

  return {
    id: doc._id ?? doc.id ?? "",
    category,
    title,
    company: {
      name: companyName,
      initials: getInitials(companyName),
      tagline: category ?? null,
      about: [],
      industry: category ?? null,
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
    description,
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
