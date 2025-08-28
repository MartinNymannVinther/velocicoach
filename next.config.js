/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Sikrer at CSS bliver processeret med PostCSS/Tailwind
    css: true,
  },
};

module.exports = nextConfig;
