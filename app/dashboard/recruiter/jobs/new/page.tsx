import type { Metadata } from "next"

import { NewJobForm } from "@/app/components/NewJobForm"

export const metadata: Metadata = {
  title: "Post a new job | Huntine",
  description:
    "Create a job posting with role details, compensation and requirements.",
}

export default function NewJobPage() {
  return <NewJobForm />
}
