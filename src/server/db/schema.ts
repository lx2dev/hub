import type { InferSelectModel } from "drizzle-orm"
import { relations, sql } from "drizzle-orm"
import { index, pgEnum, pgTableCreator } from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod"

export const createTable = pgTableCreator((name) => name)

export const reasonsEnum = pgEnum("ticket_reason", [
  "Abuse",
  "Appeal Offense",
  "Installation",
])
export const ticketStatusEnum = pgEnum("ticket_status", [
  "open",
  "in_progress",
  "closed",
])

export const ticket = createTable(
  "ticket",
  (d) => ({
    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    description: d.text().notNull(),
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    reason: reasonsEnum().notNull(),
    status: ticketStatusEnum().default("open").notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
    userId: d
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  }),
  (t) => [index("ticket_reason_idx").on(t.reason)]
)

export type Ticket = InferSelectModel<typeof ticket>
export type TicketStatus = (typeof ticketStatusEnum.enumValues)[number]

export const user = createTable("user", (d) => ({
  createdAt: d
    .timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  email: d.text("email").notNull().unique(),
  emailVerified: d.boolean("email_verified").default(false).notNull(),
  id: d.text("id").primaryKey(),
  image: d.text("image"),
  name: d.text("name").notNull(),
  updatedAt: d
    .timestamp("updated_at", { withTimezone: true })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}))

export const userInsertSchema = createInsertSchema(user)

export const session = createTable(
  "session",
  (d) => ({
    createdAt: d
      .timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiresAt: d.timestamp("expires_at").notNull(),
    id: d.text("id").primaryKey(),
    ipAddress: d.text("ip_address"),
    token: d.text("token").notNull().unique(),
    updatedAt: d
      .timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    userAgent: d.text("user_agent"),
    userId: d
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  }),
  (t) => [index("session_userId_idx").on(t.userId)]
)

export const account = createTable(
  "account",
  (d) => ({
    accessToken: d.text("access_token"),
    accessTokenExpiresAt: d.timestamp("access_token_expires_at"),
    accountId: d.text("account_id").notNull(),
    createdAt: d
      .timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    id: d.text("id").primaryKey(),
    idToken: d.text("id_token"),
    password: d.text("password"),
    providerId: d.text("provider_id").notNull(),
    refreshToken: d.text("refresh_token"),
    refreshTokenExpiresAt: d.timestamp("refresh_token_expires_at"),
    scope: d.text("scope"),
    updatedAt: d
      .timestamp("updated_at", { withTimezone: true })
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    userId: d
      .text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  }),
  (t) => [index("account_userId_idx").on(t.userId)]
)

export const verification = createTable(
  "verification",
  (d) => ({
    createdAt: d
      .timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    expiresAt: d.timestamp("expires_at").notNull(),
    id: d.text("id").primaryKey(),
    identifier: d.text("identifier").notNull(),
    updatedAt: d
      .timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    value: d.text("value").notNull(),
  }),
  (t) => [index("verification_identifier_idx").on(t.identifier)]
)

export const userRelations = relations(user, ({ many }) => ({
  accounts: many(account),
  sessions: many(session),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))
