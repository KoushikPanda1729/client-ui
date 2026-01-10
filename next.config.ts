import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "catalog-service-product.s3.eu-north-1.amazonaws.com",
        port: "",
        pathname: "/products/**",
      },
    ],
  },
};

export default nextConfig;
