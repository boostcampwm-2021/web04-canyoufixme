const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({
          webpackConfig,
          cracoConfig,
          pluginOptions,
          context: { env, paths },
        }) => {
          const webpackConfigOverride = {
            ...webpackConfig,
          };
          const {
            optimization: { minimize, minimizer },
          } = webpackConfig;
          if (minimize) {
            minimizer.shift();
            minimizer.unshift(new TerserPlugin());
          }
          return webpackConfigOverride;
        },
      },
      options: {},
    },
  ],
};
