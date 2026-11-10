
"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, LoaderCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { AuthField, PasswordField } from "@/components/auth/auth-fields"
import { GoogleIcon } from "@/components/auth/google-icon"
import { getEmailError } from "@/lib/auth-validation"
import { authClient } from "@/lib/auth-client"

const toastStyle =
  "!border-[#C66B24]/60 !bg-[#21180F] !text-[#FFF4E8] !text-center [&_[data-title]]:!text-center [&_[data-title]]:!text-base [&_[data-description]]:!text-center [&_[data-description]]:!text-sm"

export function SignInForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isLoading) return

    const formData = new FormData(event.currentTarget)

    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")

    const emailError = getEmailError(email)

    if (emailError) {
      toast.error(emailError, { className: toastStyle })
      return
    }

    if (!password) {
      toast.error("Enter your password.", { className: toastStyle })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      })

      if (error) {
        toast.error(error.message || "Unable to sign in.", {
          className: toastStyle,
        })
        return
      }

      toast.success("Welcome back!", {
        description: "You have signed in successfully.",
        className: toastStyle,
      })

      router.replace("/")
    } catch {
      toast.error("Unable to sign in. Please try again.", {
        className: toastStyle,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-[13px]"
    >
      <AuthField
        id="sign-in-email"
        name="email"
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
      />

      <PasswordField
        id="sign-in-password"
        name="password"
        label="Password"
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
            name="rememberMe"
            type="checkbox"
            className="size-4 cursor-pointer rounded-[4px] border-[#1A1410]/30 accent-brand dark:border-white/20"
          />
          Remember me
        </label>

        <button
          type="button"
          onClick={() =>
            toast.info("Password reset is not connected yet.", {
              className: toastStyle,
            })
          }
          className="rounded-sm text-xs font-medium text-brand underline-offset-4 transition-colors hover:text-brand-hover hover:underline focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none"
        >
          Forgot password?
        </button>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
        className="group mt-3.5 h-11 w-full gap-2 rounded-full bg-brand bg-gradient-to-b from-orange-400 to-brand text-[13px] font-semibold tracking-[0.18em] text-[#0A0A0A] uppercase shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand/30 hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 focus-visible:ring-brand/50"
      >
        {isLoading ? (
          <>
            Signing in...
            <LoaderCircle
              aria-hidden="true"
              className="size-4 animate-spin"
            />
          </>
        ) : (
          <>
            Sign In
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </>
        )}
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
          toast.info("Google sign-in is not connected yet.", {
            className: toastStyle,
          })
        }
        className="mt-1.5 h-11 w-full gap-3 rounded-full border-[#1A1410]/15 bg-transparent text-sm font-medium text-[#1A1410] transition-all hover:border-brand/50 hover:bg-brand/5 hover:text-[#1A1410] active:scale-[0.98] focus-visible:ring-brand/40 dark:border-white/15 dark:bg-transparent dark:text-white dark:hover:bg-white/5 dark:hover:text-white"
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
