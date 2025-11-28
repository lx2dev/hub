import z from "zod"

import { reasonsEnum } from "@/server/db/schema"

export const ticketReasons = z.enum(["-", ...reasonsEnum.enumValues])

export const ticketFormSchema = z.object({
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters long",
    })
    .max(500, {
      message: "Description must be at most 500 characters long",
    }),
  reason: ticketReasons.refine((val) => val !== "-", {
    message: "Please select a reason",
  }),
})

export const banFormSchema = z.object({
  duration: z.string().optional(),
  reason: z.string().min(5, {
    message: "Reason must be at least 5 characters long",
  }),
  userId: z.string(),
})
