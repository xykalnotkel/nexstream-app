/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Di produksi, Vercel secara otomatis memetakan folder /api/ menjadi endpoint.
  // Jadi tidak butuh rewrites proxy ke 8080 lagi.
}
module.exports = nextConfig