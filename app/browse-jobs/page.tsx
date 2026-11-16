import type { Metadata } from "next"

import { BrowseJobsFilters } from "@/app/components/BrowseJobsFilters"
import { BrowseJobsSearch } from "@/app/components/BrowseJobsSearch"
import { getJobs } from "@/app/api/jobs"

export const metadata: Metadata = {
  title: "Browse Jobs | Huntine",
  description: "Search open roles and narrow them down with filters.",
}

const panelClassName =
  "rounded-xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(16,10,6,0.03)] dark:border-white/[0.06] dark:bg-[#141110] dark:shadow-none"

export default async function BrowseJobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) {
  const search = await searchParams

  const urlSearch = new URLSearchParams()

  Object.entries(search).forEach(([key, value]) => {
    if (typeof value === "string") {
      urlSearch.set(key, value)
    }
  })

  const query = urlSearch.toString()

  const jobs = await getJobs(query)

  return (
    <main className="min-h-svh bg-[#FAF7F2] pb-16 dark:bg-[#0A0908]">
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <h1 className="sr-only">Browse Jobs</h1>

        <BrowseJobsSearch />

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start xl:gap-8">
          <BrowseJobsFilters className="lg:sticky lg:top-24" />

          <section aria-labelledby="browse-jobs-results-heading">
            <h2
              id="browse-jobs-results-heading"
              className="text-xl font-semibold tracking-tight text-[#1A1410] dark:text-white"
            >
              Found {jobs.length} Professional Jobs
            </h2>

            <ul className="mt-4 space-y-3">
              {jobs.map((job) => (
                <li key={job._id ?? job.id}>
                  <article
                    className={`${panelClassName} px-5 py-4 transition-colors hover:border-black/10 dark:hover:border-white/10`}
                  >
                    <h3 className="text-base font-semibold text-[#1A1410] dark:text-white">
                      {job.title}
                    </h3>

                    <p className="mt-1 text-[13px] text-[#1A1410]/45 dark:text-white/40">
                      {job.company}
                      <span
                        aria-hidden="true"
                        className="px-1.5 text-[#1A1410]/25 dark:text-white/20"
                      >
                        •
                      </span>
                      {job.location}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}
