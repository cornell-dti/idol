module.exports = {
  webpack5: true,
  typescript: { ignoreBuildErrors: true },
  webpack(config, { isServer }) {
    if (isServer) {
      // React 17 has no ESM export for react/jsx-runtime. Use the supported
      // CommonJS entries for Base UI and Vaul (including its Radix dependencies).
      config.externals.unshift(({ request }, callback) => {
        if (request === 'vaul' || /^@base-ui\/(react|utils)(\/|$)/.test(request || '')) {
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
