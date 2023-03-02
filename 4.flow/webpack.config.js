const path = require("path")
const Run1Plugin = require("./plugins/run1-plugin")
const Run2Plugin = require("./plugins/run2-plugin")
const DonePlugin = require("./plugins/done-plugin")
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
  plugins: [new DonePlugin(), new Run2Plugin(), new Run1Plugin()],
}
