import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { SignInForm } from "@/components/auth/sign-in-form"
import { HuntineChip } from "@/components/brand/huntine-chip"

export const metadata: Metadata = {
  title: "Sign In | Huntine",
  description: "Sign in to your Huntine account to keep your job hunt moving.",
}

const SignInPage = () => {
  return (
    <AuthShell
      eyebrow="Member access"
      title={
        <>
          Welcome back to <HuntineChip />
        </>
      }
      description="Sign in to pick up where you left off."
    >
      <SignInForm />
    </AuthShell>
  )
}

export default SignInPage
