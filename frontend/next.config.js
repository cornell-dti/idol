module.exports = {
  webpack5: true,
  async rewrites() {
    return [
      {
        source: '/.netlify/functions/api/:path*',
        destination: 'http://localhost:9000/.netlify/functions/api/:path*' // Proxy to Backend
      }
    ];
  }
};
