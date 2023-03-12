/**
 * @type {import('webpack').Configuration}
 */
const HtmlWebpackPlugin = require("html-webpack-plugin")
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin")

module.exports = {
  mode: "development",
  devtool: false,
  output: {
    clean: true,
  },
  /*  entry: {
    page1: "./src/page1.js",
    page2: "./src/page2.js",
  }, */
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new PreloadWebpackPlugin(),
  ],
}
