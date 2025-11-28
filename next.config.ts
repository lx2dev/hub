import type { NextConfig } from "next"

import { config } from "@/constants"

import "./src/env"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "create.lx2.dev",
        protocol: "https",
      },
    ],
  },
  async redirects() {
    return [
      ...Object.entries(config.externalLinks).map(([name, url]) => ({
        destination: url,
        permanent: true,
        source: `/${name}`,
      })),
    ]
  },
  typedRoutes: true,
}

export default nextConfig
