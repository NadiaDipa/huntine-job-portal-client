
"use client"

import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { toast } from "sonner"

type ApplyNowButtonProps = {
  jobId: string
}

const ApplyNowButton = ({ jobId }: ApplyNowButtonProps) => {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user

  const handleApplyNow = () => {
    if (!user) {
      router.push(`/sign-in?redirectTo=/browse-jobs/${jobId}`)
      return
    } else if (user.role === "seeker") {
      toast.info("Application feature is coming soon!")
      return
    } else if (user.role === "recruiter") {
      toast.error("Recruiters cannot apply for jobs.")
      return
    }
  }

  return (
    <div>
      <Button
        type="button"
        onClick={handleApplyNow}
        className="group h-11 flex-1 gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-[#0A0A0A] shadow-lg shadow-brand/20 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-xl hover:shadow-brand/25 active:translate-y-0 active:scale-[0.98] sm:flex-none"
      >
        <Send className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        Apply Now
      </Button>
    </div>
  )
}

export default ApplyNowButton
