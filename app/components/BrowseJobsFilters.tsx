"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { JobDocument } from "@/lib/managed-jobs"
import { useRouter, useSearchParams } from "next/navigation"

type FilterOption = {
  label: string
  count: number
}

type FilterJob = Pick<JobDocument, "jobType" | "category">

const JOB_TYPE_ORDER = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
]

/** Builds de-duplicated filter options with counts from the current API result. */
function buildOptions(
  values: (string | undefined)[],
  preferredOrder: string[] = []
): FilterOption[] {
  const counts = new Map<string, { label: string; count: number }>()

  values.forEach((rawValue) => {
    const label = rawValue?.trim()
    if (!label) return

    const key = label.toLowerCase()
    const existing = counts.get(key)

    if (existing) {
      existing.count += 1
    } else {
      counts.set(key, { label, count: 1 })
    }
  })

  const rank = (label: string) => {
    const index = preferredOrder.findIndex(
      (entry) => entry.toLowerCase() === label.toLowerCase()
    )
    return index === -1 ? preferredOrder.length : index
  }

  return Array.from(counts.values()).sort(
    (a, b) => rank(a.label) - rank(b.label) || a.label.localeCompare(b.label)
  )
}

function toFieldId(section: string, label: string) {
  return `${section}-${label}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function FilterSection({
  title,
  options,
  filterKey,
  selectedValue,
  handleCheckboxChange,
}: {
  title: string
  options: FilterOption[]
  filterKey: string
  selectedValue: string | null
  handleCheckboxChange: (key: string, name: string, value: boolean) => void
}) {
  return (
    <section>
      <h3 className="text-[13px] font-semibold text-[#1A1410] dark:text-white">
        {title}
      </h3>

      <ul className="mt-3.5 space-y-3">
        {options.map((option) => {
          const id = toFieldId(title, option.label)

          return (
            <li key={option.label}>
              <label
                htmlFor={id}
                className="flex cursor-pointer items-center justify-between gap-3 text-[13px] text-[#1A1410]/60 transition-colors hover:text-[#1A1410] dark:text-white/55 dark:hover:text-white"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <Checkbox
                    id={id}
                    checked={selectedValue === option.label}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        filterKey,
                        option.label,
                        checked === true
                      )
                    }
                    className="size-4 rounded-[3px] border-black/15 bg-transparent dark:border-white/15 dark:bg-white/[0.03] data-checked:border-[#1A1410] data-checked:bg-[#1A1410] data-checked:text-white dark:data-checked:border-white dark:data-checked:bg-white dark:data-checked:text-[#0A0807]"
                  />

                  <span id={`${id}-label`} className="truncate">
                    {option.label}
                  </span>
                </span>

                <span className="shrink-0 text-xs text-[#1A1410]/35 tabular-nums dark:text-white/30">
                  {option.count}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export function BrowseJobsFilters({
  jobs,
  className,
}: {
  jobs: FilterJob[]
  className?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const jobTypeOptions = buildOptions(
    jobs.map((job) => job.jobType),
    JOB_TYPE_ORDER
  )
  const categoryOptions = buildOptions(jobs.map((job) => job.category))

  const handleCheckboxChange = (key: string, name: string, value: boolean) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, name)
    } else {
      params.delete(key)
    }

    router.push(`/browse-jobs?${params.toString()}`)
  }

  return (
    <aside
      aria-label="Job filters"
      className={cn(
        "rounded-xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(16,10,6,0.03)] dark:border-white/[0.06] dark:bg-[#141110] dark:shadow-none",
        className
      )}
    >
      <h2 className="text-xl font-semibold tracking-tight text-[#1A1410] dark:text-white">
        Filters
      </h2>

      <div className="mt-6 space-y-7">
        <FilterSection
          title="Job Type"
          options={jobTypeOptions}
          filterKey="jobType"
          selectedValue={searchParams.get("jobType")}
          handleCheckboxChange={handleCheckboxChange}
        />

        <FilterSection
          title="Job Category"
          options={categoryOptions}
          filterKey="category"
          selectedValue={searchParams.get("category")}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>
    </aside>
  )
}
