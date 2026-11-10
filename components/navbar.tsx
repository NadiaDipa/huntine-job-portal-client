
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  ArrowRight,
  ChevronDown,
  CircleUserRound,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  UserRound,
} from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
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

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Companies", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
  { label: "For Employers", href: "/employers" },
]

const toastStyle =
  "!border-[#C66B24]/60 !bg-[#21180F] !text-[#FFF4E8] !text-center [&_[data-title]]:!text-center [&_[data-description]]:!text-center"

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  return (
    parts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "U"
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() =>
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
      className="size-10 rounded-full text-white transition-colors duration-200 hover:bg-white/10 hover:text-brand dark:hover:bg-white/10"
    >
      <Sun className="size-5 dark:hidden" />
      <Moon className="hidden size-5 dark:block" />
    </Button>
  )
}

type ProfileMenuProps = {
  name: string
  isLoggingOut: boolean
  onLogout: () => void
  onCloseSheet?: () => void
  mobile?: boolean
}

function ProfileMenu({
  name,
  isLoggingOut,
  onLogout,
  onCloseSheet,
  mobile = false,
}: ProfileMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  const displayName = name || "Account"
  const initials = getInitials(displayName)

  React.useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  function handleComingSoon(feature: string) {
    setIsOpen(false)
    onCloseSheet?.()

    toast.info(`${feature} page is coming soon.`, {
      className: toastStyle,
    })
  }

  return (
    <div
      ref={menuRef}
      className={cn("relative", mobile && "w-full")}
    >
      <Button
        type="button"
        variant="ghost"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((previous) => !previous)}
        className={cn(
          "h-11 gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-white transition-all duration-200 hover:border-brand/40 hover:bg-white/10",
          mobile && "h-12 w-full justify-start px-3",
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-black ring-2 ring-brand/20">
          {initials}
        </span>

        <span className="max-w-28 truncate text-sm font-medium">
          {displayName}
        </span>

        <ChevronDown
          className={cn(
            "size-4 text-white/50 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </Button>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            "absolute right-0 top-[calc(100%+10px)] z-[60] w-60 overflow-hidden rounded-2xl border border-white/10 bg-[#17130F] p-2 shadow-xl shadow-black/30",
            mobile && "left-0 right-0 top-[calc(100%+8px)] w-full",
          )}
        >
          {/* Profile Information */}
          <div className="flex items-center gap-3 border-b border-white/10 px-3 py-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/15 text-sm font-bold text-brand ring-1 ring-brand/30">
              {initials}
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {displayName}
              </p>
              <p className="mt-1 text-xs text-white/50">
                Your Huntine account
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-1 py-2">
            <button
              type="button"
              role="menuitem"
              onClick={() => handleComingSoon("My Profile")}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-brand"
            >
              <CircleUserRound className="size-4" />
              My Profile
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => handleComingSoon("Dashboard")}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-brand"
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => handleComingSoon("Settings")}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-brand"
            >
              <Settings className="size-4" />
              Settings
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-white/10 pt-2">
            <button
              type="button"
              role="menuitem"
              disabled={isLoggingOut}
              onClick={() => {
                setIsOpen(false)
                onLogout()
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-400/10 disabled:opacity-50"
            >
              {isLoggingOut ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}

              {isLoggingOut ? "Signing out..." : "Log Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function AccountLoading() {
  return (
    <div className="flex h-10 items-center gap-2">
      <span className="size-8 animate-pulse rounded-full bg-white/10" />
      <span className="h-3 w-16 animate-pulse rounded-full bg-white/10" />
    </div>
  )
}

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const [open, setOpen] = React.useState(false)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const { data: session, isPending } = authClient.useSession()

  function closeMenu() {
    setOpen(false)
  }

  async function handleLogout() {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      const { error } = await authClient.signOut()

      if (error) {
        toast.error(error.message || "Unable to sign out.", {
          className: toastStyle,
        })
        return
      }

      closeMenu()

      toast.success("Signed out successfully.", {
        className: toastStyle,
      })

      router.replace("/")
      router.refresh()
    } catch {
      toast.error("Unable to sign out. Please try again.", {
        className: toastStyle,
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  function isActiveLink(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="sticky top-0 z-50 w-full pt-4">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="grid w-full grid-cols-[1fr_auto] items-center gap-4 rounded-full border border-white/10 border-t-white/20 bg-[#0A0A0A] px-6 py-3 shadow-lg shadow-black/10 sm:px-8 lg:grid-cols-[1fr_auto_1fr]">

          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            aria-label="Huntine home"
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

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-2 justify-self-center lg:flex"
          >
            {navLinks.map((link) => {
              const active = isActiveLink(link.href)

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 hover:bg-white/10 hover:text-white",
                    active ? "text-white" : "text-white/70",
                  )}
                >
                  {link.label}

                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-px rounded-full bg-brand transition-opacity duration-200",
                      active
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100",
                    )}
                  />
                </Link>
              )
            })}
          </nav>

          {/* Desktop Account Actions */}
          <div className="hidden items-center gap-2 justify-self-end lg:flex">
            <ThemeToggle />

            {isPending ? (
              <AccountLoading />
            ) : session ? (
              <ProfileMenu
                name={session.user.name}
                isLoggingOut={isLoggingOut}
                onLogout={handleLogout}
              />
            ) : (
              <>
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
                    "group h-10 rounded-full bg-brand px-5 text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/30",
                  )}
                >
                  Get Started
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation menu"
                  className="size-10 justify-self-end rounded-full text-white hover:bg-white/10 lg:hidden dark:hover:bg-white/10"
                >
                  <Menu className="size-5" />
                </Button>
              }
            />

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
                  Browse Huntine pages and account actions.
                </SheetDescription>
              </SheetHeader>

              {/* Mobile Links */}
              <nav
                aria-label="Mobile navigation"
                className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
              >
                {navLinks.map((link) => {
                  const active = isActiveLink(link.href)

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-xl px-3 py-3 text-base transition-colors duration-200",
                        active
                          ? "text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <span className="relative">
                        {link.label}

                        {active && (
                          <span className="absolute inset-x-0 -bottom-1 h-px rounded-full bg-brand" />
                        )}
                      </span>
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile Account Actions */}
              <div className="mt-auto flex flex-col gap-3 border-t border-white/10 p-4">
                <div className="mb-1 flex items-center justify-between px-1">
                  <span className="text-sm text-white/70">Theme</span>
                  <ThemeToggle />
                </div>

                {isPending ? (
                  <AccountLoading />
                ) : session ? (
                  <ProfileMenu
                    name={session.user.name}
                    isLoggingOut={isLoggingOut}
                    onLogout={handleLogout}
                    onCloseSheet={closeMenu}
                    mobile
                  />
                ) : (
                  <>
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
                        "group h-11 w-full rounded-full bg-brand text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/30",
                      )}
                    >
                      Get Started
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
