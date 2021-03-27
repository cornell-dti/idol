const { ESBuildPlugin, ESBuildMinifyPlugin } = require('esbuild-loader');
const { ProvidePlugin } = require('webpack');

const withEsbuildMinify = (config, options) => {
  const terserIndex = config.optimization.minimizer.findIndex(
    (minimizer) => minimizer.constructor.name === 'TerserPlugin'
  );
  if (terserIndex > -1) {
    config.optimization.minimizer.splice(
      terserIndex,
      1,
      new ESBuildMinifyPlugin(options)
    );
  }
};

const withEsbuildLoader = (config, options) => {
  const jsLoader = config.module.rules.find(
    (rule) => rule.test && rule.test.test('.js')
  );
  if (jsLoader) {
    jsLoader.use.loader = require.resolve('esbuild-loader');
    jsLoader.use.options = options;
  }
};

module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    config.plugins.push(
      new ESBuildPlugin(),
      new ProvidePlugin({ React: 'react' })
    );
    withEsbuildMinify(config);
    withEsbuildLoader(config, { loader: 'tsx', target: 'es2017' });
    return config;
  }
};
