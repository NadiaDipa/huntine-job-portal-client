import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  logging: {
    // Dev-only: mirror browser console output (console.log, etc.) into the
    // terminal running `next dev`, so client-side data is visible there too.
    browserToTerminal: true,
  },
}

export default nextConfig
