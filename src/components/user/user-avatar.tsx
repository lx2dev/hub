import type { User } from "better-auth"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps {
  user?: User
  showInfo?: boolean
}

export function UserAvatar({ user, showInfo = false }: UserAvatarProps) {
  return (
    <div className="flex items-center">
      <Avatar>
        {user?.image && <AvatarImage alt={user.name} src={user.image} />}
        <AvatarFallback>
          {user?.name ? user.name.charAt(0) : "U"}
        </AvatarFallback>
      </Avatar>
      {showInfo && (
        <div className="ms-2 flex flex-col items-start">
          <span className="text-foreground">{user?.name}</span>
          <span className="text-muted-foreground text-xs">{user?.email}</span>
        </div>
      )}
    </div>
  )
}
