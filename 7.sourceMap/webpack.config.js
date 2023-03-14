/**
 * @type {import('webpack').Configuration}
 */
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  mode: "development",
  devtool: "cheap-source-map",
  output: {
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
  ],
}
