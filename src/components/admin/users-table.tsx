"use client"

import type { User } from "better-auth"
import { formatDate } from "date-fns"
import { BadgeCheckIcon, BadgeXIcon, MoreVerticalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

interface UsersTableProps {
  users: User[]
  currentUser: User
}

export function UsersTable({ users, currentUser }: UsersTableProps) {
  async function handleBanUser(userId: string) {
    console.log({ userId })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px] text-muted-foreground">
            Email Verified
          </TableHead>
          <TableHead className="text-muted-foreground">Email</TableHead>
          <TableHead className="text-muted-foreground">Name</TableHead>
          <TableHead className="text-right">Created At</TableHead>
          <TableHead className="text-right" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell
              className="text-center text-muted-foreground"
              colSpan={4}
            >
              No users have been created yet.
            </TableCell>
          </TableRow>
        ) : (
          users.map((user) => (
            <TableRow className="odd:bg-accent" key={user.id}>
              <TableCell>
                {user.emailVerified ? (
                  <BadgeCheckIcon className="size-5 stroke-green-500" />
                ) : (
                  <BadgeXIcon className="size-5 stroke-red-500" />
                )}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell className="text-right">
                {formatDate(user.createdAt, "PP")}
              </TableCell>
              <TableCell
                className={cn(
                  "text-right",
                  user.id === currentUser.id && "py-[26.25px]"
                )}
              >
                {user.id === currentUser.id ? null : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        disabled={user.id === currentUser.id}
                        size="icon"
                        variant="ghost"
                      >
                        <MoreVerticalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel className="text-muted-foreground">
                        Manage User
                      </DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleBanUser(user.id)}>
                        Ban
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
