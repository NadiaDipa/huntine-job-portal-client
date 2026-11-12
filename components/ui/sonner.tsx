"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"

const iconClassName = "size-5"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      className="toaster group"
      offset={{ top: 96, right: 16, bottom: 24, left: 16 }}
      mobileOffset={{ top: 96, right: 16, bottom: 24, left: 16 }}
      icons={{
        success: <CircleCheckIcon className={iconClassName} />,
        info: <InfoIcon className={iconClassName} />,
        warning: <TriangleAlertIcon className={iconClassName} />,
        error: <OctagonXIcon className={iconClassName} />,
        loading: <Loader2Icon className={`${iconClassName} animate-spin`} />,
      }}
      style={
        {
          "--width": "380px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "!items-start !gap-3 !rounded-2xl !border !border-brand/25 !bg-[#FFF8F0] !px-5 !py-4 !text-[#2A1D12] !shadow-lg !shadow-black/10 dark:!border-brand/30 dark:!bg-[#21180F] dark:!text-[#FFF4E8] dark:!shadow-black/40",
          content: "!gap-1",
          icon: "!mt-0.5 !size-5 !text-brand",
          title: "!text-base !leading-6 !font-semibold !tracking-tight",
          description:
            "!text-sm !leading-5 !font-normal !text-[#6B5443] dark:!text-[#D8C5B2]",
          success:
            "[&_[data-icon]]:!text-emerald-600 dark:[&_[data-icon]]:!text-emerald-400",
          error:
            "[&_[data-icon]]:!text-red-500 dark:[&_[data-icon]]:!text-red-400",
          warning:
            "[&_[data-icon]]:!text-amber-600 dark:[&_[data-icon]]:!text-amber-400",
          info: "[&_[data-icon]]:!text-brand",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
