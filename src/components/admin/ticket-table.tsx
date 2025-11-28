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
import { cn, normalizeStatus } from "@/lib/utils"
import type { Ticket } from "@/server/db/schema"

interface TicketTableProps {
  tickets: Ticket[]
}

export function TicketTable({ tickets }: TicketTableProps) {
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
                <Button asChild className="p-0!" size="sm" variant="link">
                  <Link href={`/tickets/${ticket.id}`}>
                    Details <ArrowRightIcon />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
