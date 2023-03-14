/**
 * @type {import('webpack').Configuration}
 */
const HtmlWebpackPlugin = require("html-webpack-plugin")
//文件的读写 拷贝
const FileManagerWebpackPlugin = require("filemanager-webpack-plugin")

const path = require("path")
const webpack = require("webpack")
module.exports = {
  mode: "development",
  devtool: false,
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
    //自己生成sourcemmap 内置插件
    new webpack.SourceMapDevToolPlugin({
      append: "\n//# sourceMappingURL=http://127.0.0.1:8081/[url]", // 增加的位置
      filename: "[file].map[query]",
    }),
    new FileManagerWebpackPlugin({
      events: {
        onStart: {
          delete: [path.resolve("./sourcemaps/")],
        },
        onEnd: {
          copy: [
            {
              source: "./dist/*.map",
              destination: path.resolve("./sourcemaps"),
            },
          ],
          delete: ["./dist/*.map"],
          // archive: [
          //   {
          //     source: "./dist",
          //     destination: "./dist/dist.zip",
          //   },
          // ],
        },
      },
    }),
  ],
}
