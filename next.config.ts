import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async rewrites() {
    return {
      // Proxy every API request to the standalone Express backend
      // (see /backend — runs on port 4000), keeping the frontend code
      // on plain relative paths like /api/products.
      beforeFiles: [
        { source: "/api", destination: "http://127.0.0.1:4000/api" },
        { source: "/api/:path*", destination: "http://127.0.0.1:4000/api/:path*" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
