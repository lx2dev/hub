import { redirect } from "next/navigation"

import { SiteHeader } from "@/components/layout/site-header"
import { SiteNav } from "@/components/layout/site-nav"
import { getSession } from "@/server/auth/utils"

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  return (
    <div>
      <SiteNav session={session} />
      <SiteHeader />
      <main className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
