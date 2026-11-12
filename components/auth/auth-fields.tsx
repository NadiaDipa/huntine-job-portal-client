"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

const labelClassName =
  "text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A1410]/65 dark:text-white/65"

// One placeholder color for every auth input, so no field looks brighter
// than another. Both AuthField and PasswordField use inputClassName below.
const placeholderClassName =
  "placeholder:text-black/35 dark:placeholder:text-white/30"

const inputClassName = `h-11 w-full rounded-none border-0 border-b bg-transparent px-0 text-[15px] text-[#1A1410] transition-colors focus:border-brand focus:outline-none focus-visible:outline-none dark:text-white ${placeholderClassName}`

const neutralBorder = "border-[#1A1410]/20 dark:border-white/15"
const errorBorder =
  "border-destructive focus:border-destructive dark:border-destructive"

const hintClassName = "text-xs leading-5 text-[#1A1410]/60 dark:text-white/50"

const errorClassName = "text-xs leading-5 text-destructive"

type AuthFieldProps = {
  id: string
  name: string
  label: string
  type?: "text" | "email"
  defaultValue?: string
  /** Used to clear a field error while the user types. */
  onChange?: () => void
  error?: string
  placeholder?: string
  autoComplete?: string
}

export function AuthField({
  id,
  name,
  label,
  type = "text",
  defaultValue,
  onChange,
  error,
  placeholder,
  autoComplete,
}: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(inputClassName, error ? errorBorder : neutralBorder)}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className={errorClassName}>
          {error}
        </p>
      ) : null}
    </div>
  )
}

type PasswordFieldProps = {
  id: string
  name: string
  label: string
  defaultValue?: string
  /** Used to clear a field error while the user types. */
  onChange?: () => void
  error?: string
  hint?: string
  placeholder?: string
  autoComplete?: string
  /** Extra hint id for text rendered outside the field. */
  describedBy?: string
}

export function PasswordField({
  id,
  name,
  label,
  defaultValue,
  onChange,
  error,
  hint,
  placeholder,
  autoComplete,
  describedBy,
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false)

  const describedById =
    [hint ? `${id}-hint` : null, error ? `${id}-error` : null, describedBy]
      .filter(Boolean)
      .join(" ") || undefined

  return (
    <div className="space-y-2">
      <label htmlFor={id} className={labelClassName}>
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          name={name}
          type={isVisible ? "text" : "password"}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={describedById}
          className={cn(
            inputClassName,
            "pr-10",
            error ? errorBorder : neutralBorder
          )}
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          title={isVisible ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 flex w-9 items-center justify-end rounded-sm text-[#1A1410]/40 transition-colors hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none dark:text-white/40"
        >
          {isVisible ? (
            <EyeOff aria-hidden="true" className="size-4" />
          ) : (
            <Eye aria-hidden="true" className="size-4" />
          )}
        </button>
      </div>

      {hint ? (
        <p id={`${id}-hint`} className={hintClassName}>
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={`${id}-error`} role="alert" className={errorClassName}>
          {error}
        </p>
      ) : null}
    </div>
  )
}
