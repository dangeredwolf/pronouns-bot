const path = require('path');
const webpack = require('webpack');

const date = String(new Date().toISOString());

module.exports = {
  entry: {
    worker: './src/server.ts',
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
  },
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: { util: false },
  },
  plugins: [
    new webpack.DefinePlugin({
      _BUILD_DATE: `'${date}'`,
    }),
  ],
  optimization: {
    mangleExports: 'size',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
};
