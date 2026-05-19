import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // সব পাথ এলাউ করার জন্য
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // প্লেসহোল্ডার ইমেজের জন্যও এটা দরকার হতে পারে
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
