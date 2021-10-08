module.exports = {
  webpack5: true,
  experimental: { swcLoader: true },
  typescript: { ignoreBuildErrors: true },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    return config;
  }
};
