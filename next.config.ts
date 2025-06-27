import type { NextConfig } from "next";

const nextConfig: NextConfig = {

   images: {
    domains: [
      'i.pinimg.com',       // Pinterest images
      'localhost',          // Local development
      'yourdomain.com',     // Your own domain
      // Add other domains as needed

    ],

    minimumCacheTTL: 60,
    

    
  },
  /* config options here */
};

export default nextConfig;
