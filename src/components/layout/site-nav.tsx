"use client"

import type { User } from "better-auth"
import { ArrowUpRightIcon, MenuIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { UserAvatar } from "@/components/user/user-avatar"
import { UserMenu } from "@/components/user/user-menu"
import { LINKS } from "@/constants"
import { authClient, useSession } from "@/lib/auth/client"
import { cn } from "@/lib/utils"

export function SiteNav() {
  const router = useRouter()
  const pathname = usePathname()

  const { data: session } = useSession()
  const user = session?.user

  return (
    <div className="z-50 border-b bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            {/* Logo */}
            <div className="flex shrink-0 items-center">
              <Link href="/">
                <Image
                  alt="Logo"
                  height={40}
                  src="https://create.lx2.dev/android-chrome-512x512.png"
                  width={40}
                />
              </Link>
            </div>

            {/* Nav links */}
            <nav className="sm:-my-px hidden space-x-8 sm:ms-10 sm:flex">
              {LINKS.navLinks.map((link) => (
                <Link
                  className={cn(
                    "inline-flex items-center border-b-2 px-1 pt-1 font-medium text-sm leading-5 transition duration-150 ease-in-out hover:border-foreground/50 focus:outline-none",
                    link.href === pathname
                      ? "border-primary text-foreground focus:border-primary/80"
                      : "border-transparent text-muted-foreground hover:text-foreground/80 focus:border-foreground/50 focus:text-foreground/80"
                  )}
                  // @ts-expect-error Invalid types from typed-routes
                  href={link.href}
                  key={link.href}
                  target={link.href.startsWith("http") ? "_blank" : "_self"}
                >
                  {link.label}
                  {link.href.startsWith("http") && (
                    <ArrowUpRightIcon
                      aria-hidden="true"
                      className="ml-1 size-3.5"
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden sm:ms-6 sm:flex sm:items-center">
            <div className="relative ms-3">
              <div className="relative">
                <UserMenu user={user} />
              </div>
            </div>
          </div>

          <div className="-me-2 flex items-center sm:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon-sm" variant="ghost">
                  <MenuIcon className="size-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="mt-3 w-screen border-x-0 border-t-0 bg-background px-0 text-muted-foreground">
                <div className="flex flex-col">
                  {LINKS.navLinks.map((link) => (
                    <div className="my-1 first:mt-0 last:mb-0" key={link.href}>
                      <Link
                        className={cn(
                          "inline-block w-full border-transparent border-l-4 px-4 py-3 outline-none ring-0 transition duration-150 ease-in-out",
                          link.href === pathname
                            ? "border-primary/80 bg-primary/25 text-primary hover:border-primary hover:bg-primary/35 focus:border-primary focus:bg-primary/35"
                            : "hover:border-accent hover:bg-accent/50 focus:border-accent focus:bg-accent/50"
                        )}
                        // @ts-expect-error Invalid types from typed-routes
                        href={link.href}
                        target={
                          link.href.startsWith("http") ? "_blank" : "_self"
                        }
                      >
                        {link.label}
                      </Link>
                    </div>
                  ))}

                  <Separator />

                  <div className="mt-2 flex flex-col">
                    <div className="px-4">
                      <UserAvatar showInfo user={user} />
                    </div>

                    <div className="mt-3">
                      {LINKS.profileLinks.map((link) => (
                        <div
                          className="my-1 first:mt-0 last:mb-0"
                          key={link.href}
                        >
                          <Link
                            className={cn(
                              "inline-block w-full border-transparent border-l-4 px-4 py-3 outline-none ring-0 transition duration-150 ease-in-out",
                              link.href === pathname
                                ? "border-primary/80 bg-primary/25 text-primary hover:border-primary hover:bg-primary/35 focus:border-primary focus:bg-primary/35"
                                : "hover:border-accent hover:bg-accent/50 focus:border-accent focus:bg-accent/50"
                            )}
                            // @ts-expect-error Invalid types from typed-routes
                            href={link.href}
                          >
                            {link.label}
                          </Link>
                        </div>
                      ))}

                      <div className="mt-2">
                        <button
                          className="inline-block w-full border-transparent border-l-4 px-4 py-3 text-start outline-none ring-0 transition duration-150 ease-in-out hover:border-accent hover:bg-accent/50 focus:border-accent focus:bg-accent/50"
                          onClick={() =>
                            authClient.signOut({
                              fetchOptions: {
                                onSuccess() {
                                  router.push("https://link.lx2.dev")
                                },
                              },
                            })
                          }
                          type="button"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
}
