const TerserPlugin = require('terser-webpack-plugin');
const WorkerPlugin = require('worker-plugin');

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
          const {
            optimization: { minimize, minimizer },
          } = webpackConfig;

          if (minimize) {
            const idx = minimizer.findIndex(m => m instanceof TerserPlugin);

            minimizer.splice(idx, 1);
            minimizer.push(new TerserPlugin());
          }

          webpackConfig.plugins.push(new WorkerPlugin());

          return webpackConfig;
        },
      },
      options: {},
    },
  ],
};
