import type { NextConfig } from "next"

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
  typedRoutes: true,
}

export default nextConfig
