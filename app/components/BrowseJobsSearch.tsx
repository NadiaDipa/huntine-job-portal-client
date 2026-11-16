"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

type BrowseJobsSearchProps = {
  className?: string
}

export function BrowseJobsSearch({ className }: BrowseJobsSearchProps) {
  const [keyword, setKeyword] = useState("")
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    console.log(data)
    const search = data.searchField

    const params = new URLSearchParams()
    params.set("search", search as string)

    router.push(`/browse-jobs?${params.toString()}`)

  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-black/[0.06] bg-white p-2 shadow-[0_1px_2px_rgba(16,10,6,0.03)] sm:flex-row sm:items-center dark:border-white/[0.06] dark:bg-[#141110] dark:shadow-none",
        className
      )}
    >
      <div className="flex h-11 min-w-0 flex-1 items-center gap-3 px-3">
        <Search
          aria-hidden="true"
          className="size-[18px] shrink-0 text-[#1A1410]/30 dark:text-white/30"
        />

        <label htmlFor="browse-jobs-keyword" className="sr-only">
          Search by job title or keyword
        </label>
        <Input
          id="browse-jobs-keyword"
          name="searchField"
          type="text"
          placeholder="Search by job title, keywords..."
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="h-10 min-w-0 flex-1 border-0 bg-transparent px-0 text-sm text-[#1A1410] shadow-none placeholder:text-[#1A1410]/35 focus-visible:ring-0 dark:bg-transparent dark:text-white dark:placeholder:text-white/30"
        />
      </div>

      <Button
        type="submit"
        className="h-11 w-full shrink-0 rounded-lg bg-[#1A1410] px-5 text-sm font-medium text-white transition-colors hover:bg-[#2A211A] sm:w-auto dark:bg-white dark:text-[#0A0807] dark:hover:bg-white/90"
      >
        Search Jobs
      </Button>
    </form>
  )
}
