import type { Metadata } from "next"

import { BrowseJobsFilters } from "@/app/components/BrowseJobsFilters"
import { BrowseJobsSearch } from "@/app/components/BrowseJobsSearch"
import { getJobs } from "@/app/api/jobs"
import { JobCard } from "../components/JobCard"

export const metadata: Metadata = {
  title: "Browse Jobs | Huntine",
  description: "Search open roles and narrow them down with filters.",
}

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

  // Fetch the filtered list plus the unfiltered set used for facet counts, so
  // the sidebar can still switch to a category that the current filter hides.
  const [jobs, allJobs] = await Promise.all([
    getJobs(query),
    query ? getJobs() : Promise.resolve(null),
  ])

  const facetJobs = allJobs ?? jobs

  return (
    <main className="min-h-svh bg-[#FAF7F2] pb-16 dark:bg-[#0A0908]">
      <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <h1 className="sr-only">Browse Jobs</h1>

        <BrowseJobsSearch />

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start xl:gap-8">
          <BrowseJobsFilters
            jobs={facetJobs.map((job) => ({
              jobType: job.jobType,
              category: job.category,
            }))}
            className="lg:sticky lg:top-24"
          />

          <section aria-labelledby="browse-jobs-results-heading">
            <h2
              id="browse-jobs-results-heading"
              className="text-xl font-semibold tracking-tight text-[#1A1410] dark:text-white"
            >
              Found {jobs.length} Professional Jobs
            </h2>

            {jobs.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {jobs.map((job) => (
                  <JobCard key={job._id ?? job.id} job={job} />
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-xl border border-black/[0.06] bg-white px-5 py-6 text-sm text-[#1A1410]/55 dark:border-white/[0.06] dark:bg-[#141110] dark:text-white/50">
                No jobs match these filters yet. Try clearing the search or
                choosing a different category.
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
