import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(process.env.GITHUB_PAGES === "true" ? { output: "export" as const, trailingSlash: true } : {}),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default nextConfig;
