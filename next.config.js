/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.shopee.com.br',
      },
      {
        protocol: 'https',
        hostname: '**.shopee.co.id',
      },
    ],
  },
}

module.exports = nextConfig
