import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import type { TicketStatus } from "@/server/db/schema"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeStatus(status: TicketStatus) {
  switch (status) {
    case "open":
      return {
        className: "border-green-500/50 bg-green-500/20",
        label: "Open",
      }
    case "in_progress":
      return {
        className: "border-yellow-500/50 bg-yellow-500/20",
        label: "In Progress",
      }
    case "closed":
      return {
        className: "border-blue-500/50 bg-blue-500/20",
        label: "Closed",
      }
    default:
      return status
  }
}
