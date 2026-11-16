"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarClock,
  ClipboardList,
  Clock,
  GraduationCap,
  ListChecks,
  LoaderCircle,
  MapPin,
  Save,
  X,
  type LucideIcon,
} from "lucide-react"
import { toast } from "sonner"

import { updateJob, type UpdateJobPayload } from "@/app/api/jobs"
import { Button } from "@/components/ui/button"
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
import type { JobDocument } from "@/lib/managed-jobs"

type JobType = "full-time" | "part-time" | "contract" | "internship"
type Frequency = "hour" | "day" | "month" | "year"

const JOB_TYPES: {
  value: JobType
  label: string
  hint: string
  icon: LucideIcon
}[] = [
  {
    value: "full-time",
    label: "Full time",
    hint: "40 hrs / week",
    icon: BriefcaseBusiness,
  },
  {
    value: "part-time",
    label: "Part time",
    hint: "Flexible hours",
    icon: Clock,
  },
  {
    value: "contract",
    label: "Contract",
    hint: "Fixed term",
    icon: ClipboardList,
  },
  {
    value: "internship",
    label: "Internship",
    hint: "Learning role",
    icon: GraduationCap,
  },
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

const FREQUENCIES: { value: Frequency; label: string; suffix: string }[] = [
  { value: "hour", label: "Per hour", suffix: "/hr" },
  { value: "day", label: "Per day", suffix: "/day" },
  { value: "month", label: "Per month", suffix: "/mo" },
  { value: "year", label: "Per year", suffix: "/yr" },
]

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

function asJobType(value?: string): JobType {
  const normalized = value?.toLowerCase()

  return normalized === "part-time" ||
    normalized === "contract" ||
    normalized === "internship"
    ? normalized
    : "full-time"
}

function asFrequency(value?: string): Frequency {
  const normalized = value?.toLowerCase()

  return normalized === "hour" ||
    normalized === "day" ||
    normalized === "month" ||
    normalized === "year"
    ? normalized
    : "month"
}

function toDateInput(value?: string | null) {
  if (!value) return ""

  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
  if (dateOnly) {
    return `${dateOnly[1]}-${dateOnly[2]}-${dateOnly[3]}`
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""

  return date.toISOString().slice(0, 10)
}

function parseSalaryRange(value?: string) {
  const numbers = value?.match(/\d[\d,.]*/g)

  if (!numbers || numbers.length < 2) return null

  const min = Number(numbers[0].replace(/,/g, ""))
  const max = Number(numbers[1].replace(/,/g, ""))

  if (!Number.isFinite(min) || !Number.isFinite(max)) return null

  return { min: String(min), max: String(max) }
}

function getInitialCompensation(job: JobDocument) {
  if (
    typeof job.compensation?.min === "number" &&
    typeof job.compensation?.max === "number"
  ) {
    return {
      currency: job.compensation.currency ?? "USD",
      min: String(job.compensation.min),
      max: String(job.compensation.max),
      frequency: asFrequency(job.compensation.frequency),
    }
  }

  const salaryRange = parseSalaryRange(job.salary)

  return {
    currency: "BDT",
    min: salaryRange?.min ?? "",
    max: salaryRange?.max ?? "",
    frequency: "month" as Frequency,
  }
}

function findCurrency(value: string) {
  return CURRENCIES.find((item) => item.value === value) ?? CURRENCIES[0]
}

function findFrequency(value: string) {
  return FREQUENCIES.find((item) => item.value === value) ?? FREQUENCIES[0]
}

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

type FieldProps = Omit<FieldShellProps, "children">

function TextField({
  id,
  label,
  hint,
  error,
  className,
  ...inputProps
}: FieldProps & React.ComponentProps<"input">) {
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      className={className}
    >
      <Input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={cn(inputClassName, error && errorFieldClassName)}
        {...inputProps}
      />
    </FieldShell>
  )
}

function TextAreaField({
  id,
  label,
  hint,
  error,
  className,
  ...textareaProps
}: FieldProps & React.ComponentProps<"textarea">) {
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      className={className}
    >
      <Textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className={cn(textareaClassName, error && errorFieldClassName)}
        {...textareaProps}
      />
    </FieldShell>
  )
}

export function EditJobForm({
  jobId,
  job,
}: {
  jobId: string
  job: JobDocument
}) {
  const router = useRouter()
  const initialCompensation = getInitialCompensation(job)

  const [title, setTitle] = useState(job.title ?? "")
  const [company, setCompany] = useState(job.company ?? "")
  const [category, setCategory] = useState(job.category ?? "")
  const [experience, setExperience] = useState(job.experienceLevel ?? "")
  const [jobType, setJobType] = useState<JobType>(asJobType(job.jobType))

  const [isRemote, setIsRemote] = useState(
    Boolean(job.isRemote) || /^remote$/i.test(job.location?.trim() ?? "")
  )
  const [location, setLocation] = useState(job.location ?? "")
  const [deadline, setDeadline] = useState(toDateInput(job.applicationDeadline))
  const [currency, setCurrency] = useState(
    findCurrency(initialCompensation.currency).value
  )
  const [frequency, setFrequency] = useState<Frequency>(
    initialCompensation.frequency
  )
  const [minSalary, setMinSalary] = useState(initialCompensation.min)
  const [maxSalary, setMaxSalary] = useState(initialCompensation.max)

  const [responsibilities, setResponsibilities] = useState(
    (job.responsibilities ?? []).join("\n")
  )
  const [qualifications, setQualifications] = useState(
    (job.qualifications ?? job.requirements ?? []).join("\n")
  )

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categoryOptions =
    category && !JOB_CATEGORIES.includes(category)
      ? [category, ...JOB_CATEGORIES]
      : JOB_CATEGORIES

  const experienceOptions =
    experience && !EXPERIENCE_LEVELS.includes(experience)
      ? [experience, ...EXPERIENCE_LEVELS]
      : EXPERIENCE_LEVELS

  function clearError(field: string) {
    setErrors((current) => {
      if (!current[field]) return current

      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function collectPayload(): UpdateJobPayload {
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
    }
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
    else if (!Number.isFinite(min) || min < 0) {
      next.minSalary = "Enter a valid number."
    }

    if (!maxSalary.trim()) next.maxSalary = "Add a maximum rate."
    else if (!Number.isFinite(max) || max < 0) {
      next.maxSalary = "Enter a valid number."
    } else if (minSalary.trim() && Number.isFinite(min) && max < min) {
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

    const payload = collectPayload()
    const nextErrors = validate()
    setErrors(nextErrors)

    const errorFields = Object.keys(nextErrors)

    if (errorFields.length > 0) {
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

    try {
      await updateJob(jobId, payload)

      toast.success("Job updated", {
        description: `${payload.title} has been updated successfully.`,
      })

      router.push(`/dashboard/recruiter/jobs/${jobId}`)
      router.refresh()
    } catch (error) {
      toast.error("Could not update job", {
        description:
          error instanceof Error ? error.message : "Something went wrong.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleCancel() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
      return
    }

    router.push(`/dashboard/recruiter/jobs/${jobId}`)
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            href={`/dashboard/recruiter/jobs/${jobId}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1A1410]/50 transition-colors hover:text-brand dark:text-white/40 dark:hover:text-brand"
          >
            <ArrowLeft className="size-3.5" />
            Back to job details
          </Link>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-[#1A1410] sm:text-3xl dark:text-white">
            Edit job post
          </h1>
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#1A1410]/55 dark:text-white/50">
            Update the role details, compensation, and requirements. Changes go
            live as soon as you save.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="space-y-6">
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
                    items={categoryOptions.map((item) => ({
                      value: item,
                      label: item,
                    }))}
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
                      {categoryOptions.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category ? (
                    <p
                      id="category-error"
                      role="alert"
                      className={errorClassName}
                    >
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
                    items={experienceOptions.map((item) => ({
                      value: item,
                      label: item,
                    }))}
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
                      {experienceOptions.map((item) => (
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
                  placeholder={
                    isRemote ? "Remote — worldwide" : "Dhaka, Bangladesh"
                  }
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
                    if (!event.currentTarget.min) {
                      event.currentTarget.min = new Date()
                        .toISOString()
                        .slice(0, 10)
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
                    onValueChange={(value) =>
                      setFrequency(asFrequency(value ?? "month"))
                    }
                  >
                    <SelectTrigger
                      id="frequency"
                      className="h-11 w-full rounded-xl border-black/10 bg-[#FAF7F2]/70 px-3.5 text-sm dark:border-white/10 dark:bg-white/5"
                    >
                      <SelectValue placeholder="Per month" />
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
                      value={findCurrency(currency).value}
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
                  placeholder={
                    "Build and ship features for the hiring platform\nReview pull requests and mentor junior engineers\nCollaborate with design and product on new flows"
                  }
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
                  placeholder={
                    "4+ years building production React applications\nStrong TypeScript and testing habits\nClear written communication in English"
                  }
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
          </div>

          <aside className="lg:sticky lg:top-6">
            <section className={cn(cardClassName, "p-5")}>
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/25">
                  <Save className="size-4" />
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#1A1410] dark:text-white">
                    Save your changes
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-[#1A1410]/50 dark:text-white/40">
                    The job document is updated in place. No new post is
                    created.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full gap-2 rounded-xl bg-brand text-sm font-semibold text-[#0A0A0A] shadow-lg shadow-brand/20 transition-colors hover:bg-brand-hover disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Save className="size-4" />
                  )}
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="h-11 w-full gap-2 rounded-xl border-black/10 text-sm font-semibold dark:border-white/15"
                >
                  <X className="size-4" />
                  Cancel
                </Button>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-black/5 bg-[#FAF7F2]/70 p-3 text-[11px] leading-5 text-[#1A1410]/45 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/35">
                <CalendarClock className="size-3.5 shrink-0" />
                <span>
                  Changes appear on the job details page right after saving.
                </span>
              </div>
            </section>
          </aside>
        </div>
      </form>
    </div>
  )
}

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
