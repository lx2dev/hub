import { BookOpenIcon, LifeBuoyIcon } from "lucide-react"

import { icons } from "@/components/icons/github"

export const config = {
  externalLinks: {
    "create-lx2-app": {
      description:
        "The Lx2 App developer documentation tries to cover every aspect of using Create Lx2 App. Whether you're new or have previous experience, we recommend starting here.",
      href: "https://create.lx2.dev",
      icon: BookOpenIcon,
      title: "Documentation",
    },
    discord: {
      description:
        "Lx2 is a set of community driven projects. Join our Discord to chat or get support.",
      href: "https://discord.gg/hVjgY5ksy8",
      icon: icons.discord,
      title: "Community",
    },
    github: {
      description:
        "Create Lx2 App - The Most Opinionated Way to Build Next.js Apps",
      href: "https://github.com/SlickYeet/create-lx2-app",
      icon: icons.github,
      title: "GitHub Repository",
    },
    tickets: {
      description: "Get additional support from Lx2, we're here to listen.",
      href: "https://hub.lx2.dev/tickets",
      icon: LifeBuoyIcon,
      title: "Tickets",
    },
  },
  internalLinks: {
    navLinks: [
      {
        header: "Dashboard",
        href: "/dashboard",
        label: "Dashboard",
      },
      {
        header: "Support Tickets",
        href: "/tickets",
        label: "Tickets",
      },
    ],
    profileLinks: [
      {
        header: "Profile",
        href: "/profile",
        label: "Profile",
      },
    ],
  },
}
