'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let autoprefixer = require('autoprefixer');
let defaultSettings = require('./defaults');
require("babel-polyfill");

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

let config = Object.assign({}, baseConfig, {
  entry: [
    'babel-polyfill',
    'webpack-dev-server/client?http://localhost:' + defaultSettings.port,
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  cache: true,
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    })
  ],
  postcss:[autoprefixer({browsers:['last 4 version', 'safari 5', 'opera 12.1', 'ios 6', 'android 4']})],
  module: defaultSettings.getDefaultModules()
});

config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'react-hot!babel-loader',
  include: [].concat(
    config.additionalPaths,
    [ path.join(__dirname, '/../src') ]
  ),
});

module.exports = config;
