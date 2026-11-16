"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"

type FilterOption = {
  label: string
  count: number
}

const JOB_TYPE_OPTIONS: FilterOption[] = [
  { label: "Full-Time", count: 17 },
  { label: "Part-Time", count: 4 },
  { label: "Contract", count: 2 },
  { label: "Internship", count: 2 },
]

const JOB_CATEGORY_OPTIONS: FilterOption[] = [
  { label: "Engineering & Tech", count: 1 },
  { label: "Design", count: 4 },
  { label: "Product", count: 1 },
  { label: "Marketing", count: 3 },
  { label: "Infrastructure", count: 0 },
  { label: "Quality", count: 0 },
]

function toFieldId(section: string, label: string) {
  return `${section}-${label}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function FilterSection({
  title,
  options,
  handleCheckboxChange,
}: {
  title: string
  options: FilterOption[]
  handleCheckboxChange: (name: string, value: boolean) => void
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
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(option.label, checked === true)
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

export function BrowseJobsFilters({ className }: { className?: string }) {

  const router = useRouter();
  const searchParams = useSearchParams();



  const handleCheckboxChange = (name: string, value: boolean) => {
    console.log(name, value)

    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(name, "true")
    } else {
      params.delete(name)
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
          options={JOB_TYPE_OPTIONS}
          handleCheckboxChange={handleCheckboxChange}
        />

        <FilterSection
          title="Job Category"
          options={JOB_CATEGORY_OPTIONS}
          handleCheckboxChange={handleCheckboxChange}
        />
      </div>
    </aside>
  )
}
