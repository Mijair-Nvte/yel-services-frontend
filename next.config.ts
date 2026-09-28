import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-4ca4b3b25cf8457688db0321e1132091.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;