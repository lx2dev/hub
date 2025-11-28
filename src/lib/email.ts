import { resend } from "@/lib/resend"

interface EmailParams {
  to: string
  from: string
  name: string
  subject: string
  message: string
}

export async function sendEmail(params: EmailParams): Promise<void> {
  const { to, from, name, subject, message } = params

  await resend.emails.send({
    from: "tickets@lx2.dev",
    html: `
        <h2>New Support Ticket</h2>
        <p><strong>From:</strong> ${name} (${from})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    subject: `[Support Ticket] ${subject}`,
    to,
  })
}
