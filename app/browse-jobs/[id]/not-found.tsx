import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Job not found | Huntine",
  description: "This job post could not be found on Huntine.",
}

export default function JobNotFound() {
  return (
    <main className="min-h-svh bg-[#FAF7F2] pb-16 dark:bg-[#0A0908]">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <Link
          href="/browse-jobs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1A1410]/55 transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:outline-none dark:text-white/50 dark:hover:text-brand"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Browse Jobs
        </Link>

        <section className="mx-auto mt-6 flex w-full max-w-3xl flex-col items-center rounded-3xl border border-black/[0.06] bg-white px-6 py-14 text-center shadow-[0_1px_2px_rgba(16,10,6,0.04),0_24px_60px_-40px_rgba(16,10,6,0.35)] dark:border-white/[0.08] dark:bg-[#141110] dark:shadow-none">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/25">
            <SearchX className="size-6" aria-hidden="true" />
          </span>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#1A1410] dark:text-white">
            We couldn&apos;t find that job
          </h1>

          <p className="mt-2 max-w-md text-sm leading-6 text-[#1A1410]/60 dark:text-white/55">
            This job post may have been removed, or the link is incorrect.
            Browse the open roles to find something that fits.
          </p>

          <Button
            render={<Link href="/browse-jobs" />}
            nativeButton={false}
            className="mt-6 h-11 gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-[#0A0A0A] shadow-lg shadow-brand/20 transition-colors hover:bg-brand-hover"
          >
            Browse all jobs
          </Button>
        </section>
      </div>
    </main>
  )
}
