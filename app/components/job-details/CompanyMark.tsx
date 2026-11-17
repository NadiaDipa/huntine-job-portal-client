import { cn } from "@/lib/utils"

/**
 * Placeholder company logo. Real logos can replace this later without touching
 * the job details layout.
 */
export function CompanyMark({
  initials,
  className,
  size = "default",
}: {
  initials: string
  className?: string
  size?: "default" | "large"
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl border border-black/[0.06] bg-white font-extrabold tracking-tight text-brand shadow-[0_10px_30px_-18px_rgba(255,138,51,0.75)] dark:border-white/10 dark:bg-white/[0.04] dark:text-brand",
        size === "large"
          ? "size-16 text-xl sm:size-20 sm:text-2xl"
          : "size-14 text-lg",
        className
      )}
    >
      {initials}
    </span>
  )
}
