const webpackConfigs = require("./webpack.config");

module.exports = function (config) {
  let _webpackConfig = webpackConfigs[0];
  config.set({
    basePath: "",
    frameworks: ["jasmine"],

    files: ["test/*.ts"],
    client: {
      jasmine: {
        random: false
      }
    },
    exclude: ["node_modules"],
    preprocessors: {
      "test/*.ts": ["webpack"]
    },
    webpack: {
      module: _webpackConfig.module,
      resolve: _webpackConfig.resolve,
      mode: _webpackConfig.mode,
      devtool: "inline-source-map"
    },

    reporters: ["spec"],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ["Chrome"],

    singleRun: false,
    concurrency: Infinity
  });
};
