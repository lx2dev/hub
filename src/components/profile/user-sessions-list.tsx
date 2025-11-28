"use client"

import type { Session } from "better-auth"
import { formatDate } from "date-fns"
import { EyeClosedIcon, EyeIcon } from "lucide-react"
import * as React from "react"
import { UAParser } from "ua-parser-js"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface UserSessionsListProps {
  sessions: Session[] | null
}

export function UserSessionsList({ sessions }: UserSessionsListProps) {
  const [showIp, setShowIp] = React.useState<boolean>(false)

  if (!sessions) return null

  return (
    <Table className="mt-6">
      <TableHeader>
        <TableRow>
          <TableHead className="text-muted-foreground">Device</TableHead>
          <TableHead className="text-muted-foreground">IP Address</TableHead>
          <TableHead className="text-right text-muted-foreground">
            Last Active
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => {
          const { browser, os } = UAParser(session.userAgent ?? "")

          return (
            <TableRow className="odd:bg-secondary" key={session.id}>
              <TableCell>
                {browser.name ?? "Unknown Browser"} on {os.name ?? "Unknown OS"}
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <input
                  className="max-w-32 border-0 outline-0 ring-0"
                  defaultValue={session.ipAddress ?? "Unknown IP"}
                  readOnly
                  type={showIp ? "text" : "password"}
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setShowIp(!showIp)}
                      size="icon-sm"
                      variant="ghost"
                    >
                      {showIp ? <EyeIcon /> : <EyeClosedIcon />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{showIp ? "Hide IP Address" : "Show IP Address"}</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell className="text-right">
                {formatDate(session.updatedAt, "PP p")}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
