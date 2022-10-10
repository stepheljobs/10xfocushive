/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  publicRuntimeConfig: {
    NEXT_APP_SUPABASE_URL: process.env.NEXT_APP_SUPABASE_URL,
    NEXT_APP_SUPABASE_KEY: process.env.NEXT_APP_SUPABASE_KEY,
  }
}

module.exports = nextConfig
