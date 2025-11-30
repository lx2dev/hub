import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import z from "zod"

import { env } from "@/env"
import { sendEmail } from "@/lib/email"
import { rateLimiter } from "@/lib/ratelimit"
import { redis } from "@/lib/redis"
import type { ticketFormSchema } from "@/schema"
import { getSession } from "@/server/auth/utils"
import { db } from "@/server/db"
import { ticket } from "@/server/db/schema"

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "unknown"

    const { limit, remaining, success, reset } = await rateLimiter({
      endpoint: "submit-ticket",
      ip,
      limit: env.NODE_ENV === "development" ? 100 : 5,
      window: 1000 * 60 * 5,
    })
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset?.toString(),
          },
          status: 429,
        }
      )
    }

    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { reason, description } = body as z.infer<typeof ticketFormSchema>

    const { name, email } = session.user

    if (!name || !email || !reason || !description) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      )
    }
    if (reason === "-") {
      return NextResponse.json(
        { error: "Please select a reason." },
        { status: 400 }
      )
    }

    const isValidEmail = z.email().safeParse(email)
    if (!isValidEmail.success) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      )
    }

    const [newTicket] = await db
      .insert(ticket)
      .values({
        description,
        reason,
        userId: session.user.id,
      })
      .returning()
    if (!newTicket) {
      return NextResponse.json(
        { error: "Failed to create support ticket." },
        { status: 500 }
      )
    }

    await sendEmail({
      from: email,
      message: description,
      name,
      subject: reason,
      to: "lasse@lx2.dev",
    })

    const ticketId = `ticket:${Date.now()}:${Math.random()}`
    await redis.hset(ticketId, {
      createdAt: new Date().toISOString(),
      description,
      email,
      ip,
      name,
      reason,
    })

    await redis.expire(ticketId, 60 * 60 * 24 * 30)

    return NextResponse.json(
      { message: "Ticket submitted.", success: true },
      {
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset?.toString(),
        },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Error processing support ticket:", error)
    return NextResponse.json(
      { error: "Failed to process support ticket." },
      { status: 500 }
    )
  }
}
