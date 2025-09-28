/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "src/app/exclusive/downloads/[file]/route": ["exclusive/downloads/**"],
    },
  },
};
module.exports = nextConfig;
