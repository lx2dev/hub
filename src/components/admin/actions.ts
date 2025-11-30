"use server"

import { eq } from "drizzle-orm"

import { db } from "@/server/db"
import { ticket as ticketTable } from "@/server/db/schema"

export async function deleteTicket(ticketId: number) {
  const [ticket] = await db
    .delete(ticketTable)
    .where(eq(ticketTable.id, ticketId))
    .returning()

  return ticket
}
