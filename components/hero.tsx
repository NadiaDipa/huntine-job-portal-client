import Image from "next/image"
import { Outfit } from "next/font/google"
import {
  Briefcase,
  CodeXml,
  Cpu,
  Layers,
  MapPin,
  PenTool,
  Search,
  Server,
} from "lucide-react"

// Outfit is only used for the big headline, so it lives with the hero.
const outfit = Outfit({ subsets: ["latin"], display: "swap" })

// Role cards shown in the vertical marquee on the right.
const roles = [
  { name: "UX Designer", icon: PenTool },
  { name: "Frontend Developer", icon: CodeXml },
  { name: "Manager", icon: Briefcase },
  { name: "Backend Developer", icon: Server },
  { name: "Full Stack Developer", icon: Layers },
  { name: "IT Engineer", icon: Cpu },
]

// Popular search pills under the search bar.
const popularTags = ["React", "Remote", "Design", "Marketing", "Data"]

// Company logos. Plain <img> tags keep next.config.ts unchanged.
const companies = [
  {
    name: "Stripe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
  },
  {
    name: "Adobe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Adobe_logo_and_wordmark_%282017%29.svg",
  },
  {
    name: "Google",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
  },
]

// Softly fades the top and bottom of the scrolling role column.
const fadeMask =
  "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)"

export function Hero() {
  return (
    <section className="relative isolate bg-[#FAF7F2] pt-16 pb-16 text-[#1A1410] dark:bg-[#0B0705] dark:text-white">
      {/* Warm strip that lets the hero run behind the floating navbar. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-32 h-32 bg-[#FAF7F2] dark:bg-[#0B0705]"
      />

      {/* Background: waves in dark mode, soft orange glows in light mode. */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Background image: only bg-wave.jpg now (bg-hero.jpg is not used).
            It covers the whole hero in dark mode and is hidden in light mode.
            "unoptimized" makes Next.js serve the original file as it is,
            without compressing it (the default compression is quality 75,
            which can make dark gradients look blurry or blocky).
            Keep the image file under about 1 MB so the page still loads fast.
            If the waves look cut off, try object-right or object-top instead
            of object-center. */}
                {/* Background image (dark mode only). Slightly dimmed so it is not too strong. */}
        <Image
          src="/images/bg-wave.jpg"
          alt=""
          fill
          preload
          sizes="100vw"
          unoptimized
          className="pointer-events-none object-cover object-center opacity-0 transition-opacity duration-300 dark:opacity-80"
        />
        {/* Left side: light overlay, so the waves stay visible but the text is still readable. */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(11,7,5,0.5)_0%,rgba(11,7,5,0.28)_30%,rgba(11,7,5,0.08)_50%,transparent_60%)] md:dark:block" />
        {/* Right side: gentle dark layer that calms the brightest ribbons. */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(to_left,rgba(11,7,5,0.4)_0%,rgba(11,7,5,0.2)_25%,transparent_55%)] md:dark:block" />
        {/* Mobile overlay (below md). */}
        <div className="absolute inset-0 hidden bg-linear-to-r from-[#0B0705] from-0% via-[#0B0705]/90 via-40% to-transparent to-75% max-md:dark:block" />
        {/* Dark-mode overlay from md up: dark on the left so the text stays
            readable, fading out by 62% so the waves fill the middle and right. */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(11,7,5,0.92)_0%,rgba(11,7,5,0.75)_25%,rgba(11,7,5,0.35)_48%,transparent_62%)] md:dark:block" />

        {/* Gently blends the orange wave into the hero background below the company logos. */}
        <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_70%_45%_at_35%_100%,rgba(11,7,5,0.75),transparent_70%)] md:dark:block" />

        {/* Adds a subtle warm glow on the left without placing a black patch over the image. */}
        <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_55%_60%_at_18%_55%,rgba(249,115,22,0.16),transparent_70%)] md:dark:block" />

        {/* Light-mode glow circles. */}
        <div
          aria-hidden="true"
          className="absolute -top-28 right-[-6rem] size-96 rounded-full bg-brand/15 blur-3xl dark:hidden"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-[-9rem] left-[6%] size-80 rounded-full bg-brand/15 blur-3xl dark:hidden"
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-10">
          {/* Left column: badge, headline, search, tags */}
          <div className="flex flex-col items-start lg:justify-between lg:self-stretch">
            {/* Small availability badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-medium text-[#1A1410] shadow-sm sm:text-sm dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:shadow-none dark:backdrop-blur-md">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-brand"
              />
              Over 10,000 jobs updated daily
            </div>

            {/* Two-line hero headline */}
            <h1
              className={`${outfit.className} mt-5 text-4xl leading-[1.05] font-bold tracking-tight text-[#1A1410] md:text-5xl lg:text-6xl dark:text-white`}
            >
              <span className="block">Stop searching.</span>
              <span className="block">
                Start <span className="text-brand">hunting</span>.
              </span>
            </h1>

            {/* Short supporting description */}
            <p className="mt-4 max-w-md text-base leading-relaxed text-black/60 sm:text-lg dark:text-white/60">
              Discover thousands of jobs from top companies. Search, apply and
              get hired faster.
            </p>

            {/* Search bar (visual only) */}
            <div
              role="search"
              className="mt-6 w-full max-w-xl rounded-2xl border border-black/10 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:backdrop-blur-md"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-0">
                <label className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3">
                  <Search
                    aria-hidden="true"
                    className="size-4 shrink-0 text-black/40 dark:text-white/40"
                  />
                  <span className="sr-only">Job title or company</span>
                  <input
                    type="text"
                    placeholder="Job title or company"
                    className="w-full bg-transparent text-sm text-[#1A1410] outline-none placeholder:text-black/40 dark:text-white dark:placeholder:text-white/35"
                  />
                </label>

                <div
                  aria-hidden="true"
                  className="hidden h-6 w-px shrink-0 bg-black/10 sm:block dark:bg-white/10"
                />

                <label className="flex flex-1 items-center gap-3 rounded-xl px-4 py-3">
                  <MapPin
                    aria-hidden="true"
                    className="size-4 shrink-0 text-black/40 dark:text-white/40"
                  />
                  <span className="sr-only">Location</span>
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-full bg-transparent text-sm text-[#1A1410] outline-none placeholder:text-black/40 dark:text-white dark:placeholder:text-white/35"
                  />
                </label>

                <button
                  type="button"
                  className="mt-1 inline-flex items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-black transition-all duration-200 hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/30 sm:mt-0"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Popular search tags */}
            <div className="mt-3 flex max-w-xl flex-wrap items-center gap-2">
              <span className="text-xs text-black/50 sm:text-sm dark:text-white/40">
                Popular:
              </span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/60 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:text-brand dark:border-white/10 dark:bg-white/[0.03] dark:text-white/60 dark:shadow-none"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right column: role-card marquee */}
          <div className="relative hidden h-[460px] lg:block lg:justify-self-end">
            <div
              className="group relative h-full w-80 max-w-full overflow-hidden"
              style={{
                maskImage: fadeMask,
                WebkitMaskImage: fadeMask,
              }}
            >
              <div className="animate-marquee-vertical group-hover:[animation-play-state:paused] motion-reduce:animate-none">
                {/* The array is rendered twice so the loop has no visible gap. */}
                {[...roles, ...roles].map((role, index) => {
                  const Icon = role.icon

                  return (
                    <div
                      key={`${role.name}-${index}`}
                      className="flex justify-center pb-4"
                    >
                      <article className="flex w-80 max-w-full flex-col items-center gap-3 rounded-2xl border border-black/10 bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:bg-brand/5 dark:border-white/10 dark:bg-black/20 dark:shadow-none dark:backdrop-blur-sm dark:hover:border-white/20 dark:hover:bg-black/45">
                        <span className="flex size-12 items-center justify-center rounded-full bg-[#1A1410] dark:bg-black/60">
                          <Icon
                            aria-hidden="true"
                            className="size-5 text-brand"
                          />
                        </span>
                        <span className="text-sm font-medium text-[#1A1410] dark:text-white">
                          {role.name}
                        </span>
                      </article>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Logo strip at the bottom of the hero */}
        <div className="mt-16">
          <p className="text-xs font-medium tracking-[0.2em] text-black/50 uppercase dark:text-white/40">
            Top companies hiring
          </p>

          <div className="mt-4 rounded-2xl border border-black/10 bg-white px-6 py-6 shadow-sm sm:px-10 dark:border-white/10 dark:bg-white/5 dark:shadow-none dark:backdrop-blur-md">
            <div className="grid grid-cols-2 items-center justify-items-center gap-6 md:grid-cols-4">
              {companies.map((company) => (
                <div
                  key={company.name}
                  className="flex items-center justify-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    loading="lazy"
                    decoding="async"
                    className="h-6 w-auto opacity-60 brightness-0 transition-opacity duration-200 hover:opacity-100 md:h-8 dark:opacity-80 dark:invert"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}