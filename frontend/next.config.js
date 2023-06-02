/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // webpack5: true,
  // webpack: (config) => {
  //   config.resolve.fallback = { fs: false }
  // },
  images: {
    domains: [
      'res.cloudinary.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
    ],
  },
  // experimental: { appDir: true },
}

module.exports = nextConfig
