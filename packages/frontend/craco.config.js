const TerserPlugin = require('terser-webpack-plugin');
const WorkerPlugin = require('worker-plugin');
const CracoEsbuildPlugin = require('craco-esbuild');

const isTerserPlugin = plugin => {
  return (
    plugin instanceof TerserPlugin ||
    (plugin.constructor && plugin.constructor.name === 'TerserPlugin')
  );
};

module.exports = {
  plugins: [
    {
      plugin: CracoEsbuildPlugin,
      options: {
        enableSvgr: true,
      },
    },
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
            plugins,
          } = webpackConfig;

          plugins.push(new WorkerPlugin());

          if (minimize) {
            const terserIdx = minimizer.findIndex(isTerserPlugin);
            if (terserIdx !== -1) {
              minimizer.splice(terserIdx, 1);
              minimizer.push(new TerserPlugin());
            }
          }
          return webpackConfig;
        },
      },
      options: {},
    },
  ],
};
