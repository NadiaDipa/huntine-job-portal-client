import type { JobPayload } from "@/app/components/NewJobForm"
import type { JobDocument } from "@/lib/managed-jobs"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export type UpdateJobPayload = Omit<JobPayload, "createdAt">

export const getJobs = async (): Promise<JobDocument[]> => {
  const res = await fetch(`${BASE_URL}/jobs`, { cache: "no-store" })

  if (!res.ok) {
    throw new Error("Failed to load jobs")
  }

  return res.json()
}

export const getJobById = async (id: string): Promise<JobDocument | null> => {
  const documents = await getJobs()

  return documents.find((job) => (job._id ?? job.id) === id) ?? null
}

export const updateJob = async (id: string, data: UpdateJobPayload) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)

    throw new Error(body?.message || "Failed to update job")
  }

  return res.json()
}

export const deleteJob = async (id: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error("Failed to delete job")
  }

  return res.json()
}
