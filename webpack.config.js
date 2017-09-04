const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require("compression-webpack-plugin");

var I18nPlugin = require("i18n-webpack-plugin");
var languages = {
	"en": null,
	// "de": require("./languages/de.json")
};


let config = Object.keys(languages).map(function(language) {
  return {
    entry: {
      CCSDK : './src/CCSDKEntry.ts',
      // test : './test/ccsdk.test.ts'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist'
    },
    plugins : [
      new I18nPlugin(
        languages[language]
      ),
      // new webpack.ProvidePlugin({
      //   $: 'cash-dom'
      // }),
      new UglifyJSPlugin({
      }),
      new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        test: /\.(js)$/,
        minRatio: 0.8
      })
    ],
    module: {
      rules: [
        // {
        //   test: require.resolve('cash-dom'),
        //   loader: 'imports-loader?this=>window'
        // },
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
        { test: /\.css$/, use: [ 'style-loader', 'css-loader'] , exclude: /node_modules/ },
				// {
				// 	test: /\.svg$/,
        // 	loader: 'svg-inline-loader'
				// },
				{
	        test: /\.(jpe?g|png|gif|svg)$/i,
	        loaders: [
	            'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
	            'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
	        ]
				},
				{
				  test: /\.(html)$/,
				  use: {
				    loader: 'html-loader?exportAsEs6Default',
				    options: {
				      attrs: [':data-src']
				    }
				  }
				},
        {
          test: /\.scss$/,
          exclude: /node_modules/,
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
    }
  }
});

module.exports = config;
