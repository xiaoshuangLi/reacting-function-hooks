const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const basePath = path.resolve(__dirname, './');

module.exports = {
  mode: 'production',
  entry: path.resolve(basePath, 'src/index.js'),
  output: {
    publicPath: '/',
    filename: 'index.js',
    path: path.resolve(basePath, 'lib'),
  },
  resolve: {
    modules: [
      path.resolve(basePath, 'src'),
      path.resolve(basePath, 'node_modules'),
    ],
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
            ],
            plugins: [
              '@babel/plugin-transform-runtime',
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
  ],
};