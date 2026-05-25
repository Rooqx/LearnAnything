import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Transpile ESM-only packages that don't ship CJS */
  transpilePackages: [
    "@justinribeiro/lite-youtube",
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
