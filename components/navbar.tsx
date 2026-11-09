"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { ArrowRight, Menu, Moon, Sun } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// All navigation links live in one simple array, so we can add or remove
// a link in a single place and the desktop + mobile menus update together.
const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
  { label: "For Employers", href: "/employers" },
]

// Small button that switches the whole website between light and dark mode.
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="size-10 rounded-full text-white transition-colors duration-200 hover:bg-white/10 hover:text-brand dark:hover:bg-white/10"
    >
      {/* The sun shows in light mode, the moon shows in dark mode. */}
      <Sun className="size-5 dark:hidden" />
      <Moon className="hidden size-5 dark:block" />
    </Button>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  // Closing the mobile sheet is reused by every link inside it.
  function closeMenu() {
    setOpen(false)
  }

  return (
    // Sticky wrapper: keeps the floating pill visible while the page scrolls.
    <header className="sticky top-0 z-50 w-full pt-4">
      {/* Same container as the hero, so the pill edges line up with the page. */}
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="grid w-full grid-cols-[1fr_auto] items-center gap-4 rounded-full border border-white/10 border-t-white/20 bg-[#0A0A0A] px-6 py-3 shadow-lg shadow-black/10 sm:px-8 lg:grid-cols-[1fr_auto_1fr]">
          {/* Logo: bold white "HUNT" + orange "ine" with a small brand dot */}
          <Link
            href="/"
            onClick={closeMenu}
            aria-label="HUNTine home"
            className="group flex shrink-0 items-baseline justify-self-start rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand/60"
          >
            <span className="text-2xl font-extrabold tracking-tight text-white">
              HUNT
            </span>
            <span className="text-xl font-medium tracking-tight text-brand transition-colors duration-200 group-hover:text-brand-hover">
              ine
            </span>
            <span
              aria-hidden="true"
              className="mb-1 ml-1 size-1.5 rounded-full bg-brand"
            />
          </Link>

          {/* Desktop links: rounded hover background, white text, orange active underline */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-2 justify-self-center lg:flex"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 hover:bg-white/10 hover:text-white",
                    isActive ? "text-white" : "text-white/70"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-px rounded-full bg-brand transition-opacity duration-200",
                      isActive
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    )}
                  />
                </Link>
              )
            })}
          </nav>

          {/* Desktop buttons: theme toggle + plain Sign In link + Get Started */}
          <div className="hidden items-center gap-2 justify-self-end lg:flex">
            <ThemeToggle />
            <Link
              href="/sign-in"
              className="flex h-10 items-center rounded-full px-4 text-sm font-medium text-white/80 transition-colors duration-200 hover:text-brand"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants(),
                "group h-10 rounded-full bg-brand px-5 text-black hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/30"
              )}
            >
              Get Started
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile menu: logo + hamburger only, everything else lives in the dark sheet */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="size-10 justify-self-end rounded-full text-white hover:bg-white/10 lg:hidden dark:hover:bg-white/10"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-full max-w-xs border-white/10 bg-[#0A0A0A] p-0 text-white"
            >
              <SheetHeader className="border-b border-white/10 p-5">
                <SheetTitle className="flex items-baseline text-white">
                  <span className="text-xl font-bold tracking-tighter">
                    HUNT
                  </span>
                  <span className="text-base font-medium tracking-tight text-brand">
                    ine
                  </span>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Browse HUNTine pages and account actions.
                </SheetDescription>
              </SheetHeader>

              <nav
                aria-label="Mobile navigation"
                className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
              >
                {navLinks.map((link) => {
                  const isActive = pathname === link.href

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "rounded-xl px-3 py-3 text-base transition-colors duration-200",
                        isActive
                          ? "text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <span className="relative">
                        {link.label}
                        {isActive && (
                          <span className="absolute inset-x-0 -bottom-1 h-px rounded-full bg-brand" />
                        )}
                      </span>
                    </Link>
                  )
                })}
              </nav>

              <div className="mt-auto flex flex-col gap-2 border-t border-white/10 p-4">
                <div className="mb-1 flex items-center justify-between px-1">
                  <span className="text-sm text-white/70">Theme</span>
                  <ThemeToggle />
                </div>
                <Link
                  href="/sign-in"
                  onClick={closeMenu}
                  className="flex h-11 w-full items-center justify-center rounded-full text-sm font-medium text-white/80 transition-colors duration-200 hover:text-brand"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={closeMenu}
                  className={cn(
                    buttonVariants(),
                    "group h-11 w-full rounded-full bg-brand text-black hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/30"
                  )}
                >
                  Get Started
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
