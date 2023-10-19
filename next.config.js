/** @type {import('next').NextConfig} */
const nextConfig = {};
const withPWA = require("next-pwa")({
  disable: process.env.NODE_ENV === "development",
  dest: "public/pwa/build",
  register: true,
  skipWaiting: true,
});

module.exports = withPWA(nextConfig);
