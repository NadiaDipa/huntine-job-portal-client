
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2Icon } from "lucide-react"
import { toast } from "sonner"

import { deleteJob } from "@/app/api/jobs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

export function DeleteJobDialog({
  jobId,
  jobTitle,
  onDeleted,
}: {
  jobId: string
  jobTitle: string
  onDeleted?: () => void
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    try {
      const res = await deleteJob(jobId)

      if (res.deletedCount) {
        setOpen(false)

        toast.success("Job post deleted", {
          description: jobTitle,
        })

        onDeleted?.()
        router.refresh()
      } else {
        toast.error("Could not delete the job post", {
          description: "The job was not found.",
        })
      }
    } catch (error) {
      toast.error("Could not delete the job post", {
        description:
          error instanceof Error ? error.message : "Something went wrong.",
      })
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="destructive"
            size="icon"
            aria-label={`Delete ${jobTitle}`}
            title={`Delete ${jobTitle}`}
            className="size-8 rounded-lg border-rose-500/20 bg-rose-500/10 text-rose-500 shadow-none hover:border-rose-500/30 hover:bg-rose-500/20 hover:text-rose-400 dark:border-rose-500/25 dark:bg-rose-500/15 dark:text-rose-400 dark:hover:bg-rose-500/25 dark:hover:text-rose-300"
          >
            <Trash2Icon className="size-3.5" />
          </Button>
        }
      />

      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete job post?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold text-foreground">{jobTitle}</span>{" "}
            will be removed from your listings permanently. This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
