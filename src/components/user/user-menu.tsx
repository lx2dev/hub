import type { User } from "better-auth"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import * as React from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/user/user-avatar"
import { config } from "@/constants"
import { authClient } from "@/lib/auth/client"

interface UserMenuProps {
  user?: User
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()
  const { setTheme, resolvedTheme } = useTheme()

  const LINKS = config.internalLinks

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 max-w-xs">
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Manage Account
        </DropdownMenuLabel>
        {LINKS.profileLinks.map((link) => (
          <DropdownMenuItem asChild className="cursor-pointer" key={link.href}>
            <Link
              // @ts-expect-error Invalid types from typed-routes
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : "_self"}
            >
              {link.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Preferences
        </DropdownMenuLabel>
        <DropdownMenuItem className="cursor-pointer" onClick={toggleTheme}>
          Change theme
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() =>
            authClient.signOut({
              fetchOptions: {
                onSuccess() {
                  router.push("/")
                },
              },
            })
          }
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
