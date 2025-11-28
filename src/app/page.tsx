import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { getSession } from "@/server/auth/utils"

export default async function HomePage() {
  const session = await getSession()

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
              className="hover:bg-transparent! hover:opacity-80"
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

        <main className="mt-6"></main>

        <footer className="py-16 text-center text-muted-foreground text-sm">
          Lx2 Hub
        </footer>
      </div>
    </div>
  )
}
