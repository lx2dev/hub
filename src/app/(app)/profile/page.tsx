import { redirect } from "next/navigation"

import { ProfileForm } from "@/components/profile/profile-form"
import { RevokeSessions } from "@/components/profile/revoke-sessions"
import { Separator } from "@/components/ui/separator"
import { getSession } from "@/server/auth/utils"

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  return (
    <>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="flex justify-between md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="font-medium text-foreground text-lg">
              Profile Information
            </h3>
            <p className="mt-1 text-muted-foreground text-sm">
              Changing your Profile on Discord will automatically update these
              details when you log back in here.
            </p>
          </div>

          <div className="px-4 sm:px-0" />
        </div>

        <div className="mt-5 md:col-span-2 md:mt-0">
          <ProfileForm user={session.user} />
        </div>
      </div>

      <div className="hidden sm:block">
        <Separator className="my-8 w-full" />
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="flex justify-between md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="font-medium text-foreground text-lg">
                Browser Sessions
              </h3>
              <p className="mt-1 text-muted-foreground text-sm">
                Manage and log out your active sessions on other browsers and
                devices.
              </p>
            </div>
            <div className="px-4 sm:px-0" />
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <RevokeSessions />
          </div>
        </div>
      </div>
    </>
  )
}
