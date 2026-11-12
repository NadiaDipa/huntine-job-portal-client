import type { Metadata } from "next"

import { SignUpFlow } from "@/components/auth/sign-up-flow"

export const metadata: Metadata = {
  title: "Join Huntine",
  description:
    "Create your Huntine account to save roles, follow companies, and find your next opportunity.",
}

const SignUpPage = () => {
  return <SignUpFlow />
}

export default SignUpPage
