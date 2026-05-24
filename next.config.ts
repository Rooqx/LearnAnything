import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Transpile ESM-only packages that don't ship CJS */
  transpilePackages: [
    "@justinribeiro/lite-youtube",
  ],
};

export default nextConfig;
