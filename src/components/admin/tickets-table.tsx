"use client"

import { MoreVerticalIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"
import { toast } from "sonner"

import { deleteTicket } from "@/components/admin/actions"
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
import { Badge } from "@/components/ui/badge"
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
import { cn, normalizeStatus } from "@/lib/utils"
import type { Ticket } from "@/server/db/schema"

type ActionState = {
  action: "delete" | null
  isPending: boolean
  ticketId: number | null
}

interface TicketsTableProps {
  tickets: Ticket[]
}

export function TicketsTable({ tickets }: TicketsTableProps) {
  const router = useRouter()

  const [state, setState] = React.useState<ActionState>({
    action: null,
    isPending: false,
    ticketId: null,
  })

  function resetState() {
    setState({
      ...state,
      action: null,
      isPending: false,
      ticketId: null,
    })
  }

  async function handleDeleteTicket(ticketId: number) {
    try {
      setState({
        action: "delete",
        isPending: true,
        ticketId,
      })

      const ticket = await deleteTicket(ticketId)
      if (!ticket) {
        toast.error("Ticket not found. It may have already been deleted.")
        return
      }

      toast.success("Ticket deleted")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      resetState()
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] text-muted-foreground">
            Status
          </TableHead>
          <TableHead className="text-muted-foreground">Reason</TableHead>
          <TableHead className="text-muted-foreground">Description</TableHead>
          <TableHead className="text-right" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.length === 0 ? (
          <TableRow>
            <TableCell
              className="text-center text-muted-foreground"
              colSpan={4}
            >
              No tickets have been created yet.
            </TableCell>
          </TableRow>
        ) : (
          tickets.map((ticket) => (
            <TableRow className="odd:bg-secondary" key={ticket.id}>
              <TableCell>
                <Badge
                  className={cn(
                    "font-medium text-white capitalize",
                    normalizeStatus(ticket.status).className
                  )}
                >
                  {normalizeStatus(ticket.status).label}
                </Badge>
              </TableCell>
              <TableCell>{ticket.reason}</TableCell>
              <TableCell>{ticket.description}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreVerticalIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="text-muted-foreground">
                      Manage Ticket
                    </DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link href={`/tickets/${ticket.id}`}>View Details</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={
                        (state.isPending &&
                          state.action === "delete" &&
                          state.ticketId === ticket.id) ||
                        ticket.status !== "closed"
                      }
                      onClick={() => {
                        setState({
                          ...state,
                          action: "delete",
                          isPending: false,
                          ticketId: ticket.id,
                        })
                      }}
                      variant="destructive"
                    >
                      Delete Ticket
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialog
                  onOpenChange={(open) => {
                    setState({
                      ...state,
                      action: open ? "delete" : null,
                      isPending: false,
                      ticketId: open ? ticket.id : null,
                    })
                  }}
                  open={
                    state.action === "delete" && state.ticketId === ticket.id
                  }
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete this ticket?
                      </AlertDialogTitle>
                      <AlertDialogDescription></AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button
                          disabled={
                            state.isPending && state.action === "delete"
                          }
                          onClick={(e) => {
                            e.preventDefault()
                            handleDeleteTicket(ticket.id)
                          }}
                          variant="destructive"
                        >
                          {state.action === "delete" && state.isPending ? (
                            <Spinner />
                          ) : (
                            "Delete Ticket"
                          )}
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
