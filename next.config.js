/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/v0/b/social40-15b92.appspot.com/o/**",
      },
    ],
  },
};
const withPWA = require("next-pwa")({
  disable: process.env.NODE_ENV === "development",
  dest: "public/pwa/build",
  register: true,
  skipWaiting: true,
});

module.exports = withPWA(nextConfig);
