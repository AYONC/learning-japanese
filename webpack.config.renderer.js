const { CheckerPlugin } = require('awesome-typescript-loader');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const pkg = require('read-pkg').sync();
const base = require('./webpack.config');

const cssLocalIdentName = isDev => (isDev ? '[folder]__[local]--[hash:base64:5]' : '[hash:base64:10]');

const atsLoader = () => ({
  test: /\.tsx?$/,
  exclude: [/node_modules/],
  loader: 'awesome-typescript-loader',
  options: {
    configFileName: './tsconfig.renderer.json',
    useCache: true,
  },
});

const config = {
  target: 'electron-renderer',

  entry: {
    index: './src/renderer/index.jsx',
  },

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  resolve: {
    extensions: ['.css', '.ttf', '.woff2', '.png', '.jpg', '.jpeg', '.gif', '.svg'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          tsConfigFile: './tsconfig.renderer.json',
        },
      },
      atsLoader(),
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              query: {
                modules: true,
                sourceMap: base.isDev,
                importLoaders: 1,
                localIdentName: cssLocalIdentName(base.isDev),
                minimize: !base.isDev,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  path: './postcss.config.js',
                },
              },
            },
          ],
        }),
      },
      {
        test: /\.(ttf|woff2)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: './assets/fonts/',
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        exclude: /node_modules/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: './assets/images/',
        },
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin('index.css', { allChunks: true }),
    new HtmlWebpackPlugin({
      title: pkg.productName,
      filename: './index.html',
      template: './src/renderer/index.html',
    }),
  ],
};

if (base.isDev) {
  config.plugins = [
    ...(config.plugins || []),
    new CheckerPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ];
}

module.exports = merge.smart(base.config, config);
