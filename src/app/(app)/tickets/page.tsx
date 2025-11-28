import { desc, eq } from "drizzle-orm"
import { redirect } from "next/navigation"

import { TicketForm } from "@/components/ticket/ticket-form"
import { UserTicketsList } from "@/components/ticket/user-tickets-list"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { getSession } from "@/server/auth/utils"
import { db } from "@/server/db"
import { ticket } from "@/server/db/schema"

export default async function TicketsPage() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  const tickets = await db
    .select()
    .from(ticket)
    .where(eq(ticket.userId, session.user.id))
    .orderBy(desc(ticket.updatedAt))

  return (
    <>
      <Card className="rounded-b-none border-b-0">
        <CardHeader>
          <CardTitle className="font-medium text-2xl text-foreground">
            Existing Tickets
          </CardTitle>
          <CardDescription
            className={cn(
              "text-muted-foreground leading-relaxed",
              tickets.length === 0 && "mt-6"
            )}
          >
            {tickets.length > 0
              ? `You have ${tickets.length} tickets created.`
              : "You haven't created any tickets yet!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserTicketsList tickets={tickets} />
          <Separator />
        </CardContent>
      </Card>

      <Card className="flex flex-col rounded-t-none border-t-0 md:flex-row">
        <div className="flex-[0.35] shrink-0">
          <CardHeader>
            <CardTitle className="font-medium text-foreground text-xl">
              New Ticket
            </CardTitle>
            <CardDescription className="text-muted-foreground leading-relaxed">
              Describe your issue in detail.
            </CardDescription>
          </CardHeader>
        </div>
        <CardContent className="flex-[0.65] pt-0 md:pt-4">
          <TicketForm />
        </CardContent>
      </Card>
    </>
  )
}
