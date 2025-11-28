"use client"

import * as React from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { authClient, useSession } from "@/lib/auth/client"

export function RevokeSessions() {
  const { data: session } = useSession()

  const [open, setOpen] = React.useState<boolean>(false)
  const [isPending, setIsPending] = React.useState(false)

  async function handleRevokeSessions() {
    if (!session) return

    try {
      setIsPending(true)
      await authClient.revokeOtherSessions()

      toast.success("Logged out of other browser sessions.")
      setOpen(false)
    } catch (error) {
      console.error(error)
      toast.error("Failed to log out of other browser sessions.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card>
      <CardContent>
        <div className="max-w-xl text-muted-foreground text-sm">
          If necessary, you may log out of all of your other browser sessions
          across all of your devices. Some of your recent sessions are listed
          below; however, this list may not be exhaustive. If you feel your
          account has been compromised, you should also update your password.
        </div>
        <div className="mt-5 flex items-center">
          <AlertDialog onOpenChange={setOpen} open={open}>
            <AlertDialogTrigger asChild>
              <Button disabled={isPending} variant="destructive">
                Log Out Other Browser Sessions
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="top-0 translate-y-[25%] sm:max-w-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Log Out Other Browser Sessions
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you would like to log out of your other browser
                  sessions across all of your devices?
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="mt-4">
                <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                <Button
                  disabled={isPending}
                  onClick={handleRevokeSessions}
                  variant="destructive"
                >
                  {isPending ? <Spinner /> : "Log Out Other Browser Sessions"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
