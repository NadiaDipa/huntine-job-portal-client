"use client"

import type { FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { AuthField, PasswordField } from "@/components/auth/auth-fields"
import { GoogleIcon } from "@/components/auth/google-icon"
import { getEmailError, getPasswordError } from "@/lib/auth-validation"
import { ROLE_OPTIONS, type UserRole } from "@/lib/roles"
import { authClient } from "@/lib/auth-client"

type SignUpFormProps = {
  selectedRole: UserRole | null
  onBack: () => void
}

export function SignUpForm({ selectedRole, onBack }: SignUpFormProps) {
  const router = useRouter()
  const selectedRoleLabel = ROLE_OPTIONS.find(
    (option) => option.value === selectedRole
  )?.label

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")
    const confirmPassword = String(formData.get("confirmPassword") ?? "")
    const terms = formData.get("terms")

    if (!name) {
      toast.error("Enter your full name.")
      return
    }

    const emailError = getEmailError(email)

    if (emailError) {
      toast.error(emailError)
      return
    }

    const passwordError = getPasswordError(password)

    if (passwordError) {
      toast.error(passwordError)
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    if (!terms) {
      toast.error("Accept the Terms and Conditions to continue.")
      return
    }

    if (!selectedRole) {
      toast.error("Select your role to continue.")
      return
    }

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        role: selectedRole,
      })

      if (error) {
        toast.error(error.message || "Unable to create your account.")
        return
      }

      // The global Toaster in the root layout keeps this toast visible while
      // the router moves the user over to the sign-in page.
      toast.success("Account created successfully!", {
        description: "Your account is ready. Please sign in to continue.",
        duration: 6000,
      })

      router.replace("/sign-in")
    } catch {
      toast.error("Unable to create your account. Please try again.")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center gap-1.5 rounded-full text-xs font-medium text-[#1A1410]/65 transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none dark:text-white/60 dark:hover:text-brand"
        >
          <ArrowLeft
            aria-hidden="true"
            className="size-4 transition-transform group-hover:-translate-x-0.5"
          />
          Back
        </button>

        {selectedRoleLabel ? (
          <span className="text-xs text-[#1A1410]/55 dark:text-white/45">
            Joining as{" "}
            <span className="font-semibold text-brand">
              {selectedRoleLabel}
            </span>
          </span>
        ) : null}
      </div>

      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AuthField
          id="sign-up-name"
          name="name"
          label="Full Name"
          placeholder="Alex Morgan"
          autoComplete="name"
        />

        <AuthField
          id="sign-up-email"
          name="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />

        <PasswordField
          id="sign-up-password"
          name="password"
          label="Password"
          describedBy="sign-up-password-hint"
          placeholder="Create a password"
          autoComplete="new-password"
        />

        <PasswordField
          id="sign-up-confirm-password"
          name="confirmPassword"
          label="Confirm Password"
          describedBy="sign-up-password-hint"
          placeholder="Repeat your password"
          autoComplete="new-password"
        />

        <p
          id="sign-up-password-hint"
          className="-mt-1 text-xs leading-5 text-[#1A1410]/60 dark:text-white/50"
        >
          At least 8 characters, including a letter and a number.
        </p>

        <label
          htmlFor="sign-up-terms"
          className="mt-1 flex cursor-pointer items-start gap-2.5 text-[13px] leading-5 text-[#1A1410]/65 dark:text-white/60"
        >
          <input
            id="sign-up-terms"
            name="terms"
            type="checkbox"
            className="mt-0.5 size-4 shrink-0 cursor-pointer rounded-[4px] border-[#1A1410]/30 accent-brand dark:border-white/20"
          />
          <span>
            I agree to the{" "}
            <span className="font-medium text-[#1A1410] underline decoration-brand/60 underline-offset-2 dark:text-brand dark:decoration-brand/40">
              Terms and Conditions
            </span>{" "}
            and{" "}
            <span className="font-medium text-[#1A1410] underline decoration-brand/60 underline-offset-2 dark:text-brand dark:decoration-brand/40">
              Privacy Policy
            </span>
            .
          </span>
        </label>

        <Button
          type="submit"
          className="group mt-1 h-12 w-full gap-2 rounded-full bg-brand text-sm font-semibold text-[#0A0A0A] shadow-lg shadow-brand/20 transition-colors hover:bg-brand-hover focus-visible:ring-brand/50"
        >
          Create Account
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </Button>

        <div className="mt-1 flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-px flex-1 bg-[#1A1410]/10 dark:bg-white/10"
          />
          <span className="text-xs text-[#1A1410]/50 dark:text-white/45">
            or
          </span>
          <span
            aria-hidden="true"
            className="h-px flex-1 bg-[#1A1410]/10 dark:bg-white/10"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            toast.info("Google sign-up is not connected yet.")
          }
          className="h-11 w-full gap-3 rounded-full border-[#1A1410]/15 bg-transparent text-sm font-medium text-[#1A1410] hover:border-brand/50 hover:bg-brand/5 hover:text-[#1A1410] focus-visible:ring-brand/40 dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/5 dark:hover:text-white"
        >
          <GoogleIcon className="size-4" />
          Sign up with Google
        </Button>

        <p className="text-center text-[13px] text-[#1A1410]/65 dark:text-white/60">
          Already have a Huntine account?{" "}
          <Link
            href="/sign-in"
            className="rounded-sm font-semibold text-brand underline-offset-4 transition-colors hover:text-brand-hover hover:underline focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
