import { headers } from "next/headers"
import * as React from "react"

import { auth } from "@/server/auth"

export const getSession = React.cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) return null

  return { ...session.session, user: session.user }
})
