const path = require("path")

module.exports = {
  mode: "development",
  devtool: false,
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.baxx$/,
        use: [
          path.resolve(__dirname, "loaders/loader2.js"),
          path.resolve(__dirname, "loaders/loader1.js"),
        ],
      },
    ],
  },
}
