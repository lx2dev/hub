import type { UserWithRole } from "better-auth/plugins"

export const config = {
  externalLinks: {
    "create-lx2-app": "https://create.lx2.dev",
    discord: "https://discord.gg/hVjgY5ksy8",
    github: "https://github.com/SlickYeet/create-lx2-app",
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
      {
        header: "Admin",
        href: "/admin",
        label: "Admin",
        visible: (user: UserWithRole) => user?.role === "admin" || false,
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
