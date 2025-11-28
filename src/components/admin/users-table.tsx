"use client"

import { zodResolver } from "@hookform/resolvers/zod"
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
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod"

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { banFormSchema } from "@/schema"

type ActionState = {
  action: "ban" | "unban" | "banDetails" | "delete" | null
  isPending: boolean
  userId: string | null
}

const timeFrames = [
  "minutes",
  "hours",
  "days",
  "weeks",
  "months",
  "years",
] as const
type TimeFrame = (typeof timeFrames)[number]

const timeFrameMultipliers: Record<TimeFrame, number> = {
  days: 86400,
  hours: 3600,
  minutes: 60,
  months: 2592000,
  weeks: 604800,
  years: 31536000,
}

interface UsersTableProps {
  users: UserWithRole[] | undefined
  currentUser: User
}

export function UsersTable({ users, currentUser }: UsersTableProps) {
  const router = useRouter()

  const [timeFrame, setTimeFrame] = React.useState<TimeFrame>("minutes")
  const [state, setState] = React.useState<ActionState>({
    action: null,
    isPending: false,
    userId: null,
  })

  const form = useForm<z.infer<typeof banFormSchema>>({
    defaultValues: {
      duration: "24",
      reason: "",
      userId: "",
    },
    resolver: zodResolver(banFormSchema),
  })

  const isSubmitting = form.formState.isSubmitting

  async function handleBanUser(values: z.infer<typeof banFormSchema>) {
    try {
      setState({
        ...state,
        action: "ban",
        isPending: true,
        userId: values.userId,
      })

      const banExpiresIn = values.duration
        ? Number(values.duration) * timeFrameMultipliers[timeFrame]
        : undefined

      const res = await authClient.admin.banUser({
        banExpiresIn,
        banReason: values.reason,
        userId: values.userId,
      })

      if (res.error) {
        toast.error(`Failed to ban user: ${res.error.message}`)
        return
      }

      toast.success("User has been banned.")
      router.refresh()
      form.reset()
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
        return
      }

      toast.success("User has been unbanned.")
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
          <TableHead className="text-muted-foreground">Banned</TableHead>
          <TableHead className="text-muted-foreground">Ban Reason</TableHead>
          <TableHead className="text-muted-foreground">Ban Expires</TableHead>
          <TableHead className="text-muted-foreground">
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
              <TableCell className="max-w-[200px] truncate">
                {user.banReason || "-"}
              </TableCell>
              <TableCell>
                {user.banExpires
                  ? formatDate(new Date(user.banExpires), "PP")
                  : "-"}
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
                          <>
                            <DropdownMenuItem
                              disabled={
                                user.id === currentUser.id ||
                                (state.action === "unban" && state.isPending)
                              }
                              onClick={() => {
                                setState({
                                  ...state,
                                  action: "banDetails",
                                  isPending: false,
                                  userId: user.id,
                                })
                              }}
                            >
                              View Ban Details
                            </DropdownMenuItem>
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
                          </>
                        ) : (
                          <DropdownMenuItem
                            disabled={
                              user.id === currentUser.id ||
                              (state.action === "ban" && state.isPending)
                            }
                            onClick={() => {
                              setState({
                                ...state,
                                action: "ban",
                                isPending: false,
                                userId: user.id,
                              })
                              form.setValue("userId", user.id)
                            }}
                          >
                            Ban
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialog
                      onOpenChange={(open) => {
                        setState({
                          ...state,
                          action: open ? "ban" : null,
                          isPending: false,
                          userId: open ? user.id : null,
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

                        <Form {...form}>
                          <form
                            className="space-y-8"
                            onSubmit={form.handleSubmit(handleBanUser)}
                          >
                            <FormField
                              control={form.control}
                              name="userId"
                              render={() => (
                                <input defaultValue={user.id} hidden />
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="reason"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Reason for Ban</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="duration"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Duration of Ban</FormLabel>
                                  <InputGroup>
                                    <FormControl>
                                      <InputGroupInput
                                        type="number"
                                        {...field}
                                      />
                                    </FormControl>
                                    <InputGroupAddon align="inline-end">
                                      <Select
                                        onValueChange={(value) => {
                                          setTimeFrame(value as TimeFrame)
                                        }}
                                        value={timeFrame}
                                      >
                                        <InputGroupButton
                                          asChild
                                          className="pr-1.5! text-xs"
                                          variant="ghost"
                                        >
                                          <SelectTrigger className="border-0 bg-transparent focus:ring-0! dark:bg-transparent">
                                            <SelectValue placeholder="Days" />
                                          </SelectTrigger>
                                        </InputGroupButton>
                                        <SelectContent align="end">
                                          {timeFrames.map((frame) => (
                                            <SelectItem
                                              key={frame}
                                              value={frame}
                                            >
                                              {frame.charAt(0).toUpperCase() +
                                                frame.slice(1)}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </InputGroupAddon>
                                  </InputGroup>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <AlertDialogFooter>
                              <AlertDialogCancel type="button">
                                Cancel
                              </AlertDialogCancel>
                              <Button
                                disabled={
                                  user.id === currentUser.id ||
                                  isSubmitting ||
                                  (state.action === "ban" && state.isPending)
                                }
                                variant="destructive"
                              >
                                {isSubmitting ||
                                (state.action === "ban" && state.isPending) ? (
                                  <Spinner />
                                ) : (
                                  "Ban User"
                                )}
                              </Button>
                            </AlertDialogFooter>
                          </form>
                        </Form>
                      </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog
                      onOpenChange={(open) => {
                        setState({
                          ...state,
                          action: open ? "unban" : null,
                          isPending: false,
                          userId: open ? user.id : null,
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

                    <Dialog
                      onOpenChange={(open) => {
                        setState({
                          ...state,
                          action: open ? "banDetails" : null,
                          isPending: false,
                          userId: open ? user.id : null,
                        })
                      }}
                      open={
                        state.action === "banDetails" &&
                        state.userId === user.id
                      }
                    >
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Ban Details</DialogTitle>
                          <DialogDescription>
                            Details about the ban for user "{user.email}".
                          </DialogDescription>
                        </DialogHeader>
                        <div>
                          <p className="font-semibold text-muted-foreground">
                            Reason:
                          </p>{" "}
                          {user.banReason || "-"}
                        </div>
                        <div>
                          <p className="font-semibold text-muted-foreground">
                            Ban Expires:
                          </p>{" "}
                          {user.banExpires
                            ? formatDate(new Date(user.banExpires), "PP")
                            : "-"}
                        </div>
                      </DialogContent>
                    </Dialog>
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
