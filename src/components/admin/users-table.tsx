"use client"

import type { User } from "better-auth"
import type { UserWithRole } from "better-auth/plugins"
import { formatDate } from "date-fns"
import {
  BadgeCheckIcon,
  BadgeXIcon,
  CircleIcon,
  CircleSlash2Icon,
  MoreVerticalIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { authClient } from "@/lib/auth/client"
import { cn } from "@/lib/utils"

interface UsersTableProps {
  users: UserWithRole[] | undefined
  currentUser: User
}

type ActionState = {
  action: "ban" | "unban" | null
  isPending: boolean
  userId: string | null
}

export function UsersTable({ users, currentUser }: UsersTableProps) {
  const router = useRouter()

  const [state, setState] = React.useState<ActionState>({
    action: null,
    isPending: false,
    userId: null,
  })

  async function handleBanUser(userId: string) {
    try {
      setState({
        ...state,
        action: "ban",
        isPending: true,
        userId: userId,
      })

      const res = await authClient.admin.banUser({ userId })
      if (res.error) {
        toast.error(`Failed to ban user: ${res.error.message}`)
      }

      toast.success("User has been banned successfully.")
      router.refresh()
    } catch (error) {
      console.error("Failed to ban user:", error)
      toast.error("Failed to ban user. Please try again.")
    } finally {
      setState({
        ...state,
        action: null,
        isPending: false,
        userId: null,
      })
    }
  }

  async function handleUnbanUser(userId: string) {
    try {
      setState({
        ...state,
        action: "unban",
        isPending: true,
        userId: userId,
      })

      const res = await authClient.admin.unbanUser({ userId })
      if (res.error) {
        toast.error(`Failed to unban user: ${res.error.message}`)
      }

      toast.success("User has been unbanned successfully.")
      router.refresh()
    } catch (error) {
      console.error("Failed to unban user:", error)
      toast.error("Failed to unban user. Please try again.")
    } finally {
      setState({
        ...state,
        action: null,
        isPending: false,
        userId: null,
      })
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] text-muted-foreground">
            Banned
          </TableHead>
          <TableHead className="w-[150px] text-muted-foreground">
            Email Verified
          </TableHead>
          <TableHead className="text-muted-foreground">Email</TableHead>
          <TableHead className="text-muted-foreground">Name</TableHead>
          <TableHead className="text-right">Created At</TableHead>
          <TableHead className="text-right" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {!users || users.length === 0 ? (
          <TableRow>
            <TableCell
              className="text-center text-muted-foreground"
              colSpan={4}
            >
              No users have been created yet.
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow className="odd:bg-accent" key={user.id}>
              <TableCell>
                {user.banned ? (
                  <CircleSlash2Icon className="size-5 stroke-red-500" />
                ) : (
                  <CircleIcon className="size-5 stroke-green-500" />
                )}
              </TableCell>
              <TableCell>
                {user.emailVerified ? (
                  <BadgeCheckIcon className="size-5 stroke-green-500" />
                ) : (
                  <BadgeXIcon className="size-5 stroke-red-500" />
                )}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell className="text-right">
                {formatDate(user.createdAt, "PP")}
              </TableCell>
              <TableCell
                className={cn(
                  "text-right",
                  user.id === currentUser.id && "py-[26.25px]"
                )}
              >
                {user.id === currentUser.id ? null : (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          disabled={user.id === currentUser.id}
                          size="icon"
                          variant="ghost"
                        >
                          <MoreVerticalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="text-muted-foreground">
                          Manage User
                        </DropdownMenuLabel>
                        {user.banned ? (
                          <DropdownMenuItem
                            disabled={
                              user.id === currentUser.id ||
                              (state.action === "unban" && state.isPending)
                            }
                            onClick={() =>
                              setState({
                                ...state,
                                action: "unban",
                                isPending: false,
                                userId: user.id,
                              })
                            }
                          >
                            Unban
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            disabled={
                              user.id === currentUser.id ||
                              (state.action === "ban" && state.isPending)
                            }
                            onClick={() =>
                              setState({
                                ...state,
                                action: "ban",
                                isPending: false,
                                userId: user.id,
                              })
                            }
                          >
                            Ban
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialog
                      onOpenChange={() => {
                        setState({
                          ...state,
                          action: "ban",
                          isPending: false,
                          userId: user.id,
                        })
                      }}
                      open={state.action === "ban" && state.userId === user.id}
                    >
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to ban this user?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            The user with the email{" "}
                            <span className="font-semibold">
                              "{user.email}"
                            </span>{" "}
                            will be permanently banned from accessing the
                            platform.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Button
                              disabled={
                                user.id === currentUser.id ||
                                (state.action === "ban" && state.isPending)
                              }
                              onClick={(e) => {
                                e.preventDefault()
                                handleBanUser(user.id)
                              }}
                              variant="destructive"
                            >
                              {state.action === "ban" && state.isPending ? (
                                <Spinner />
                              ) : (
                                "Ban User"
                              )}
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog
                      onOpenChange={() => {
                        setState({
                          ...state,
                          action: "unban",
                          isPending: false,
                          userId: user.id,
                        })
                      }}
                      open={
                        state.action === "unban" && state.userId === user.id
                      }
                    >
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to unban this user?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            The user with the email{" "}
                            <span className="font-semibold">
                              "{user.email}"
                            </span>{" "}
                            will be unbanned and allowed to access the platform
                            again.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction asChild>
                            <Button
                              disabled={
                                user.id === currentUser.id ||
                                (state.action === "unban" && state.isPending)
                              }
                              onClick={(e) => {
                                e.preventDefault()
                                handleUnbanUser(user.id)
                              }}
                              variant="destructive"
                            >
                              {state.action === "unban" && state.isPending ? (
                                <Spinner />
                              ) : (
                                "Unban User"
                              )}
                            </Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
