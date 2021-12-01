const TerserPlugin = require('terser-webpack-plugin');
const WorkerPlugin = require('worker-plugin');
const CracoEsbuildPlugin = require('craco-esbuild');

const upsertObject = (array, object, selector) => {
  if (typeof selector === 'undefined') {
    selector = (array, object) =>
      array.findIndex(o => o.constructor.name === object.constructor.name);
  }
  const index = selector(array, object);
  if (index === -1) {
    return array.push(object);
  }
  return array.splice(index, 1, object);
}

const overrideSvgr = {
  test: /\.svg$/,
  use: [{
    loader: '@svgr/webpack',
    options: {
      svgoConfig: {
        plugins: [{
          removeViewBox: false,
        }],
      },
    },
  }],
};

module.exports = {
  plugins: [
    {
      plugin: CracoEsbuildPlugin,
      options: {
        enableSvgr: true,
        esbuildLoaderOptions: {
          loader: 'tsx',
          target: 'es2015',
        },
        esbuildJestOptions: {
          loaders: {
            '.ts': 'ts',
            '.tsx': 'tsx',
          },
        },
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
            module: { rules },
            optimization: { minimize, minimizer },
            plugins,
          } = webpackConfig;

          if (minimize) {
            upsertObject(minimizer, new TerserPlugin());
          }
          upsertObject(rules, overrideSvgr,
            t => t.test instanceof RegExp && t.test.source === '\\.svg$' &&
                t.use.length === 1 && t.use[0] === '@svgr/webpack'
          );
          plugins.push(new WorkerPlugin());

          return webpackConfig;
        },
      },
      options: {},
    },
  ],
};
