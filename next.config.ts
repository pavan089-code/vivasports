import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/points-table",
        destination: "/pointstable",
        permanent: true,
      },
      {
        source: "/points_table",
        destination: "/pointstable",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
