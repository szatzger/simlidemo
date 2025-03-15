/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Beállítjuk, hogy a Next.js minden interfészen hallgatózzon, ne csak a localhost-on
  experimental: {
    // Engedélyezzük a külső hozzáférést
    allowExternalUrls: true,
  },
  // A server.js fájl beállításai
  serverRuntimeConfig: {
    // A szerver csak ezeket a beállításokat látja
    port: process.env.PORT || 3000,
    hostname: '0.0.0.0', // Ez a beállítás engedi, hogy minden interfészen hallgatózzon
  },
  // A kliens és a szerver is látja ezeket a beállításokat
  publicRuntimeConfig: {
    // Üres, de szükség esetén ide kerülhetnek a publikus beállítások
  },
};

module.exports = nextConfig;
