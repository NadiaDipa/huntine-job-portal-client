import Link from "next/link"

import type { JobDocument } from "@/lib/managed-jobs"

type JobCardProps = {
  job: JobDocument
}

export function JobCard({ job }: JobCardProps) {
  return (
    <li>
      <Link href={`/browse-jobs/${job._id ?? job.id}`}>
        <article className="rounded-xl border border-black/[0.06] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(16,10,6,0.03)] transition-colors hover:border-black/10 dark:border-white/[0.06] dark:bg-[#141110] dark:shadow-none dark:hover:border-white/10">
          <h3 className="text-base font-semibold text-[#1A1410] dark:text-white">
            {job.title}
          </h3>

          <p className="mt-1 text-[13px] text-[#1A1410]/45 dark:text-white/40">
            {job.company}
            {job.location && (
              <>
                <span aria-hidden="true" className="px-1.5">
                  •
                </span>
                {job.location}
              </>
            )}
          </p>
        </article>
      </Link>
    </li>
  )
}
