import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
