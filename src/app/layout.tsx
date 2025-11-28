import type { Metadata } from "next"
import { Figtree } from "next/font/google"

import { ThemeProvider } from "@/components/providers/theme"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

import "@/styles/globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
})

export const metadata: Metadata = {
  description: "Support hub for Lx2.dev",
  title: "Lx2 Hub",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", figtree.variable)}>
        <ThemeProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-black">
            {children}
          </div>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
