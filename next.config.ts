import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx"],
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
