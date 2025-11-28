import { ArrowRightIcon, BookOpenIcon, LifeBuoyIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getSession } from "@/server/auth/utils"

export default async function HomePage() {
  const session = await getSession()

  const ITEMS = [
    {
      description:
        "The Lx2 App developer documentation tries to cover every aspect of using Create Lx2 App. Whether you're new or have previous experience, we recommend starting here.",
      href: "https://create.lx2.dev",
      icon: BookOpenIcon,
      title: "Documentation",
    },
    {
      description:
        "Lx2 is a set of community driven projects. Join our Discord to chat or get support.",
      href: "https://discord.gg/hVjgY5ksy8",
      icon: icons.discord,
      title: "Community",
    },
    {
      description:
        "Create Lx2 App - The Most Opinionated Way to Build Next.js Apps",
      href: "https://github.com/SlickYeet/create-lx2-app",
      icon: icons.github,
      title: "GitHub Repository",
    },
    {
      description: "Get additional support from Lx2, we're here to listen.",
      href: "/tickets",
      icon: LifeBuoyIcon,
      title: "Tickets",
    },
  ]

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-primary selection:text-white">
      <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
          <div className="flex lg:col-start-2 lg:justify-center">
            <Image
              alt="Logo"
              height={100}
              src="https://create.lx2.dev/android-chrome-512x512.png"
              width={100}
            />
          </div>
          <nav className="-mx-3 flex flex-1 justify-end">
            <Button
              asChild
              className="text-base hover:bg-transparent! hover:opacity-80"
              size="sm"
              variant="ghost"
            >
              {session ? (
                <Link href="/dashboard">Dashboard</Link>
              ) : (
                <Link href="/login">Login / Register</Link>
              )}
            </Button>
          </nav>
        </header>

        <main className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            {ITEMS.map(({ description, href, icon: Icon, title }) => (
              <Link
                // @ts-expect-error Invalid types from typed-routes
                href={href}
                key={href}
                rel="noreferrer"
                target={href.startsWith("http") ? "_blank" : "_self"}
              >
                <Card className="group hover:-translate-y-0.5 h-full min-h-40 ring-0 transition duration-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/50 hover:border-primary/50 dark:focus-within:ring-primary/30">
                  <CardContent className="flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:size-16">
                      <Icon className="size-5 text-primary sm:size-6" />
                    </div>

                    <div>
                      <h2 className="font-semibold text-foreground text-xl capitalize">
                        {title}
                      </h2>
                      <p className="mt-4 text-muted-foreground text-sm/relaxed transition group-hover:text-foreground/80">
                        {description}
                      </p>
                    </div>

                    <ArrowRightIcon className="ml-auto size-6 shrink-0 stroke-primary" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </main>

        <footer className="py-16 text-center text-muted-foreground text-sm">
          Lx2 Hub
        </footer>
      </div>
    </div>
  )
}
