"use server"

import { eq } from "drizzle-orm"

import { db } from "@/server/db"
import type { ticketStatusEnum } from "@/server/db/schema"
import { ticket as ticketTable } from "@/server/db/schema"

export async function updateTicketStatus(ticketId: number, newStatus: string) {
  await db
    .update(ticketTable)
    .set({
      status: newStatus as (typeof ticketStatusEnum.enumValues)[number],
    })
    .where(eq(ticketTable.id, ticketId))
}
