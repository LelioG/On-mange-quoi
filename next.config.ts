import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/*": ["./data/recipe.csv"],
  },
};

export default nextConfig;
