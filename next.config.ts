import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint:{
    ignoreDuringBuilds: true,
  },
  images:{
    remotePatterns:[
      {
        protocol:'http',
        hostname:"**"
      },
      {
        protocol:'https',
        hostname:'**'
      }
    ]
  }
};

export default nextConfig;
