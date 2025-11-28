import { SiteHeader } from "@/components/layout/site-header"
import { SiteNav } from "@/components/layout/site-nav"

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div>
      <SiteNav />
      <SiteHeader />
      <main className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
