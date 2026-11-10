import Image from "next/image"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type AuthShellProps = {
  /** Sign-up flips the waves to the other side so the pages feel related but distinct. */
  mirrorBackground?: boolean
  eyebrow: string
  title: ReactNode
  description: string
  children: ReactNode
}

/**
 * Shared frame for the sign-in and sign-up pages.
 * Both pages use the same top padding, so the card never jumps between routes.
 */
export function AuthShell({
  mirrorBackground = false,
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    // The floating navbar is ~82px tall, so subtract that to avoid a tiny scrollbar.
    <main className="relative isolate flex min-h-[calc(100svh-82px)] items-start justify-center overflow-hidden bg-[#FAF7F2] px-4 pt-20 pb-12 sm:px-6 dark:bg-[#0B0705]">
      {/* Dark-mode background: screen blend removes the black and keeps the orange waves. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 hidden dark:block"
      >
        {/* Next.js 16 uses `preload` in place of the deprecated `priority` prop. */}
        <Image
          src="/images/bg-auth.jpg"
          alt=""
          fill
          unoptimized
          preload
          sizes="100vw"
          className={cn(
            "object-cover object-center opacity-45 mix-blend-screen",
            mirrorBackground && "scale-x-[-1]"
          )}
        />
      </div>

      {/* Light-mode warmth: the old reddish image is gone, so use soft brand glows. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(circle_at_12%_16%,rgba(255,138,51,0.16),transparent_40%),radial-gradient(circle_at_88%_84%,rgba(255,138,51,0.10),transparent_42%)] dark:hidden"
      />

      {/* Calm dark area only behind the card; the waves stay bright at the edges. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse 70% 85% at 50% 50%, rgba(11,7,5,0.85) 0%, rgba(11,7,5,0.6) 50%, transparent 100%)",
        }}
      />

      {/* Matching calm area in light mode so the card stays readable. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_45%_55%_at_50%_50%,rgba(250,247,242,0.9)_0%,rgba(250,247,242,0.35)_60%,transparent_100%)] dark:hidden"
      />

      <section className="relative w-full max-w-[35rem] rounded-[2rem] border border-[#1A1410]/10 bg-[#FFFDF9] px-10 py-10 shadow-[0_0_80px_-20px_rgba(249,115,22,0.35)] ring-1 ring-brand/20 backdrop-blur-xl dark:border-white/10 dark:bg-[#120D0A]">
        <div className="text-center">
          <p className="inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.32em] text-brand uppercase">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-brand"
            />
            {eyebrow}
          </p>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-balance text-[#1A1410] dark:text-white">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#1A1410]/65 dark:text-white/60">
            {description}
          </p>
        </div>

        <div className="mt-6">{children}</div>
      </section>
    </main>
  )
}
