"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { User } from "better-auth"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type z from "zod"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { authClient } from "@/lib/auth/client"
import { userInsertSchema } from "@/server/db/schema"

interface ProfileFormProps {
  user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const form = useForm<Partial<z.infer<typeof userInsertSchema>>>({
    defaultValues: {
      email: user.email,
      image: user.image,
      name: user.name,
    },
    resolver: zodResolver(userInsertSchema.partial()),
  })

  const isPending = form.formState.isSubmitting

  async function onSubmit(values: Partial<z.infer<typeof userInsertSchema>>) {
    if (values.name === user.name && values.email === user.email) return

    if (values.name !== user.name) {
      await authClient.updateUser({
        name: values.name,
      })
    }
    if (values.email && values.email !== user.email) {
      await authClient.changeEmail({
        callbackURL: window.location.href,
        newEmail: values.email,
      })
    }

    form.reset(values)
    toast.success("Profile updated successfully", {
      description:
        values.email !== user.email
          ? "Please check your new email to verify the change."
          : undefined,
    })
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form
            className="relative grid gap-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-2">
              <Label>Avatar</Label>
              <Avatar className="mt-1 size-20">
                {user?.image && (
                  <AvatarImage alt={user.name} src={user.image} />
                )}
                <AvatarFallback>
                  {user?.name ? user.name.charAt(0) : "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="absolute top-0 right-0"
              disabled={isPending}
              type="submit"
              variant="default"
            >
              {isPending ? <Spinner /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
