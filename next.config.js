/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  publicRuntimeConfig: {
    // Available on both server and client
    theme: "DEFAULT",
  },

  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXT_PUBLIC_GITHUB_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
    NEXT_PUBLIC_GITHUB_CLIENT_SECRET:
      process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET,
  },

  images: {
    domains: [
      "https://via.placeholder.com",
      "https://via.placeholder.com/150/771796",
      "via.placeholder.com",
      "mukoxyechbobgdvpbirs.supabase.co",
      "https://vendorspot-marketplace.s3.eu-north-1.amazonaws.com",
      "vendorspot-marketplace.s3.eu-north-1.amazonaws.com",
      "https://picsum.photos/500/300?random=1",
      "picsum.photos",
      "res.cloudinary.com",
      "vendorspot.s3.eu-north-1.amazonaws.com",
      // "https://mukoxyechbobgdvpbirs.supabase.co",
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb", // Increase the limit to 4MB
    },
  },
};

module.exports = nextConfig;
