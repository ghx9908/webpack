- 那两个模块共同依赖了一个模块呢

重复打包。后面会讲 splitChunks ,提取公共模块

- MiniCssExtractPlugin 好处

1. 把 CSS 文件提取到单独的文件中
2. 减少了 main.js 文件体积
3. 可以让 CSS 和 JS 并行加载，提高了加载效率，减少了加载时间
4. 可以单独维护 CSS，更清晰

- cross-env NODE_ENV=production

  通过 cross-env 可以跨平台设置环境变量
