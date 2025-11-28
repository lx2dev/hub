export default async function TicketPage({
  params,
}: PageProps<"/tickets/[id]">) {
  const { id } = await params

  return (
    <div>
      <h1>TicketPage</h1>
      <p>Ticket ID: {id}</p>
    </div>
  )
}
