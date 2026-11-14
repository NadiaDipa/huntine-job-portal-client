"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Banknote,
  BriefcaseBusiness,
  Building,
  CalendarClock,
  CalendarDays,
  Check,
  ClipboardList,
  Clock,
  Copy,
  GraduationCap,
  Info,
  ListChecks,
  LoaderCircle,
  MapPin,
  Save,
  Sparkles,
  Terminal,
  WandSparkles,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Options                                                                   */
/* -------------------------------------------------------------------------- */

type JobType = "full-time" | "part-time" | "contract" | "internship"

const JOB_TYPES: {
  value: JobType
  label: string
  hint: string
  icon: LucideIcon
}[] = [
  { value: "full-time", label: "Full time", hint: "40 hrs / week", icon: BriefcaseBusiness },
  { value: "part-time", label: "Part time", hint: "Flexible hours", icon: Clock },
  { value: "contract", label: "Contract", hint: "Fixed term", icon: ClipboardList },
  { value: "internship", label: "Internship", hint: "Learning role", icon: GraduationCap },
]

const JOB_CATEGORIES = [
  "Engineering",
  "Design",
  "Product",
  "Data & Analytics",
  "Marketing",
  "Sales",
  "Customer Support",
  "Finance",
  "Human Resources",
  "Operations",
  "Other",
]

const EXPERIENCE_LEVELS = [
  "Entry level",
  "Junior",
  "Mid level",
  "Senior",
  "Lead",
  "Executive",
]

const CURRENCIES = [
  { value: "USD", label: "USD — US Dollar", symbol: "$" },
  { value: "EUR", label: "EUR — Euro", symbol: "€" },
  { value: "GBP", label: "GBP — Pound", symbol: "£" },
  { value: "BDT", label: "BDT — Taka", symbol: "৳" },
  { value: "INR", label: "INR — Rupee", symbol: "₹" },
]

type Frequency = "hour" | "day" | "month" | "year"

const FREQUENCIES: { value: Frequency; label: string; suffix: string }[] = [
  { value: "hour", label: "Per hour", suffix: "/hr" },
  { value: "day", label: "Per day", suffix: "/day" },
  { value: "month", label: "Per month", suffix: "/mo" },
  { value: "year", label: "Per year", suffix: "/yr" },
]

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

function findCurrency(value: string) {
  return CURRENCIES.find((item) => item.value === value) ?? CURRENCIES[0]
}

function findFrequency(value: string) {
  return FREQUENCIES.find((item) => item.value === value) ?? FREQUENCIES[0]
}

type JobPayload = {
  title: string
  company: string
  category: string
  experienceLevel: string | null
  jobType: JobType
  isRemote: boolean
  location: string | null
  applicationDeadline: string
  compensation: {
    currency: string
    min: number
    max: number
    frequency: Frequency
    label: string
  }
  responsibilities: string[]
  qualifications: string[]
  createdAt: string
}

declare global {
  interface Window {
    /** Last submitted payload, handy for quick inspection in DevTools. */
    __lastJobPayload?: JobPayload
  }
}

/* -------------------------------------------------------------------------- */
/*  Shared styles                                                             */
/* -------------------------------------------------------------------------- */

const labelClassName =
  "text-[11px] font-semibold tracking-[0.16em] text-[#1A1410]/60 uppercase dark:text-white/50"

const hintClassName = "text-xs leading-5 text-[#1A1410]/50 dark:text-white/40"

const errorClassName = "text-xs font-medium leading-5 text-destructive"

const cardClassName =
  "rounded-3xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(16,10,6,0.04),0_16px_40px_-32px_rgba(16,10,6,0.5)] ring-0 dark:border-white/10 dark:bg-white/[0.04]"

const inputClassName =
  "h-11 rounded-xl border-black/10 bg-[#FAF7F2]/70 px-3.5 text-sm text-[#1A1410] shadow-none transition-colors placeholder:text-black/35 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"

const textareaClassName =
  "min-h-32 rounded-xl border-black/10 bg-[#FAF7F2]/70 px-3.5 py-3 text-sm leading-6 text-[#1A1410] shadow-none transition-colors placeholder:text-black/35 focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30"

const errorFieldClassName =
  "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:border-destructive/70"

/* -------------------------------------------------------------------------- */
/*  Field primitives                                                          */
/* -------------------------------------------------------------------------- */

type FieldShellProps = {
  id: string
  label: string
  hint?: string
  error?: string
  className?: string
  children: React.ReactNode
}

function FieldShell({
  id,
  label,
  hint,
  error,
  className,
  children,
}: FieldShellProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className={labelClassName}>
        {label}
      </Label>

      {children}

      {error ? (
        <p id={`${id}-error`} role="alert" className={errorClassName}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className={hintClassName}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}

type FieldLabelProps = Omit<FieldShellProps, "children">

type TextFieldProps = FieldLabelProps & React.ComponentProps<"input">

function TextField({
  id,
  label,
  hint,
  error,
  className,
  ...inputProps
}: TextFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(inputClassName, error && errorFieldClassName)}
        {...inputProps}
      />
    </FieldShell>
  )
}

type TextAreaFieldProps = FieldLabelProps & React.ComponentProps<"textarea">

function TextAreaField({
  id,
  label,
  hint,
  error,
  className,
  ...textareaProps
}: TextAreaFieldProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} className={className}>
      <Textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(textareaClassName, error && errorFieldClassName)}
        {...textareaProps}
      />
    </FieldShell>
  )
}

/* -------------------------------------------------------------------------- */
/*  Form                                                                      */
/* -------------------------------------------------------------------------- */

export function NewJobForm() {
  const [title, setTitle] = useState("")
  const [company, setCompany] = useState("")
  const [category, setCategory] = useState("")
  const [experience, setExperience] = useState("")
  const [jobType, setJobType] = useState<JobType>("full-time")

  const [isRemote, setIsRemote] = useState(false)
  const [location, setLocation] = useState("")
  const [deadline, setDeadline] = useState("")
  const [minSalary, setMinSalary] = useState("")
  const [maxSalary, setMaxSalary] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [frequency, setFrequency] = useState<Frequency>("hour")

  const [responsibilities, setResponsibilities] = useState("")
  const [qualifications, setQualifications] = useState("")

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastPayload, setLastPayload] = useState<JobPayload | null>(null)
  const [copied, setCopied] = useState(false)

  /**
   * Collects every field into one object — this is the shape a real API will
   * receive, and what gets printed in the console while there is no backend.
   */
  function collectPayload(): JobPayload {
    const toLines = (value: string) =>
      value
        .split("\n")
        .map((line) => line.trim().replace(/^[-•*]\s*/, ""))
        .filter(Boolean)

    const currencyMeta = findCurrency(currency)
    const frequencyMeta = findFrequency(frequency)

    return {
      title: title.trim(),
      company: company.trim(),
      category,
      experienceLevel: experience || null,
      jobType,
      isRemote,
      location: location.trim() || null,
      applicationDeadline: deadline,
      compensation: {
        currency,
        min: Number(minSalary),
        max: Number(maxSalary),
        frequency,
        label: `${currencyMeta.symbol}${minSalary}–${maxSalary}${frequencyMeta.suffix}`,
      },
      responsibilities: toLines(responsibilities),
      qualifications: toLines(qualifications),
      createdAt: new Date().toISOString(),
    }
  }

  function clearError(field: string) {
    setErrors((current) => {
      if (!current[field]) return current

      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function validate() {
    const next: Record<string, string> = {}

    if (!title.trim()) next.title = "Add a job title."
    if (!company.trim()) next.company = "Add the company name."
    if (!category) next.category = "Choose a job category."
    if (!isRemote && !location.trim()) {
      next.location = "Add a location, or mark the role as remote."
    }
    if (!deadline) next.deadline = "Pick an application deadline."

    const min = Number(minSalary)
    const max = Number(maxSalary)

    if (!minSalary.trim()) next.minSalary = "Add a minimum rate."
    else if (!Number.isFinite(min) || min < 0) next.minSalary = "Enter a valid number."

    if (!maxSalary.trim()) next.maxSalary = "Add a maximum rate."
    else if (!Number.isFinite(max) || max < 0) next.maxSalary = "Enter a valid number."
    else if (minSalary.trim() && Number.isFinite(min) && max < min) {
      next.maxSalary = "Maximum must be greater than the minimum."
    }

    if (!responsibilities.trim()) {
      next.responsibilities = "List at least one responsibility."
    }
    if (!qualifications.trim()) {
      next.qualifications = "List at least one requirement."
    }

    return next
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Collect and print first, so something always lands in the console even
    // when the form is incomplete.
    const payload = collectPayload()
    console.log("%c[new-job] submit clicked", "color:#FF8A33;font-weight:700", payload)

    const nextErrors = validate()
    setErrors(nextErrors)

    const errorFields = Object.keys(nextErrors)

    if (errorFields.length > 0) {
      console.warn("[new-job] validation failed", nextErrors)

      document.getElementById(errorFields[0])?.focus()
      toast.error(
        `${errorFields.length} field${errorFields.length === 1 ? "" : "s"} need attention`,
        {
          description: Object.values(nextErrors).slice(0, 2).join(" "),
        }
      )
      return
    }

    setIsSubmitting(true)

    console.log(
      "%c[new-job] payload (valid)",
      "color:#22c55e;font-weight:700",
      payload
    )
    console.log("[new-job] payload (JSON)\n" + JSON.stringify(payload, null, 2))

    // Mirror the payload into the page + a global, so the data is visible even
    // if the browser console is filtered or was opened late.
    setLastPayload(payload)
    setCopied(false)
    window.__lastJobPayload = payload

    
    // await fetch("/api/jobs", { method: "POST", body: JSON.stringify(payload) })



    await new Promise((resolve) => setTimeout(resolve, 600))

    setIsSubmitting(false)
    toast.success("Job published!", {
      description: `${payload.title} — payload shown below and in the console.`,
    })
  }

  function fillSampleData() {
    const deadline = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10)

    setTitle("Senior Frontend Engineer")
    setCompany("Acme Labs")
    setCategory("Engineering")
    setExperience("Senior")
    setJobType("full-time")
    setIsRemote(true)
    setLocation("Remote — worldwide")
    setDeadline(deadline)
    setMinSalary("45")
    setMaxSalary("70")
    setCurrency("USD")
    setFrequency("hour")
    setResponsibilities(
      "Build and ship features for the hiring platform\nReview pull requests and mentor junior engineers\nCollaborate with design and product on new flows"
    )
    setQualifications(
      "4+ years building production React applications\nStrong TypeScript and testing habits\nClear written communication in English"
    )
    setErrors({})

    toast.info("Sample data loaded", {
      description: "Now click Publish job and open the browser console.",
    })
  }

  function handleDraft() {
    if (!title.trim()) {
      setErrors((current) => ({ ...current, title: "Add a job title first." }))
      document.getElementById("title")?.focus()
      return
    }

    const payload = collectPayload()

    console.log("%c[new-job] draft payload", "color:#FF8A33;font-weight:700", payload)

    toast.success("Draft saved", {
      description: "You can finish and publish it from Manage Jobs.",
    })
  }

  async function copyPayload() {
    if (!lastPayload) return

    try {
      await navigator.clipboard.writeText(JSON.stringify(lastPayload, null, 2))
      setCopied(true)
      toast.success("Payload copied to clipboard")
    } catch {
      toast.error("Could not copy. Select the JSON manually.")
    }
  }

  /* ----------------------------- preview data ----------------------------- */

  const currencyMeta = findCurrency(currency)
  const frequencyMeta = findFrequency(frequency)

  function formatMoney(raw: string) {
    const value = Number(raw)
    if (!raw.trim() || !Number.isFinite(value)) return null

    return `${currencyMeta.symbol}${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value)}`
  }

  const minLabel = formatMoney(minSalary)
  const maxLabel = formatMoney(maxSalary)
  const salaryLabel =
    minLabel && maxLabel ? `${minLabel} – ${maxLabel}` : (minLabel ?? maxLabel)

  const deadlineLabel = (() => {
    if (!deadline) return null

    const [year, month, day] = deadline.split("-").map(Number)
    if (!year || !month || !day) return null

    return `${day} ${MONTHS[month - 1]} ${year}`
  })()

  const jobTypeLabel =
    JOB_TYPES.find((item) => item.value === jobType)?.label ?? "Full time"

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* ------------------------------ heading ------------------------------ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/dashboard/recruiter/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A1410]/50 transition-colors hover:text-brand dark:text-white/40 dark:hover:text-brand"
          >
            <ArrowLeft className="size-3.5" />
            Back to manage jobs
          </Link>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#1A1410] sm:text-3xl dark:text-white">
            Post a new job
          </h1>
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#1A1410]/55 dark:text-white/50">
            Describe the role clearly and you&apos;ll attract better-fit
            candidates. You can edit everything after publishing.
          </p>
        </div>

        <Badge
          variant="outline"
          className="h-7 gap-1.5 self-start rounded-full border-brand/30 bg-brand/10 px-3 text-[11px] font-semibold text-brand uppercase"
        >
          <Sparkles className="size-3" />
          Free posting
        </Badge>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          {/* --------------------------- main column ------------------------- */}
          <div className="space-y-6">
            {/* ------------------------ 1. basics -------------------------- */}
            <section className={cn(cardClassName, "p-5 sm:p-6")}>
              <SectionHeader
                step="01"
                icon={BriefcaseBusiness}
                title="Basic information"
                description="What the role is and who is hiring."
              />

              <Separator className="my-5 bg-black/5 dark:bg-white/10" />

              <div className="grid gap-5 sm:grid-cols-2">
                <TextField
                  id="title"
                  label="Job title"
                  placeholder="Senior Frontend Engineer"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value)
                    clearError("title")
                  }}
                  error={errors.title}
                  className="sm:col-span-2"
                />

                <TextField
                  id="company"
                  label="Company name"
                  placeholder="Acme Labs"
                  value={company}
                  onChange={(event) => {
                    setCompany(event.target.value)
                    clearError("company")
                  }}
                  error={errors.company}
                />

                <div className="space-y-2">
                  <Label htmlFor="category" className={labelClassName}>
                    Job category
                  </Label>
                  <Select
                    items={JOB_CATEGORIES.map((item) => ({ value: item, label: item }))}
                    value={category || null}
                    onValueChange={(value) => {
                      setCategory(value ?? "")
                      clearError("category")
                    }}
                  >
                    <SelectTrigger
                      id="category"
                      aria-invalid={errors.category ? true : undefined}
                      aria-describedby={
                        errors.category ? "category-error" : "category-hint"
                      }
                      className={cn(
                        "h-11 w-full rounded-xl border-black/10 bg-[#FAF7F2]/70 px-3.5 text-sm dark:border-white/10 dark:bg-white/5",
                        errors.category && errorFieldClassName
                      )}
                    >
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {JOB_CATEGORIES.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category ? (
                    <p id="category-error" role="alert" className={errorClassName}>
                      {errors.category}
                    </p>
                  ) : (
                    <p id="category-hint" className={hintClassName}>
                      Helps candidates find your post.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className={labelClassName}>
                    Experience level
                  </Label>
                  <Select
                    items={EXPERIENCE_LEVELS.map((item) => ({ value: item, label: item }))}
                    value={experience || null}
                    onValueChange={(value) => setExperience(value ?? "")}
                  >
                    <SelectTrigger
                      id="experience"
                      className="h-11 w-full rounded-xl border-black/10 bg-[#FAF7F2]/70 px-3.5 text-sm dark:border-white/10 dark:bg-white/5"
                    >
                      <SelectValue placeholder="Any level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className={hintClassName}>Optional, but adds clarity.</p>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <span className={labelClassName}>Job type</span>

                  <div
                    role="group"
                    aria-label="Job type"
                    className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                  >
                    {JOB_TYPES.map((item) => {
                      const Icon = item.icon
                      const isActive = item.value === jobType

                      return (
                        <button
                          key={item.value}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => setJobType(item.value)}
                          className={cn(
                            "group flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition-all",
                            "focus-visible:ring-3 focus-visible:ring-brand/30 focus-visible:outline-none",
                            isActive
                              ? "border-brand/60 bg-brand/10 shadow-[inset_0_0_0_1px_rgba(255,138,51,0.35)]"
                              : "border-black/10 bg-white hover:border-black/20 hover:bg-[#FAF7F2]/70 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-8 items-center justify-center rounded-lg transition-colors",
                              isActive
                                ? "bg-brand text-[#0A0A0A]"
                                : "bg-black/5 text-[#1A1410]/60 group-hover:text-brand dark:bg-white/10 dark:text-white/50"
                            )}
                          >
                            <Icon className="size-4" />
                          </span>

                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold text-[#1A1410] dark:text-white">
                              {item.label}
                            </span>
                            <span className="block truncate text-[11px] text-[#1A1410]/45 dark:text-white/35">
                              {item.hint}
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </section>

            {/* --------------------- 2. location + pay --------------------- */}
            <section className={cn(cardClassName, "p-5 sm:p-6")}>
              <SectionHeader
                step="02"
                icon={MapPin}
                title="Location, compensation & timeline"
                description="Where the work happens and what it pays."
              />

              <Separator className="my-5 bg-black/5 dark:bg-white/10" />

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <div className="flex items-start gap-3 rounded-2xl border border-black/10 bg-[#FAF7F2]/70 p-3.5 transition-colors has-[:focus-visible]:border-brand dark:border-white/10 dark:bg-white/[0.04]">
                    <Checkbox
                      id="isRemote"
                      checked={isRemote}
                      onCheckedChange={(checked) => {
                        setIsRemote(Boolean(checked))
                        clearError("location")
                      }}
                      className="mt-0.5 size-5 rounded-md data-checked:border-brand data-checked:bg-brand data-checked:text-[#0A0A0A]"
                    />

                    <div className="min-w-0">
                      <Label
                        htmlFor="isRemote"
                        className="text-sm font-semibold text-[#1A1410] dark:text-white"
                      >
                        Remote work allowed
                      </Label>
                      <p className={cn(hintClassName, "mt-1")}>
                        Candidates can do this job from anywhere.
                      </p>
                    </div>
                  </div>
                </div>

                <TextField
                  id="location"
                  label="Job location"
                  placeholder={isRemote ? "Remote — worldwide" : "Dhaka, Bangladesh"}
                  value={location}
                  onChange={(event) => {
                    setLocation(event.target.value)
                    clearError("location")
                  }}
                  error={errors.location}
                  hint={isRemote ? "Optional for remote roles." : undefined}
                  className="sm:col-span-2"
                />

                <TextField
                  id="deadline"
                  label="Application deadline"
                  type="date"
                  value={deadline}
                  onFocus={(event) => {
                    // Set the lower bound on first interaction so the
                    // server-rendered HTML never depends on "today".
                    if (!event.currentTarget.min) {
                      event.currentTarget.min = new Date().toISOString().slice(0, 10)
                    }
                  }}
                  onChange={(event) => {
                    setDeadline(event.target.value)
                    clearError("deadline")
                  }}
                  error={errors.deadline}
                  hint="Applications close at 11:59 PM on this date."
                />

                <div className="space-y-2">
                  <Label htmlFor="frequency" className={labelClassName}>
                    Pay frequency
                  </Label>
                  <Select
                    items={FREQUENCIES.map((item) => ({
                      value: item.value,
                      label: item.label,
                    }))}
                    value={frequency}
                    onValueChange={(value) => setFrequency((value ?? "hour") as Frequency)}
                  >
                    <SelectTrigger
                      id="frequency"
                      className="h-11 w-full rounded-xl border-black/10 bg-[#FAF7F2]/70 px-3.5 text-sm dark:border-white/10 dark:bg-white/5"
                    >
                      <SelectValue placeholder="Per hour" />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCIES.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className={hintClassName}>Used for the salary label.</p>
                </div>

                <div className="grid gap-4 sm:col-span-2 sm:grid-cols-[130px_minmax(0,1fr)_minmax(0,1fr)]">
                  <div className="space-y-2">
                    <Label htmlFor="currency" className={labelClassName}>
                      Currency
                    </Label>
                    <Select
                      items={CURRENCIES.map((item) => ({
                        value: item.value,
                        label: item.value,
                      }))}
                      value={currency}
                      onValueChange={(value) => setCurrency(value ?? "USD")}
                    >
                      <SelectTrigger
                        id="currency"
                        className="h-11 w-full rounded-xl border-black/10 bg-[#FAF7F2]/70 px-3.5 text-sm dark:border-white/10 dark:bg-white/5"
                      >
                        <SelectValue placeholder="USD" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <TextField
                    id="minSalary"
                    label="Minimum"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="25"
                    value={minSalary}
                    onChange={(event) => {
                      setMinSalary(event.target.value)
                      clearError("minSalary")
                    }}
                    error={errors.minSalary}
                  />

                  <TextField
                    id="maxSalary"
                    label="Maximum"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    placeholder="45"
                    value={maxSalary}
                    onChange={(event) => {
                      setMaxSalary(event.target.value)
                      clearError("maxSalary")
                    }}
                    error={errors.maxSalary}
                  />
                </div>
              </div>
            </section>

            {/* ------------------ 3. responsibilities + reqs --------------- */}
            <section className={cn(cardClassName, "p-5 sm:p-6")}>
              <SectionHeader
                step="03"
                icon={ListChecks}
                title="Responsibilities & requirements"
                description="Be specific — vague posts get fewer applicants."
              />

              <Separator className="my-5 bg-black/5 dark:bg-white/10" />

              <div className="grid gap-5">
                <TextAreaField
                  id="responsibilities"
                  label="Key responsibilities"
                  placeholder={"Build and ship features for the hiring platform\nReview pull requests and mentor junior engineers\nCollaborate with design and product on new flows"}
                  value={responsibilities}
                  onChange={(event) => {
                    setResponsibilities(event.target.value)
                    clearError("responsibilities")
                  }}
                  error={errors.responsibilities}
                  hint="One responsibility per line."
                  rows={6}
                />

                <TextAreaField
                  id="qualifications"
                  label="Qualifications & requirements"
                  placeholder={"4+ years building production React applications\nStrong TypeScript and testing habits\nClear written communication in English"}
                  value={qualifications}
                  onChange={(event) => {
                    setQualifications(event.target.value)
                    clearError("qualifications")
                  }}
                  error={errors.qualifications}
                  hint="One requirement per line."
                  rows={6}
                />
              </div>
            </section>

            {lastPayload ? (
              <section className={cn(cardClassName, "overflow-hidden")}>
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/5 p-5 dark:border-white/10">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/25 dark:text-emerald-400">
                      <Terminal className="size-4" />
                    </span>

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#1A1410] dark:text-white">
                        Submitted payload
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-[#1A1410]/50 dark:text-white/40">
                        Same object is in the browser console and on{" "}
                        <code className="rounded bg-black/5 px-1 py-0.5 font-mono text-[11px] dark:bg-white/10">
                          window.__lastJobPayload
                        </code>
                        .
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={copyPayload}
                    className="h-8 gap-1.5 rounded-lg border-black/10 text-xs dark:border-white/15"
                  >
                    {copied ? (
                      <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    {copied ? "Copied" : "Copy JSON"}
                  </Button>
                </div>

                <pre className="max-h-80 overflow-auto bg-[#0A0A0A] p-5 text-[11px] leading-5 text-white/80">
                  <code>{JSON.stringify(lastPayload, null, 2)}</code>
                </pre>
              </section>
            ) : null}

            <p className="flex items-start gap-2 px-1 text-xs leading-5 text-[#1A1410]/40 dark:text-white/30">
              <Info className="mt-0.5 size-3.5 shrink-0" />
              Posts must follow Huntine&apos;s posting guidelines. Misleading or
              discriminatory listings are removed.
            </p>
          </div>

          {/* ---------------------------- preview --------------------------- */}
          <aside className="lg:sticky lg:top-6">
            <Card className={cardClassName}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base font-bold text-[#1A1410] dark:text-white">
                    Live preview
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="gap-1.5 rounded-full border-emerald-500/30 bg-emerald-500/10 px-2.5 text-[10px] font-semibold text-emerald-600 uppercase dark:text-emerald-400"
                  >
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Draft
                  </Badge>
                </div>
                <CardDescription className="text-[#1A1410]/50 dark:text-white/40">
                  How candidates will see the basics.
                </CardDescription>

                <button
                  type="button"
                  onClick={fillSampleData}
                  className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-dashed border-brand/40 bg-brand/5 px-3 py-1 text-[11px] font-semibold text-brand transition-colors hover:bg-brand/10 focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none"
                >
                  <WandSparkles className="size-3" />
                  Fill sample data
                </button>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-base leading-snug font-bold text-[#1A1410] dark:text-white">
                    {title.trim() || "Untitled role"}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#1A1410]/50 dark:text-white/40">
                    <Building className="size-3.5 shrink-0" />
                    <span className="truncate">{company.trim() || "Company name"}</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <Badge
                    variant="outline"
                    className="rounded-full border-black/10 bg-[#FAF7F2] text-[11px] font-medium text-[#1A1410]/70 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
                  >
                    {jobTypeLabel}
                  </Badge>

                  {experience ? (
                    <Badge
                      variant="outline"
                      className="rounded-full border-black/10 bg-[#FAF7F2] text-[11px] font-medium text-[#1A1410]/70 dark:border-white/10 dark:bg-white/5 dark:text-white/60"
                    >
                      {experience}
                    </Badge>
                  ) : null}

                  {isRemote ? (
                    <Badge
                      variant="outline"
                      className="rounded-full border-brand/30 bg-brand/10 text-[11px] font-medium text-brand"
                    >
                      Remote
                    </Badge>
                  ) : null}
                </div>

                <Separator className="bg-black/5 dark:bg-white/10" />

                <dl className="space-y-2.5 text-xs">
                  <PreviewRow icon={Banknote} label="Pay">
                    {salaryLabel ? (
                      <span className="font-semibold text-[#1A1410] dark:text-white">
                        {salaryLabel}
                        <span className="font-normal text-[#1A1410]/45 dark:text-white/35">
                          {frequencyMeta.suffix}
                        </span>
                      </span>
                    ) : (
                      <span className="text-[#1A1410]/35 dark:text-white/30">
                        Not set
                      </span>
                    )}
                  </PreviewRow>

                  <PreviewRow icon={MapPin} label="Location">
                    {location.trim() || (isRemote ? "Remote" : "Not set")}
                  </PreviewRow>

                  <PreviewRow icon={CalendarDays} label="Category">
                    {category || "Not set"}
                  </PreviewRow>

                  <PreviewRow icon={CalendarClock} label="Closes">
                    {deadlineLabel ?? "Not set"}
                  </PreviewRow>
                </dl>
              </CardContent>

              <CardFooter className="flex-col items-stretch gap-2 border-black/5 bg-[#FAF7F2]/60 dark:border-white/10 dark:bg-white/[0.02]">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full gap-2 rounded-xl bg-brand text-sm font-semibold text-[#0A0A0A] shadow-lg shadow-brand/20 transition-colors hover:bg-brand-hover disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  {isSubmitting ? "Publishing..." : "Publish job"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDraft}
                  className="h-11 w-full gap-2 rounded-xl border-black/10 text-sm font-semibold dark:border-white/15"
                >
                  <Save className="size-4" />
                  Save as draft
                </Button>

                <p className="pt-1 text-center text-[11px] leading-5 text-[#1A1410]/40 dark:text-white/30">
                  You can edit or close this post anytime.
                </p>
              </CardFooter>
            </Card>
          </aside>
        </div>
      </form>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                              */
/* -------------------------------------------------------------------------- */

function SectionHeader({
  step,
  icon: Icon,
  title,
  description,
}: {
  step: string
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
        <p className="text-[10px] font-bold tracking-[0.2em] text-brand uppercase">
          Step {step}
        </p>
        <h2 className="mt-0.5 text-lg font-bold tracking-tight text-[#1A1410] dark:text-white">
          {title}
        </h2>
        <p className="mt-0.5 text-sm text-[#1A1410]/50 dark:text-white/40">
          {description}
        </p>
      </div>
    </div>
  )
}

function PreviewRow({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-1.5 text-[#1A1410]/45 dark:text-white/35">
        <Icon className="size-3.5 shrink-0" />
        {label}
      </dt>
      <dd className="min-w-0 truncate text-right text-[#1A1410]/80 dark:text-white/70">
        {children}
      </dd>
    </div>
  )
}
