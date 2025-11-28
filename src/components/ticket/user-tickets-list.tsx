import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { Ticket, TicketStatus } from "@/server/db/schema"

interface UserTicketsListProps {
  tickets: Ticket[]
}

function normalizeStatus(status: TicketStatus) {
  switch (status) {
    case "open":
      return {
        label: "Open",
        className: "border-green-500/50 bg-green-500/20",
      }
    case "in_progress":
      return {
        label: "In Progress",
        className: "border-yellow-500/50 bg-yellow-500/20",
      }
    case "closed":
      return {
        label: "Closed",
        className: "border-blue-500/50 bg-blue-500/20",
      }
    default:
      return status
  }
}

export function UserTicketsList({ tickets }: UserTicketsListProps) {
  return tickets.length > 0 ? (
    <Table className="mb-6">
      <TableHeader>
        <TableRow>
          <TableHead className="text-muted-foreground w-[100px]">
            Status
          </TableHead>
          <TableHead className="text-muted-foreground">Reason</TableHead>
          <TableHead className="text-muted-foreground">Description</TableHead>
          <TableHead className="text-right" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket.id} className="odd:bg-secondary">
            <TableCell>
              <Badge
                className={cn(
                  "font-medium text-white capitalize",
                  normalizeStatus(ticket.status).className,
                )}
              >
                {normalizeStatus(ticket.status).label}
              </Badge>
            </TableCell>
            <TableCell>{ticket.reason}</TableCell>
            <TableCell>{ticket.description}</TableCell>
            <TableCell className="text-right">
              <Button size="sm" variant="link" className="p-0!" asChild>
                <Link href={`/tickets/${ticket.id}`}>
                  Details <ArrowRightIcon />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ) : null
}
