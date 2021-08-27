const withEsbuildLoader = (config, options) => {
  const jsLoaders = config.module.rules.filter((rule) => rule.test && rule.test.test('.tsx'));
  jsLoaders.forEach((jsLoader) => {
    jsLoader.use.loader = require.resolve('esbuild-loader');
    jsLoader.use.options = options;
  });
};

module.exports = {
  webpack5: true,
  webpack(config, { webpack }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    config.plugins.push(new webpack.ProvidePlugin({ React: 'react' }));
    withEsbuildLoader(config, { loader: 'tsx', target: 'es2017' });
    return config;
  }
};
