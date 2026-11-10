import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { HuntineChip } from "@/components/brand/huntine-chip"

export const metadata: Metadata = {
  title: "Create Account | Huntine",
  description:
    "Create your Huntine account to save roles, follow companies, and find your next opportunity.",
}

const SignUpPage = () => {
  return (
    <AuthShell
      mirrorBackground
      eyebrow="New member"
      title={
        <>
          Create your <HuntineChip /> account
        </>
      }
      description="Save roles, follow companies and find work that fits you."
    >
      <SignUpForm />
    </AuthShell>
  )
}

export default SignUpPage
