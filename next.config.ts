import type { NextConfig } from "next";

const nextConfig: NextConfig = {

   images: {
    domains: [
      'i.pinimg.com',       // Pinterest images
      'localhost',          // Local development
      'yourdomain.com',   
       'i.pining.com', // The domain from your image URL
      'firebasestorage.googleapis.com', // For Firebase Storage images
      'localhost' // For d  // Your own domain
      // Add other domains as needed

    ],

    minimumCacheTTL: 60,
    

    
  },
  /* config options here */
};

export default nextConfig;
