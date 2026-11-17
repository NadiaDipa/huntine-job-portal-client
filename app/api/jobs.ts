import type { JobPayload } from "@/app/components/NewJobForm"
import type { JobDocument } from "@/lib/managed-jobs"

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

export type UpdateJobPayload = Omit<JobPayload, "createdAt">

// Fetch all jobs (with optional query parameters)
export const getJobs = async (query = ""): Promise<JobDocument[]> => {
  const res = await fetch(`${BASE_URL}/jobs?${query}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to load jobs")
  }

  return res.json()
}

// Fetch a single job by ID
export const getJobById = async (id: string): Promise<JobDocument> => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to load job")
  }

  return res.json()
}

// Create a new job
export const createJob = async (data: JobPayload) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Failed to create job")
  }

  return res.json()
}

// Update an existing job
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

// Delete a job
export const deleteJob = async (id: string) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    throw new Error("Failed to delete job")
  }

  return res.json()
}
