/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://upload-widget.cloudinary.com https://js.paystack.co;
      img-src 'self' https://res.cloudinary.com;
      connect-src 'self' https://api.cloudinary.com https://sandbox.terminal.africa; // Allow terminal.africa for fetch requests
      style-src 'self' 'unsafe-inline';
      frame-src 'self' https://upload-widget.cloudinary.com;
    `.replace(/\n/g, ""), // Make the value a single line to avoid issues
  },
];

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

  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = "cheap-module-source-map";
      config.output.crossOriginLoading = "anonymous";
    }
    return config;
  },

  images: {
    domains: [
      "via.placeholder.com",
      "mukoxyechbobgdvpbirs.supabase.co",
      "vendorspot-marketplace.s3.eu-north-1.amazonaws.com",
      "new-vendors.s3.eu-north-1.amazonaws.com",
      "picsum.photos",
      "res.cloudinary.com",
      "vendorspot.s3.eu-north-1.amazonaws.com",
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb", // Increase the limit to 4MB
    },
  },
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)", // Apply headers to all routes
  //       headers: securityHeaders,
  //     },
  //     {
  //       source: "/api/data/new-arrivals",
  //       headers: [
  //         { key: "Access-Control-Allow-Credentials", value: "true" },
  //         { key: "Access-Control-Allow-Origin", value: "*" },
  //         {
  //           key: "Access-Control-Allow-Methods",
  //           value: "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  //         },
  //         {
  //           key: "Access-Control-Allow-Headers",
  //           value:
  //             "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
