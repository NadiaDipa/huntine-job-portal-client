const cardClassName =
  "rounded-3xl border border-black/5 bg-white shadow-[0_1px_2px_rgba(16,10,6,0.04),0_16px_40px_-32px_rgba(16,10,6,0.5)] dark:border-white/10 dark:bg-white/[0.04]"

export default function EditJobLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="h-3 w-32 animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
      <div className="mt-5 h-8 w-56 max-w-full animate-pulse rounded-lg bg-black/5 dark:bg-white/10" />
      <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded-full bg-black/5 dark:bg-white/10" />

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, section) => (
            <section key={section} className={`${cardClassName} p-5 sm:p-6`}>
              <div className="flex items-start gap-3.5">
                <div className="size-11 animate-pulse rounded-2xl bg-black/5 dark:bg-white/10" />
                <div className="space-y-2">
                  <div className="h-2.5 w-20 animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
                  <div className="h-5 w-44 animate-pulse rounded bg-black/5 dark:bg-white/10" />
                  <div className="h-3 w-64 max-w-full animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
                </div>
              </div>

              <div className="my-5 h-px bg-black/5 dark:bg-white/10" />

              <div className="grid gap-5 sm:grid-cols-2">
                {Array.from({ length: section === 2 ? 2 : 4 }).map(
                  (_, field) => (
                    <div
                      key={field}
                      className={
                        section === 2 ? "space-y-2 sm:col-span-2" : "space-y-2"
                      }
                    >
                      <div className="h-2.5 w-24 animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
                      <div className="h-11 animate-pulse rounded-xl bg-black/5 dark:bg-white/10" />
                    </div>
                  )
                )}
              </div>
            </section>
          ))}
        </div>

        <aside>
          <section className={`${cardClassName} p-5`}>
            <div className="flex items-start gap-3">
              <div className="size-9 animate-pulse rounded-xl bg-black/5 dark:bg-white/10" />
              <div className="w-full space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-black/5 dark:bg-white/10" />
                <div className="h-3 w-full animate-pulse rounded-full bg-black/5 dark:bg-white/10" />
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <div className="h-11 animate-pulse rounded-xl bg-black/5 dark:bg-white/10" />
              <div className="h-11 animate-pulse rounded-xl bg-black/5 dark:bg-white/10" />
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
