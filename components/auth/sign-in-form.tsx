"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AuthField, PasswordField } from "@/components/auth/auth-fields"
import { GoogleIcon } from "@/components/auth/google-icon"
import { getEmailError, getPasswordError } from "@/lib/auth-validation"

type SignInValues = {
  email: string
  password: string
  rememberMe: boolean
}

type EditableField = "email" | "password"
type SignInErrors = Partial<Record<EditableField, string>>

function validate(values: SignInValues): SignInErrors {
  const errors: SignInErrors = {}

  const emailError = getEmailError(values.email)
  if (emailError) errors.email = emailError

  const passwordError = getPasswordError(values.password)
  if (passwordError) errors.password = passwordError

  return errors
}

export function SignInForm() {
  const [values, setValues] = useState<SignInValues>({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState<SignInErrors>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [uiNotice, setUiNotice] = useState<string | null>(null)

  function updateField(field: EditableField, value: string) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
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

    // Deliberately frontend-only: no auth call, no storage, no real session.
    setSuccessMessage(
      "Everything looks good. This is a frontend-only demo — no session was created and no credentials were sent anywhere."
    )
  }

  return (
    // 13px base gap; the short margins below add back the intended spacing.
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-[13px]"
    >
      <AuthField
        id="sign-in-email"
        label="Email Address"
        type="email"
        value={values.email}
        onChange={(value) => updateField("email", value)}
        onBlur={() => handleBlur("email")}
        error={errors.email}
        placeholder="you@example.com"
        autoComplete="email"
      />

      <PasswordField
        id="sign-in-password"
        label="Password"
        value={values.password}
        onChange={(value) => updateField("password", value)}
        onBlur={() => handleBlur("password")}
        error={errors.password}
        placeholder="Enter your password"
        autoComplete="current-password"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label
          htmlFor="remember-me"
          className="flex cursor-pointer items-center gap-2.5 text-sm text-[#1A1410]/65 dark:text-white/60"
        >
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            checked={values.rememberMe}
            // Remember Me is kept in component state only; nothing is persisted.
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                rememberMe: event.target.checked,
              }))
            }
            className="size-4 cursor-pointer rounded-[4px] border-[#1A1410]/30 accent-brand dark:border-white/20"
          />
          Remember me
        </label>

        <button
          type="button"
          onClick={() => {
            setSuccessMessage(null)
            setUiNotice(
              "Password reset is not connected in this demo, so no reset email was sent."
            )
          }}
          className="rounded-sm text-xs font-medium text-brand underline-offset-4 transition-colors hover:text-brand-hover hover:underline focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none"
        >
          Forgot password?
        </button>
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
        Sign In
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
            "Google sign-in is not connected in this demo, so no Google account was used."
          )
        }}
        className="mt-1.5 h-11 w-full gap-3 rounded-full border-[#1A1410]/15 bg-transparent text-sm font-medium text-[#1A1410] hover:border-brand/50 hover:bg-brand/5 hover:text-[#1A1410] focus-visible:ring-brand/40 dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/5 dark:hover:text-white"
      >
        <GoogleIcon className="size-4" />
        Sign in with Google
      </Button>

      <p className="mt-1.5 text-center text-sm text-[#1A1410]/65 dark:text-white/60">
        New to Huntine?{" "}
        <Link
          href="/sign-up"
          className="rounded-sm font-semibold text-brand underline-offset-4 transition-colors hover:text-brand-hover hover:underline focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none"
        >
          Create an account
        </Link>
      </p>
    </form>
  )
}
