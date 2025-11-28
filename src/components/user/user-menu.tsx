import type { User } from "better-auth"
import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/user/user-avatar"
import { LINKS } from "@/constants"
import { authClient } from "@/lib/auth/client"

interface UserMenuProps {
  user?: User
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <UserAvatar user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 max-w-xs">
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Manage Account
        </DropdownMenuLabel>
        {LINKS.profileLinks.map((link, idx) => (
          <DropdownMenuItem key={idx} className="cursor-pointer" asChild>
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
        <DropdownMenuItem
          onClick={() =>
            authClient.signOut({
              fetchOptions: {
                onSuccess() {
                  router.push("https://link.lx2.dev")
                },
              },
            })
          }
          className="cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
