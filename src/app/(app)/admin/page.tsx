import { desc } from "drizzle-orm"

import { TicketsTable } from "@/components/admin/tickets-table"
import { UsersTable } from "@/components/admin/users-table"
import { Separator } from "@/components/ui/separator"
import { db } from "@/server/db"
import { ticket, user } from "@/server/db/schema"

export default async function AdminPage() {
  const tickets = await db.select().from(ticket).orderBy(desc(ticket.createdAt))
  const users = await db.select().from(user).orderBy(desc(user.createdAt))

  return (
    <>
      <div className="md:grid md:grid-cols-5 md:gap-6">
        <div className="flex justify-between md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="font-medium text-foreground text-lg">
              Support Tickets ({tickets.length})
            </h3>
          </div>
          <div className="px-4 sm:px-0" />
        </div>

        <div className="mt-5 md:col-span-4 md:mt-0">
          <TicketsTable tickets={tickets} />
        </div>
      </div>

      <div className="hidden sm:block">
        <Separator className="my-12 w-full" />
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-5 md:gap-6">
          <div className="flex justify-between md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="font-medium text-foreground text-lg">
                Users ({users.length})
              </h3>
            </div>
            <div className="px-4 sm:px-0" />
          </div>

          <div className="mt-5 md:col-span-4 md:mt-0">
            <UsersTable users={users} />
          </div>
        </div>
      </div>
    </>
  )
}
