"use client"

import * as React from "react"
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CircleCheck,
  ClipboardCheck,
  Clock3,
  FileText,
  Globe2,
  GraduationCap,
  HeartPulse,
  Home,
  ListChecks,
  MapPin,
  Rocket,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { CompanyMark } from "@/app/components/job-details/CompanyMark"
import {
  jobCardClassName,
  jobFieldLabelClassName,
} from "@/app/components/job-details/styles"
import {
  formatJobSalary,
  type BenefitIcon,
  type HighlightIcon,
  type JobDetail,
} from "@/lib/job-detail"
import { cn } from "@/lib/utils"

const TABS = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "requirements", label: "Requirements", icon: ClipboardCheck },
  { id: "responsibilities", label: "Responsibilities", icon: ListChecks },
  { id: "company", label: "Company Info", icon: Building2 },
  { id: "salary", label: "Salary & Benefits", icon: Wallet },
] as const

type TabId = (typeof TABS)[number]["id"]

const HIGHLIGHT_ICONS: Record<HighlightIcon, LucideIcon> = {
  company: Building2,
  type: BriefcaseBusiness,
  location: MapPin,
  experience: Clock3,
}

const BENEFIT_ICONS: Record<BenefitIcon, LucideIcon> = {
  health: HeartPulse,
  hours: Clock3,
  bonus: TrendingUp,
  learning: GraduationCap,
  remote: Home,
  leave: CalendarDays,
}

/** Distance in px from the right edge that still counts as "scrolled to end". */
const TAB_SCROLL_THRESHOLD = 8

export function JobDetailsTabs({ job }: { job: JobDetail }) {
  const [activeTab, setActiveTab] = React.useState<TabId>("overview")
  const [hasHiddenTabs, setHasHiddenTabs] = React.useState(true)
  const tabListRef = React.useRef<HTMLDivElement | null>(null)
  const tabRefs = React.useRef<
    Partial<Record<TabId, HTMLButtonElement | null>>
  >({})

  const activeTabConfig = TABS.find((tab) => tab.id === activeTab) ?? TABS[0]

  // The tab strip scrolls horizontally on small screens; track whether any tab
  // is still off-screen so the edge fade is only shown when it is useful.
  React.useEffect(() => {
    const list = tabListRef.current
    if (!list) return

    const updateOverflow = () => {
      const remaining = list.scrollWidth - list.clientWidth - list.scrollLeft
      setHasHiddenTabs(remaining > TAB_SCROLL_THRESHOLD)
    }

    list.addEventListener("scroll", updateOverflow, { passive: true })

    const resizeObserver = new ResizeObserver(updateOverflow)
    resizeObserver.observe(list)

    return () => {
      list.removeEventListener("scroll", updateOverflow)
      resizeObserver.disconnect()
    }
  }, [])

  function selectTab(tabId: TabId) {
    setActiveTab(tabId)
    tabRefs.current[tabId]?.scrollIntoView({
      inline: "nearest",
      block: "nearest",
      behavior: "smooth",
    })
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const currentIndex = TABS.findIndex((tab) => tab.id === activeTab)
    let nextIndex = currentIndex

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % TABS.length
        break
      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + TABS.length) % TABS.length
        break
      case "Home":
        nextIndex = 0
        break
      case "End":
        nextIndex = TABS.length - 1
        break
      default:
        return
    }

    event.preventDefault()

    const nextTab = TABS[nextIndex]
    setActiveTab(nextTab.id)

    const nextTabButton = tabRefs.current[nextTab.id]
    nextTabButton?.focus()
    nextTabButton?.scrollIntoView({
      inline: "nearest",
      block: "nearest",
      behavior: "smooth",
    })
  }

  return (
    <div className={cn(jobCardClassName, "min-w-0 overflow-hidden")}>
      <div className="relative">
        <div
          ref={tabListRef}
          role="tablist"
          aria-label="Job details sections"
          className="flex [scrollbar-width:none] gap-0.5 overflow-x-auto border-b border-black/[0.06] px-2 pt-2 sm:gap-1 sm:px-4 dark:border-white/[0.08] [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = tab.id === activeTab

            return (
              <button
                key={tab.id}
                ref={(node) => {
                  tabRefs.current[tab.id] = node
                }}
                id={`job-detail-tab-${tab.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`job-detail-panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => selectTab(tab.id)}
                onKeyDown={handleKeyDown}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 rounded-t-lg px-3 py-3 text-[13px] font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none focus-visible:ring-inset sm:text-sm",
                  isActive
                    ? "font-semibold text-[#1A1410] dark:text-white"
                    : "text-[#1A1410]/55 hover:bg-black/[0.03] hover:text-[#1A1410] dark:text-white/50 dark:hover:bg-white/[0.05] dark:hover:text-white"
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {tab.label}

                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-1.5 bottom-0 h-0.5 rounded-full bg-brand transition-opacity duration-200",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                />
              </button>
            )
          })}
        </div>

        {/* Mobile-only hint that the tab strip scrolls horizontally. */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 bottom-px w-10 bg-linear-to-l from-white to-transparent transition-opacity duration-200 sm:hidden dark:from-[#141110]",
            hasHiddenTabs ? "opacity-100" : "opacity-0"
          )}
        />
      </div>

      <div
        key={activeTab}
        id={`job-detail-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`job-detail-tab-${activeTab}`}
        tabIndex={0}
        className="animate-in p-5 duration-300 fade-in-0 slide-in-from-bottom-1 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none sm:p-7"
      >
        <span className="sr-only">{activeTabConfig.label}</span>

        {activeTab === "overview" && (
          <OverviewPanel job={job} onNavigate={setActiveTab} />
        )}
        {activeTab === "requirements" && <RequirementsPanel job={job} />}
        {activeTab === "responsibilities" && (
          <ResponsibilitiesPanel job={job} />
        )}
        {activeTab === "company" && <CompanyInfoPanel job={job} />}
        {activeTab === "salary" && <SalaryBenefitsPanel job={job} />}
      </div>
    </div>
  )
}

function OverviewPanel({
  job,
  onNavigate,
}: {
  job: JobDetail
  onNavigate: (tab: TabId) => void
}) {
  return (
    <div>
      <PanelHeading title="Job Overview" />

      {job.description.length > 0 ? (
        <div className="mt-4 space-y-4">
          {job.description.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="text-sm leading-7 text-[#1A1410]/75 dark:text-white/70"
            >
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <EmptyNote className="mt-4">
          No description has been provided for this role yet.
        </EmptyNote>
      )}

      <Divider />

      <SubHeading>Key Highlights</SubHeading>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        {job.highlights.map((highlight) => {
          const Icon = HIGHLIGHT_ICONS[highlight.icon]

          return (
            <div
              key={highlight.label}
              className="flex items-center gap-3 rounded-xl border border-black/[0.05] bg-[#FAF7F2] px-3.5 py-3 dark:border-white/[0.06] dark:bg-white/[0.03]"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <Icon className="size-4" aria-hidden="true" />
              </span>

              <div className="min-w-0">
                <dt className="text-[11px] font-medium tracking-wide text-[#1A1410]/45 uppercase dark:text-white/40">
                  {highlight.label}
                </dt>
                <dd className="mt-0.5 truncate text-sm font-semibold text-[#1A1410] dark:text-white/90">
                  {highlight.value}
                </dd>
              </div>
            </div>
          )
        })}
      </dl>

      {job.company.about.length > 0 && (
        <>
          <Divider />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <SubHeading>About the Company</SubHeading>

            <button
              type="button"
              onClick={() => onNavigate("company")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A1410] transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none dark:text-white dark:hover:text-brand"
            >
              Learn More
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>
          </div>

          <p className="mt-3 text-sm leading-7 text-[#1A1410]/75 dark:text-white/70">
            {job.company.about[0]}
          </p>
        </>
      )}

      {job.mission && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-brand/25 bg-brand/[0.06] px-4 py-3.5 dark:border-brand/25 dark:bg-brand/[0.08]">
          <Rocket
            className="mt-0.5 size-4 shrink-0 text-brand"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-[#1A1410] dark:text-white/90">
            {job.mission}
          </p>
        </div>
      )}
    </div>
  )
}

function RequirementsPanel({ job }: { job: JobDetail }) {
  const hasQualifications = job.qualifications.length > 0
  const hasSkills = job.skills.length > 0
  const hasNiceToHave = job.niceToHave.length > 0

  return (
    <div>
      <PanelHeading
        title="Requirements"
        description="What you'll need to succeed in this role."
      />

      {hasQualifications ? (
        <div className="mt-5">
          <SubHeading>Qualifications</SubHeading>

          <ul className="mt-3 space-y-2.5">
            {job.qualifications.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm leading-6 text-[#1A1410]/75 dark:text-white/70"
              >
                <CircleCheck
                  className="mt-0.5 size-4 shrink-0 text-brand"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !hasSkills &&
        !hasNiceToHave && (
          <EmptyNote className="mt-5">
            No requirements have been listed for this role yet.
          </EmptyNote>
        )
      )}

      {hasQualifications && (hasSkills || hasNiceToHave) && <Divider />}

      {hasSkills && (
        <>
          <SubHeading>Required Skills</SubHeading>

          <ul className="mt-3 flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-black/[0.07] bg-[#FAF7F2] px-3 py-1.5 text-xs font-medium text-[#1A1410]/75 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/75"
              >
                {skill}
              </li>
            ))}
          </ul>
        </>
      )}

      {hasSkills && hasNiceToHave && <Divider />}

      {hasNiceToHave && (
        <>
          <SubHeading>Nice to Have</SubHeading>

          <ul className="mt-3 space-y-2.5">
            {job.niceToHave.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm leading-6 text-[#1A1410]/70 dark:text-white/65"
              >
                <Sparkles
                  className="mt-0.5 size-4 shrink-0 text-brand/70"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function ResponsibilitiesPanel({ job }: { job: JobDetail }) {
  return (
    <div>
      <PanelHeading
        title="Responsibilities"
        description="The work you'll own on a typical week."
      />

      {job.responsibilities.length > 0 ? (
        <ol className="mt-5 divide-y divide-black/[0.06] dark:divide-white/[0.08]">
          {job.responsibilities.map((item, index) => (
            <li
              key={item}
              className="flex items-start gap-3.5 py-3.5 first:pt-0 last:pb-0"
            >
              <span className="mt-0.5 w-6 shrink-0 text-xs font-bold text-[#1A1410]/40 tabular-nums dark:text-white/35">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="text-sm leading-6 text-[#1A1410]/75 dark:text-white/70">
                {item}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <EmptyNote className="mt-5">
          No responsibilities have been listed for this role yet.
        </EmptyNote>
      )}
    </div>
  )
}

function CompanyInfoPanel({ job }: { job: JobDetail }) {
  const { company } = job

  const detailTiles: {
    icon: LucideIcon
    label: string
    value: string
    className?: string
  }[] = []

  if (company.industry) {
    detailTiles.push({
      icon: Building2,
      label: "Industry",
      value: company.industry,
    })
  }

  if (company.size) {
    detailTiles.push({
      icon: Users,
      label: "Company size",
      value: company.size,
    })
  }

  if (company.founded) {
    detailTiles.push({
      icon: CalendarDays,
      label: "Founded",
      value: company.founded,
    })
  }

  if (company.headquarters) {
    detailTiles.push({
      icon: MapPin,
      label: "Headquarters",
      value: company.headquarters,
    })
  }

  if (company.website) {
    detailTiles.push({
      icon: Globe2,
      label: "Website",
      value: company.website,
      className: "sm:col-span-2",
    })
  }

  const hasProfile =
    company.about.length > 0 ||
    detailTiles.length > 0 ||
    company.values.length > 0

  return (
    <div>
      <PanelHeading title="Company Info" />

      <div className="mt-5 flex items-start gap-4">
        <CompanyMark initials={company.initials} />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="text-lg font-bold tracking-tight text-[#1A1410] dark:text-white">
              {company.name}
            </h3>
            {company.verified && (
              <BadgeCheck
                className="size-4 text-brand"
                aria-label="Verified company"
              />
            )}
          </div>
          {company.tagline && (
            <p className="mt-0.5 text-sm text-[#1A1410]/60 dark:text-white/55">
              {company.tagline}
            </p>
          )}
        </div>
      </div>

      {company.about.length > 0 && (
        <div className="mt-4 space-y-3">
          {company.about.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              className="text-sm leading-7 text-[#1A1410]/75 dark:text-white/70"
            >
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {detailTiles.length > 0 && (
        <>
          <Divider />

          <SubHeading>Company details</SubHeading>

          <dl className="mt-3 grid gap-3 sm:grid-cols-2">
            {detailTiles.map((tile) => (
              <InfoTile
                key={tile.label}
                icon={tile.icon}
                label={tile.label}
                value={tile.value}
                className={tile.className}
              />
            ))}
          </dl>
        </>
      )}

      {company.values.length > 0 && (
        <>
          <Divider />

          <SubHeading>What we value</SubHeading>

          <ul className="mt-3 flex flex-wrap gap-2">
            {company.values.map((value) => (
              <li
                key={value}
                className="rounded-full border border-black/[0.07] bg-[#FAF7F2] px-3 py-1.5 text-xs font-medium text-[#1A1410]/75 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-white/75"
              >
                {value}
              </li>
            ))}
          </ul>
        </>
      )}

      {!hasProfile && (
        <EmptyNote className="mt-4">
          This company hasn&apos;t shared a profile yet.
        </EmptyNote>
      )}
    </div>
  )
}

function SalaryBenefitsPanel({ job }: { job: JobDetail }) {
  const salary = formatJobSalary(job)

  return (
    <div>
      <PanelHeading
        title="Salary & Benefits"
        description="Compensation and perks that come with the role."
      />

      <div className="mt-5 rounded-xl border border-brand/25 bg-brand/[0.06] p-4 sm:p-5 dark:border-brand/25 dark:bg-brand/[0.08]">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-[#1A1410]/50 uppercase dark:text-white/45">
          Salary range
        </p>

        <p className="mt-1.5 text-2xl font-bold tracking-tight text-[#1A1410] dark:text-white">
          {salary ?? "Salary not disclosed"}
          {job.salary && (
            <span className="ml-1.5 text-sm font-medium text-[#1A1410]/50 dark:text-white/45">
              / {job.salary.frequency}
            </span>
          )}
        </p>

        {job.salaryNote && (
          <p className="mt-2 text-xs leading-5 text-[#1A1410]/60 dark:text-white/55">
            {job.salaryNote}
          </p>
        )}
      </div>

      {job.benefits.length > 0 ? (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
            <SubHeading>Benefits &amp; Perks</SubHeading>
            <span className="text-xs text-[#1A1410]/45 dark:text-white/40">
              {job.benefits.length} benefits
            </span>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {job.benefits.map((benefit) => {
              const Icon = BENEFIT_ICONS[benefit.icon]

              return (
                <div
                  key={benefit.title}
                  className="rounded-xl border border-black/[0.05] bg-[#FAF7F2] p-3.5 dark:border-white/[0.06] dark:bg-white/[0.03]"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <p className="mt-2.5 text-sm font-semibold text-[#1A1410] dark:text-white/90">
                    {benefit.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#1A1410]/60 dark:text-white/55">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <EmptyNote className="mt-6">
          Benefit details are shared during the hiring process.
        </EmptyNote>
      )}
    </div>
  )
}

function PanelHeading({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span aria-hidden="true" className="h-5 w-1 rounded-full bg-brand" />
        <h2 className="text-lg font-bold tracking-tight text-[#1A1410] sm:text-xl dark:text-white">
          {title}
        </h2>
      </div>

      {description && (
        <p className="mt-2 text-sm leading-6 text-[#1A1410]/60 dark:text-white/55">
          {description}
        </p>
      )}
    </div>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[15px] font-bold tracking-tight text-[#1A1410] dark:text-white">
      {children}
    </h3>
  )
}

/** Quiet placeholder used when a real job has not filled in an optional section. */
function EmptyNote({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "text-sm leading-6 text-[#1A1410]/55 dark:text-white/50",
        className
      )}
    >
      {children}
    </p>
  )
}

function Divider() {
  return (
    <div
      aria-hidden="true"
      className="my-6 h-px w-full bg-black/[0.06] dark:bg-white/[0.08]"
    />
  )
}

function InfoTile({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: LucideIcon
  label: string
  value: string
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-xl border border-black/[0.05] bg-[#FAF7F2] px-3.5 py-3 dark:border-white/[0.06] dark:bg-white/[0.03]",
        className
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />

      <div className="min-w-0">
        <dt className={jobFieldLabelClassName}>{label}</dt>
        <dd className="mt-0.5 text-[13px] font-semibold break-words text-[#1A1410] dark:text-white/90">
          {value}
        </dd>
      </div>
    </div>
  )
}
