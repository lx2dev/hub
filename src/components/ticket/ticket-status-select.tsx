"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { updateTicketStatus } from "@/components/ticket/actions"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { normalizeStatus } from "@/lib/utils"
import type { Ticket } from "@/server/db/schema"
import { ticketStatusEnum } from "@/server/db/schema"

interface TicketStatusSelectProps {
  isAdmin: boolean
  ticket: Ticket
}

export function TicketStatusSelect({
  isAdmin,
  ticket,
}: TicketStatusSelectProps) {
  const router = useRouter()

  async function handleUpdateStatus(newStatus: string) {
    if (!isAdmin) return

    try {
      await updateTicketStatus(ticket.id, newStatus, isAdmin)

      toast.success("Ticket status updated successfully")
      router.refresh()
    } catch (error) {
      console.error("Error updating ticket status:", error)
      toast.error("Failed to update ticket status")
    }
  }

  return (
    <Select
      defaultValue={ticket.status}
      disabled={!isAdmin}
      onValueChange={handleUpdateStatus}
    >
      <SelectTrigger className="min-w-[150px] capitalize">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ticketStatusEnum.enumValues.map((status) => (
          <SelectItem className="capitalize" key={status} value={status}>
            {normalizeStatus(status).label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
