const cardClassName =
  "rounded-3xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(16,10,6,0.04),0_16px_40px_-32px_rgba(16,10,6,0.5)] dark:border-white/10 dark:bg-white/[0.04]"

export default function JobDetailsLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="h-3 w-32 animate-pulse rounded-full bg-black/5 dark:bg-white/10" />

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="h-8 w-64 max-w-full animate-pulse rounded-lg bg-black/5 dark:bg-white/10" />
          <div className="h-4 w-40 animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
          <div className="flex gap-2">
            <div className="h-5 w-20 animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="h-10 w-24 animate-pulse rounded-xl bg-black/5 dark:bg-white/10" />
          <div className="h-10 w-28 animate-pulse rounded-xl bg-black/5 dark:bg-white/10" />
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <section className={`${cardClassName} p-5 sm:p-6`}>
          <div className="flex items-start gap-3.5">
            <div className="size-11 animate-pulse rounded-2xl bg-black/5 dark:bg-white/10" />
            <div className="space-y-2">
              <div className="h-5 w-40 animate-pulse rounded bg-black/5 dark:bg-white/10" />
              <div className="h-3 w-64 max-w-full animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
            </div>
          </div>

          <div className="my-5 h-px bg-black/5 dark:bg-white/10" />

          <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="size-8 animate-pulse rounded-lg bg-black/5 dark:bg-white/10" />
                <div className="w-full space-y-2">
                  <div className="h-2.5 w-24 animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
                  <div className="h-4 w-40 max-w-full animate-pulse rounded bg-black/5 dark:bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {Array.from({ length: 2 }).map((_, index) => (
          <section key={index} className={`${cardClassName} p-5 sm:p-6`}>
            <div className="flex items-start gap-3.5">
              <div className="size-11 animate-pulse rounded-2xl bg-black/5 dark:bg-white/10" />
              <div className="space-y-2">
                <div className="h-5 w-36 animate-pulse rounded bg-black/5 dark:bg-white/10" />
                <div className="h-3 w-56 max-w-full animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
              </div>
            </div>

            <div className="my-5 h-px bg-black/5 dark:bg-white/10" />

            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, line) => (
                <div
                  key={line}
                  className="h-4 w-full animate-pulse rounded bg-black/5 dark:bg-white/10"
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
