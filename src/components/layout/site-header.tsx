"use client"

import { usePathname } from "next/navigation"

import { LINKS } from "@/constants"

export function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="bg-background shadow">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="font-semibold text-foreground/90 text-xl leading-tight">
          {LINKS.navLinks.find((link) => link.href === pathname)?.header ||
            LINKS.profileLinks.find((link) => link.href === pathname)?.header}
        </h2>
      </div>
    </header>
  )
}
