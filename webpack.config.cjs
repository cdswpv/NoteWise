const path = require('path');
const Dotenv = require('dotenv-webpack'); // Import the Dotenv plugin

module.exports = {
  mode: 'production',
  entry: {
    content: path.resolve(__dirname, 'content.js'),
    background: path.resolve(__dirname, 'background.js'),
    login: path.resolve(__dirname, 'login.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  plugins: [
    new Dotenv(), // Use the Dotenv plugin to load environment variables from .env
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
