"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AuthField, PasswordField } from "@/components/auth/auth-fields"
import { GoogleIcon } from "@/components/auth/google-icon"
import { getEmailError, getPasswordError } from "@/lib/auth-validation"

type SignUpValues = {
  fullName: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

type EditableField = "fullName" | "email" | "password" | "confirmPassword"
type SignUpErrors = Partial<Record<EditableField | "terms", string>>

function validate(values: SignUpValues): SignUpErrors {
  const errors: SignUpErrors = {}

  const fullName = values.fullName.trim()
  if (!fullName) {
    errors.fullName = "Enter your full name."
  } else if (fullName.length < 2) {
    errors.fullName = "Your name must be at least 2 characters."
  }

  const emailError = getEmailError(values.email)
  if (emailError) errors.email = emailError

  const passwordError = getPasswordError(values.password)
  if (passwordError) errors.password = passwordError

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm your password."
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match."
  }

  if (!values.terms) {
    errors.terms = "Accept the Terms and Conditions to continue."
  }

  return errors
}

export function SignUpForm() {
  const [values, setValues] = useState<SignUpValues>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })
  const [errors, setErrors] = useState<SignUpErrors>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [uiNotice, setUiNotice] = useState<string | null>(null)

  function updateField(field: EditableField, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSuccessMessage(null)
    setUiNotice(null)
  }

  function updateTerms(checked: boolean) {
    setValues((current) => ({ ...current, terms: checked }))
    setErrors((current) => ({ ...current, terms: undefined }))
    setSuccessMessage(null)
    setUiNotice(null)
  }

  function handleBlur(field: EditableField) {
    const nextErrors = validate(values)
    setErrors((current) => ({ ...current, [field]: nextErrors[field] }))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)
    setUiNotice(null)

    if (Object.keys(nextErrors).length > 0) {
      setSuccessMessage(null)
      return
    }

    // Deliberately frontend-only: no auth call, no storage, no real account.
    setSuccessMessage(
      "Everything looks good. This is a frontend-only demo — no account was created and no data was sent to a server."
    )
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-[13px]"
    >
      {/* Row 1: full name and email sit side by side on md+ to shorten the card. */}
      <div className="grid gap-[21px] md:grid-cols-2 md:gap-x-6 md:gap-y-0">
        <AuthField
          id="sign-up-name"
          label="Full Name"
          value={values.fullName}
          onChange={(value) => updateField("fullName", value)}
          onBlur={() => handleBlur("fullName")}
          error={errors.fullName}
          placeholder="Alex Morgan"
          autoComplete="name"
        />

        <AuthField
          id="sign-up-email"
          label="Email Address"
          type="email"
          value={values.email}
          onChange={(value) => updateField("email", value)}
          onBlur={() => handleBlur("email")}
          error={errors.email}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      {/* Row 2: password and confirm password share a row on md+. */}
      <div className="space-y-2">
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          <PasswordField
            id="sign-up-password"
            label="Password"
            value={values.password}
            onChange={(value) => updateField("password", value)}
            onBlur={() => handleBlur("password")}
            error={errors.password}
            describedBy="sign-up-password-hint"
            placeholder="Create a password"
            autoComplete="new-password"
          />

          <PasswordField
            id="sign-up-confirm-password"
            label="Confirm Password"
            value={values.confirmPassword}
            onChange={(value) => updateField("confirmPassword", value)}
            onBlur={() => handleBlur("confirmPassword")}
            error={errors.confirmPassword}
            describedBy="sign-up-password-hint"
            placeholder="Repeat your password"
            autoComplete="new-password"
          />
        </div>

        {/* The shared hint sits below both fields and spans the full width. */}
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
            checked={values.terms}
            onChange={(event) => updateTerms(event.target.checked)}
            required
            aria-invalid={errors.terms ? true : undefined}
            aria-describedby={errors.terms ? "terms-error" : undefined}
            className="mt-1 size-4 shrink-0 cursor-pointer rounded-[4px] border-[#1A1410]/30 accent-brand dark:border-white/20"
          />
          <span>
            I agree to the{" "}
            <span className="font-medium text-brand">Terms and Conditions</span>{" "}
            and <span className="font-medium text-brand">Privacy Policy</span>.
          </span>
        </label>
        {errors.terms ? (
          <p
            id="terms-error"
            role="alert"
            className="text-xs leading-5 text-destructive"
          >
            {errors.terms}
          </p>
        ) : null}
      </div>

      {uiNotice ? (
        <p
          role="status"
          className="rounded-2xl border border-[#1A1410]/10 bg-[#1A1410]/[0.03] px-4 py-3 text-xs leading-5 text-[#1A1410]/70 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/65"
        >
          {uiNotice}
        </p>
      ) : null}

      {successMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-3 rounded-2xl border border-brand/30 bg-brand/10 px-4 py-3"
        >
          <Check
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-brand"
          />
          <p className="text-xs leading-5 text-[#1A1410]/75 dark:text-white/70">
            {successMessage}
          </p>
        </div>
      ) : null}

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
        onClick={() => {
          setSuccessMessage(null)
          setUiNotice(
            "Google sign-up is not connected in this demo, so no Google account was used."
          )
        }}
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
