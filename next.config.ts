import type { NextConfig } from "next";

// @ts-expect-error Prisma Next.js monorepo plugin has incorrect types
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
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
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
};

export default nextConfig;
