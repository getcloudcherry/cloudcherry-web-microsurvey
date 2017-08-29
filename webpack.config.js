const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const CompressionPlugin = require("compression-webpack-plugin");
// const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

var I18nPlugin = require("i18n-webpack-plugin");
var languages = {
	"en": null,
	// "de": require("./languages/de.json")
};


let config = Object.keys(languages).map(function(language) {
  return {
    entry: {
      ccsdk : './src/Main.js',
      test : './test/ccsdk.test.ts'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist'
    },
    plugins : [
      // new CleanWebpackPlugin(['dist']),
      //compile time constants?
      // new webpack.DefinePlugin({
      //   API_URL : JSON.stringify("https://getcloudcherry.com")
      // })
      new I18nPlugin(
        languages[language]
      ),
      // new HtmlWebpackPlugin({
      //   template : 'templates/template.html'
      // }),
      new webpack.ProvidePlugin({
        $: 'cash-dom'
      }),
      // new UglifyJSPlugin({
      //   // sourceMap: true
      // })
      new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.(js|html)$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ],
    module: {
      rules: [
        {
          test: require.resolve('cash-dom'),
          loader: 'imports-loader?this=>window'
        },
        // {
        //   test: /zepto(\.min)?\.js$/,
        //   use: 'imports-loader?this=>window'
        // },
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
        { test: /\.css$/, use: [ 'style-loader', 'css-loader'] , exclude: /node_modules/ },
        {
          test: /\.scss$/,
          use: [{
              loader: "style-loader" // creates style nodes from JS strings
          }, {
              loader: "css-loader" // translates CSS into CommonJS
          }, {
              loader: "sass-loader" // compiles Sass to CSS
          }]
        },
        { test: /test\.ts$/, use: 'mocha-loader', exclude: /node_modules/ },
        { test: /\.tsx?$/, use: 'awesome-typescript-loader', exclude: /node_modules/ },
      ]
    },
    output: {
      filename: '[name].' + language  + '.bundle.js',
      path: path.resolve(__dirname, 'dist'),
      library : '[name]',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    resolve: {
      modules : [
        'node_modules',
        path.resolve('./src')
      ],
      extensions: [".tsx", ".ts",'.json', '.js'],
      // alias : {
      //   'zepto' : path.resolve('./src/zepto.min.js')
      // }
    }
  }
});

module.exports = config;