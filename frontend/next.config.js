module.exports = {
  webpack5: true,
  experimental: { swcLoader: true },
  typescript: { ignoreBuildErrors: true },
  async rewrites() {
    return [
      {
        source: '/.netlify/functions/api/:path*',
        destination: 'http://localhost:9000/.netlify/functions/api/:path*' // Proxy to Backend
      }
    ];
  }
};
