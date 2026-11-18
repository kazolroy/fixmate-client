import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      // ImgBB — service and profile images uploaded by technicians
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'ibb.co' },
      // Unsplash — high quality service photos
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Google profile photos (social login)
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

export default nextConfig;
