import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { auth } from "@/server/auth"

export async function GET(_req: NextRequest) {
  const res = await auth.api.signInSocial({
    body: {
      callbackURL: "/",
      provider: "discord",
    },
  })

  return NextResponse.redirect(res.url ?? "/")
}
