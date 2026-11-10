
"use client"

import type { FormEvent } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { AuthField, PasswordField } from "@/components/auth/auth-fields"
import { GoogleIcon } from "@/components/auth/google-icon"
import { getEmailError, getPasswordError } from "@/lib/auth-validation"
import { authClient } from "@/lib/auth-client"

const toastStyle =
  "!border-[#C66B24]/60 !bg-[#21180F] !text-[#FFF4E8]"

export function SignUpForm() {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")
    const confirmPassword = String(formData.get("confirmPassword") ?? "")
    const terms = formData.get("terms")

    if (!name) {
      toast.error("Enter your full name.", { className: toastStyle })
      return
    }

    const emailError = getEmailError(email)

    if (emailError) {
      toast.error(emailError, { className: toastStyle })
      return
    }

    const passwordError = getPasswordError(password)

    if (passwordError) {
      toast.error(passwordError, { className: toastStyle })
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", { className: toastStyle })
      return
    }

    if (!terms) {
      toast.error("Accept the Terms and Conditions to continue.", {
        className: toastStyle,
      })
      return
    }

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      })

      if (error) {
        toast.error(error.message || "Unable to create your account.", {
          className: toastStyle,
        })
        return
      }

      toast.success("Account created successfully!", {
        description: "Your Huntine account is ready.",
        className: toastStyle,
      })
    } catch {
      toast.error("Unable to create your account. Please try again.", {
        className: toastStyle,
      })
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-[13px]"
    >
      <div className="grid gap-[21px] md:grid-cols-2 md:gap-x-6 md:gap-y-0">
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
      </div>

      <div className="space-y-2">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
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
        </div>

        <p
          id="sign-up-password-hint"
          className="text-xs leading-5 text-[#1A1410]/60 dark:text-white/50"
        >
          At least 8 characters, including a letter and a number.
        </p>
      </div>

      <div className="mt-2 space-y-2">
        <label
          htmlFor="sign-up-terms"
          className="flex cursor-pointer items-start gap-2.5 text-sm leading-6 text-[#1A1410]/65 dark:text-white/60"
        >
          <input
            id="sign-up-terms"
            name="terms"
            type="checkbox"
            className="mt-1 size-4 shrink-0 cursor-pointer rounded-[4px] border-[#1A1410]/30 accent-brand dark:border-white/20"
          />
          <span>
            I agree to the{" "}
            <span className="font-medium text-brand">Terms and Conditions</span>{" "}
            and <span className="font-medium text-brand">Privacy Policy</span>.
          </span>
        </label>
      </div>

      <Button
        type="submit"
        className="group mt-3.5 h-11 w-full gap-2 rounded-full bg-brand bg-gradient-to-b from-orange-400 to-brand text-[13px] font-semibold tracking-[0.18em] text-[#0A0A0A] uppercase shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/30 hover:brightness-105 focus-visible:ring-brand/50"
      >
        Create Account
        <ArrowRight
          aria-hidden="true"
          className="size-4 transition-transform group-hover:translate-x-0.5"
        />
      </Button>

      <div className="mt-2.5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-px flex-1 bg-[#1A1410]/10 dark:bg-white/10"
        />
        <span className="text-[10px] font-medium tracking-[0.22em] text-[#1A1410]/50 uppercase dark:text-white/45">
          or continue with
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
          toast.info("Google sign-up is not connected yet.", {
            className: toastStyle,
          })
        }
        className="mt-1.5 h-11 w-full gap-3 rounded-full border-[#1A1410]/15 bg-transparent text-sm font-medium text-[#1A1410] hover:border-brand/50 hover:bg-brand/5 hover:text-[#1A1410] focus-visible:ring-brand/40 dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/5 dark:hover:text-white"
      >
        <GoogleIcon className="size-4" />
        Sign up with Google
      </Button>

      <p className="mt-1.5 text-center text-sm text-[#1A1410]/65 dark:text-white/60">
        Already have a Huntine account?{" "}
        <Link
          href="/sign-in"
          className="rounded-sm font-semibold text-brand underline-offset-4 transition-colors hover:text-brand-hover hover:underline focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
