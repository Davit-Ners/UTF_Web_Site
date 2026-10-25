import type { NextConfig } from "next";
import { PRODUCTION_SITE_URL } from "./lib/site";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Safety net for www -> apex; the hosting domain setting should redirect first.
      // Matches only the www host, so the apex destination cannot loop.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.untiltheyfall.com" }],
        destination: `${PRODUCTION_SITE_URL}/:path*`,
        permanent: true,
      },
      // The full archive now lives on /concerts
      { source: "/concerts/past", destination: "/concerts#archive", permanent: true },
      // The Photo Book on /gallery is the complete archive
      { source: "/gallery/concert-photos", destination: "/gallery", permanent: true },
    ];
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;
