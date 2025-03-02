import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
        port: "",
        protocol: "https",
        search: "",
      },
    ],
  },
};

export default config;
