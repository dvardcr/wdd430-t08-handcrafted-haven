/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Remove remotePatterns 
  },
  experimental: {
    serverActions: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig; 