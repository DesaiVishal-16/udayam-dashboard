import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "udayam-ai-labs.t3.storage.dev",
        port: "",
        protocol: "https",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/courses",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
