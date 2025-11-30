import { eq } from "drizzle-orm"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { TicketStatusSelect } from "@/components/ticket/ticket-status-select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn, normalizeStatus } from "@/lib/utils"
import { getSession } from "@/server/auth/utils"
import { db } from "@/server/db"
import { ticket as ticketTable, user as userTable } from "@/server/db/schema"

export default async function TicketPage({
  params,
}: PageProps<"/tickets/[id]">) {
  const { id } = await params

  const session = await getSession()

  const isAdmin = session?.user?.role === "admin"

  const [{ ticket, ticketUser }] = await db
    .select({
      ticket: ticketTable,
      ticketUser: userTable,
    })
    .from(ticketTable)
    .rightJoin(userTable, eq(ticketTable.userId, userTable.id))
    .where(eq(ticketTable.id, Number(id)))

  if (!ticket || !session || (ticket.userId !== session.user?.id && !isAdmin)) {
    return notFound()
  }

  return (
    <div className="space-y-4">
      <Button asChild size="sm" variant="ghost">
        <Link href={isAdmin ? "/admin" : "/tickets"}>
          <ArrowLeftIcon /> Back
        </Link>
      </Button>

      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "capitalize",
                normalizeStatus(ticket.status).className
              )}
            >
              {normalizeStatus(ticket.status).label}
            </Badge>
            <h1 className="font-bold text-2xl">
              Ticket Details for #{ticket.id}
            </h1>
          </div>

          <p className="text-muted-foreground text-sm">
            Submitted by{" "}
            <span className="font-semibold">{ticketUser.name}</span> (
            {ticketUser.email})
          </p>
        </div>

        {isAdmin && <TicketStatusSelect isAdmin={isAdmin} ticket={ticket} />}
      </div>
      <Card>
        <CardContent className="space-y-6">
          <div>
            <h2 className="mb-2 text-muted-foreground text-sm">Reason:</h2>
            <Input
              className="whitespace-pre-wrap disabled:opacity-100"
              defaultValue={ticket.reason}
              disabled
              readOnly
            />
          </div>

          <div>
            <h2 className="mb-2 text-muted-foreground text-sm">Description:</h2>
            <Textarea
              className="min-h-[100px] resize-none whitespace-pre-wrap disabled:cursor-default disabled:opacity-100"
              defaultValue={ticket.description}
              disabled
              readOnly
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
