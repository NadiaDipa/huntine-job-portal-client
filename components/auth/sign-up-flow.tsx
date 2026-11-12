"use client"

import { useState } from "react"
import type { LucideIcon } from "lucide-react"
import { ArrowRight, Briefcase, Check, Search, ShieldCheck } from "lucide-react"
import { toast } from "sonner"

import { AuthShell } from "@/components/auth/auth-shell"
import { SignUpForm } from "@/components/auth/sign-up-form"
import { HuntineChip } from "@/components/brand/huntine-chip"
import { Button } from "@/components/ui/button"
import { ROLE_OPTIONS, type UserRole } from "@/lib/roles"
import { cn } from "@/lib/utils"

const ROLE_DETAILS: Record<
  UserRole,
  { icon: LucideIcon; description: string }
> = {
  seeker: {
    icon: Search,
    description: "Find roles and keep track of every application.",
  },
  recruiter: {
    icon: Briefcase,
    description: "Post jobs and connect with promising candidates.",
  },
  admin: {
    icon: ShieldCheck,
    description: "Manage users and keep the platform running smoothly.",
  },
}

type SignUpStep = "role" | "account"

export function SignUpFlow() {
  const [step, setStep] = useState<SignUpStep>("role")
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  function handleContinue() {
    if (!selectedRole) {
      toast.error("Select your role to continue.")
      return
    }

    setStep("account")
  }

  const isRoleStep = step === "role"

  return (
    <AuthShell
      mirrorBackground
      eyebrow={isRoleStep ? undefined : "New member"}
      title={
        isRoleStep ? (
          "Join Huntine"
        ) : (
          <>
            Create your <HuntineChip /> account
          </>
        )
      }
      description={
        isRoleStep
          ? "Choose how you want to use Huntine. You can set up your account next."
          : "Save roles, follow companies and find work that fits you."
      }
    >
      {isRoleStep ? (
        <div className="flex flex-col gap-4">
          <fieldset>
            <legend className="sr-only">Choose your role</legend>

            <div className="flex flex-col gap-3">
              {ROLE_OPTIONS.map((option) => {
                const { icon: Icon, description } = ROLE_DETAILS[option.value]
                const isSelected = selectedRole === option.value

                return (
                  <label
                    key={option.value}
                    className={cn(
                      "relative flex cursor-pointer items-center gap-3.5 rounded-2xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/50",
                      isSelected
                        ? "border-brand bg-brand/10"
                        : "border-[#1A1410]/12 hover:border-brand/40 hover:bg-brand/5 dark:border-white/12 dark:hover:border-brand/40"
                    )}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={isSelected}
                      onChange={() => setSelectedRole(option.value)}
                      className="sr-only"
                    />

                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
                        isSelected
                          ? "border-brand bg-brand text-[#0A0A0A]"
                          : "border-[#1A1410]/10 bg-[#1A1410]/5 text-brand dark:border-white/10 dark:bg-white/5"
                      )}
                    >
                      <Icon className="size-5" />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={cn(
                          "block text-sm font-semibold",
                          isSelected
                            ? "text-[#1A1410] dark:text-white"
                            : "text-[#1A1410]/85 dark:text-white/80"
                        )}
                      >
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-[#1A1410]/55 dark:text-white/45">
                        {description}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                        isSelected
                          ? "border-brand bg-brand text-[#0A0A0A]"
                          : "border-[#1A1410]/20 dark:border-white/20"
                      )}
                    >
                      {isSelected ? (
                        <Check className="size-3" strokeWidth={3} />
                      ) : null}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <Button
            type="button"
            onClick={handleContinue}
            className="group mt-1 h-12 w-full gap-2 rounded-full bg-brand text-sm font-semibold text-[#0A0A0A] shadow-lg shadow-brand/20 transition-colors hover:bg-brand-hover focus-visible:ring-brand/50"
          >
            Continue
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5"
            />
          </Button>
        </div>
      ) : (
        <SignUpForm
          selectedRole={selectedRole}
          onBack={() => setStep("role")}
        />
      )}
    </AuthShell>
  )
}
