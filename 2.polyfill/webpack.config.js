/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  output: {
    clean: true,
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              targets: {
                browsers: [">0.1%"],
              },
              presets: [
                [
                  "@babel/preset-env",
                  {
                    useBuiltIns: "usage",
                    corejs: 3,
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  },
}
