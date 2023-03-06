/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ESLintPlugin = require("eslint-webpack-plugin")
//获取环境变量
const NODE_ENV = process.env.NODE_ENV
const isProduction = NODE_ENV === "production"
module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.ts",
  // entry: ["./src/entry1.js", "./src/entry2.js"],

  // entry: {
  //   entry1: "./src/entry1.js",
  //   entry2: "./src/entry2.js",
  // },
  output: {
    path: path.resolve(__dirname, "dist"),
    // filename: "[name].js",
    filename: "bundle.js",
    clean: true, //在新的打包之前清除历史文件
  },
  devServer: {
    host: "localhost", //主机名
    port: 9000, //访问端口号
    open: true, //构建结束后自动打开浏览器预览项目
    compress: true, //启动gzip压缩
    hot: true, //启动支持模块热替换
    watchFiles: [
      //监听这些文件的变化，如果这些文件变化了，可以重新编译
      "src/**/*.js",
    ], //如果不配置watchFiles就是监听所有的文件
    //不管访问哪个路径，都会把请求重定向到index.html，交给前端路由来进行处理
    historyApiFallback: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        // use: "ts-loader",
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript"],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            //第一种写法
            // options: {
            //   presets: [
            //     "@babel/preset-env", //V50套餐
            //   ],
            //   plugins: [
            //     //装饰器的插件就需要单独在这里配置
            //   ],
            // },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.less$/,
        use: [
          process.env.NODE_ENV === "development"
            ? "style-loader"
            : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
    }),
    new MiniCssExtractPlugin(),
    new ESLintPlugin({ extensions: [".js", ".ts"] }),
    // new HtmlWebpackPlugin({
    //   template: "./src/entry1.html",
    //   filename: "entry1.html",
    //   chunks: ["entry1"],
    // }),
    // new HtmlWebpackPlugin({
    //   template: "./src/entry2.html",
    //   filename: "entry2.html",
    //   chunks: ["entry2"],
    // }),
  ],
}
