"use server"

import { eq } from "drizzle-orm"

import { getSession } from "@/server/auth/utils"
import { db } from "@/server/db"
import { ticket as ticketTable } from "@/server/db/schema"

export async function deleteTicket(ticketId: number) {
  const session = await getSession()
  if (session?.user?.role !== "admin") {
    throw new Error("UNAUTHORIZED", { cause: 401 })
  }

  const [ticket] = await db
    .delete(ticketTable)
    .where(eq(ticketTable.id, ticketId))
    .returning()

  return ticket
}
