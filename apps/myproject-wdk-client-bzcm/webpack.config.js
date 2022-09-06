const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const path = require('path');
const webpack = require('webpack');
const deps = require('./package.json').dependencies;
const TypescriptDeclarationPlugin = require('typescript-declaration-webpack-plugin');
const dotenv = require('dotenv');
module.exports = (env, argv) => {
  const { DEV } = env;
  if (DEV) {
    dotenv.config({ path: path.resolve(__dirname, '.env.development') });
  } else {
    dotenv.config({ path: path.resolve(__dirname, '.env.production') });
  }
  return {
    entry: './src/index',
    mode: 'development',
    // devtool: "cheap-module-eval-source-map",
    devServer: {
      static: {
        directory: path.join(__dirname, 'build'),
      },
      port: argv.port,
      hot: true,
      client: {
        overlay: false,
      },
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    output: {
      path: path.resolve(__dirname, './build'),
      filename: '[name].js',
      crossOriginLoading: 'anonymous',
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['@babel/preset-react'],
          },
        },
        {
          test: /\.(d.ts|ts|tsx)$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
          options: {
            sources: {
              list: [
                {
                  tag: 'link',
                  attribute: 'href',
                  type: 'src',
                },
              ],
            },
          },
        },
      ],
    },
    plugins: [
      new ModuleFederationPlugin({
        name: argv.name,
        filename: 'remoteEntry.tsx',
        exposes: {
          './AppRouter': './src/AppRouter',
        },
        shared: [
          'react',
          'react-dom',
          'recoil',
          'react-router-dom',
          'realgrid',
          '@vntgcorp/vntg-wdk-client',
          'recoil-persist',
          'react-hook-form',
          'axios',
          'styled-components',
          'yup',
          'react-router',
          'lodash',
          'moment',
          'style-inject',
        ],
      }),
      new webpack.DefinePlugin({
        'process.env.REACT_APP_API_BASE_URL': JSON.stringify(process.env.REACT_APP_API_BASE_URL),
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
      new TypescriptDeclarationPlugin({
        // Options for TypescriptDeclarationPlugin (see below)
      }),
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      fallback: {
        assert: require.resolve('assert'),
        buffer: require.resolve('buffer'),
        console: require.resolve('console-browserify'),
        constants: require.resolve('constants-browserify'),
        crypto: require.resolve('crypto-browserify'),
        domain: require.resolve('domain-browser'),
        events: require.resolve('events'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
        punycode: require.resolve('punycode'),
        process: require.resolve('process/browser'),
        querystring: require.resolve('querystring-es3'),
        stream: require.resolve('stream-browserify'),
        string_decoder: require.resolve('string_decoder'),
        sys: require.resolve('util'),
        timers: require.resolve('timers-browserify'),
        tty: require.resolve('tty-browserify'),
        url: require.resolve('url'),
        util: require.resolve('util'),
        vm: require.resolve('vm-browserify'),
        zlib: require.resolve('browserify-zlib'),
        // bootstrap : require.resolve('bootstrap'),
      },
    },
  };
};
