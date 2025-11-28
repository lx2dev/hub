import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { admin } from "better-auth/plugins"

import { env } from "@/env"
import { resend } from "@/lib/resend"
import { db } from "@/server/db"

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      await resend.emails.send({
        from: "Lx2 Dev <no-reply@lx2.dev>",
        html: `<p>Click <a href="${url}">here</a> to verify your email address.</p>`,
        subject: "Verify your email address",
        to: user.email,
      })
    },
  },
  plugins: [admin(), nextCookies()],
  socialProviders: {
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      async sendChangeEmailConfirmation({ user, newEmail, url }) {
        await resend.emails.send({
          from: "Lx2 Dev <no-reply@lx2.dev>",
          html: `<p>Click <a href="${url}">here</a> to confirm your email change to ${newEmail}.</p>`,
          subject: "Confirm your email change",
          to: user.email,
        })
      },
    },
  },
})
