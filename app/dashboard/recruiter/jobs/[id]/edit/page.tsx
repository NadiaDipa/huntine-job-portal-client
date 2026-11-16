import type { Metadata } from "next"

import { getJobById } from "@/app/api/jobs"
import { EditJobForm } from "@/app/components/EditJobForm"
import { JobPageState } from "@/app/components/JobPageState"
import type { JobDocument } from "@/lib/managed-jobs"

export const metadata: Metadata = {
  title: "Edit job post | Huntine",
  description:
    "Update the role details, compensation, and requirements for this job post.",
}

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let job: JobDocument | null = null
  let loadFailed = false

  try {
    job = await getJobById(id)
  } catch {
    loadFailed = true
  }

  if (loadFailed) {
    return <JobPageState variant="error" />
  }

  if (!job || !(job._id ?? job.id)) {
    return <JobPageState variant="missing" />
  }

  return <EditJobForm key={id} jobId={id} job={job} />
}
