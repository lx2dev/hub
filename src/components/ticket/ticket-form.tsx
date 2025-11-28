"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { ticketFormSchema, ticketReasons } from "@/schema"

export function TicketForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof ticketFormSchema>>({
    defaultValues: {
      description: "",
      reason: "-",
    },
    resolver: zodResolver(ticketFormSchema),
  })

  const isPending = form.formState.isSubmitting

  async function onSubmit(values: z.infer<typeof ticketFormSchema>) {
    if (isPending) return

    try {
      const res = await fetch("/api/submit-ticket", {
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })

      const data = await res.json()

      if (res.status === 429) {
        toast.error(
          "You are submitting tickets too quickly. Please try again later."
        )
        return
      }
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      form.reset()
      toast.success("Ticket submitted", {
        description: "We will get back to you shortly.",
      })
      router.refresh()
    } catch (error) {
      console.error("Error submitting ticket:", error)
      toast.error("An unexpected error occurred. Please try again later.")
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/90">Reason</FormLabel>
              <Select
                disabled={isPending}
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="-" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ticketReasons.options.map((reason, idx) => (
                    <SelectItem key={idx} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground/90">Description</FormLabel>
              <FormControl>
                <InputGroup>
                  <InputGroupTextarea
                    disabled={isPending}
                    {...field}
                    className="resize-none"
                    rows={8}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText
                      className={cn(
                        "text-muted-foreground text-xs",
                        field.value.length > 500 && "text-destructive"
                      )}
                    >
                      {field.value.length}/500 characters left
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button className="uppercase" disabled={isPending} type="submit">
            {isPending ? <Spinner /> : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
