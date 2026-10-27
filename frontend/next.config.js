module.exports = {
  webpack5: true,
  typescript: { ignoreBuildErrors: true },
  webpack(config, { isServer }) {
    if (isServer) {
      // React 17 has no ESM export for react/jsx-runtime. Use Base UI's supported
      // CommonJS entry points for Next 12 SSR, without changing other packages.
      config.externals.unshift(({ request }, callback) => {
        if (/^@base-ui\/(react|utils)(\/|$)/.test(request || '')) {
          return callback(null, `commonjs ${request}`);
        }
        return callback();
      });
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/.netlify/functions/api/:path*',
        destination: 'http://localhost:9000/.netlify/functions/api/:path*' // Proxy to Backend
      }
    ];
  }
};
