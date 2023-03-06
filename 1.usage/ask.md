- 那两个模块共同依赖了一个模块呢

重复打包。后面会讲 splitChunks ,提取公共模块

- MiniCssExtractPlugin 好处

1. 把 CSS 文件提取到单独的文件中
2. 减少了 main.js 文件体积
3. 可以让 CSS 和 JS 并行加载，提高了加载效率，减少了加载时间
4. 可以单独维护 CSS，更清晰

- cross-env NODE_ENV=production

  通过 cross-env 可以跨平台设置环境变量

- 什么是预设
  > 我们使用的时候很使用很多的 ES6 特性

1. 比如箭头函数 要把它从 ES6 转成 ES5，需要编写对应的 babel 插件
2. 为了方便，我们可把这些插件进行打包，称为一个预设 preset

- 现在还需要配置 module:false 吗

  module:false 不转换
  因为我们现在写代码更多的是 es module
  import export
  但是 webpack 打包之后只使用 common.js module.exports exports.xxx
  如果你不希望 babel 把你的 es module 转成 common.js 就可以设置 module:false

- 预设和插件
  - 预设是插件的集合
    babel 是一个转换器，但是它本身只是一个转换的引擎，不知道如何转换？也不知道应该转换什么?
    所以需要写一个一个的插件，进行转换，一般来说每个插件转换一个语法，或者说一个写法
    配置的时候为了减少复杂度，就可以把插件进行打包，变成一个预设，配置一个预设就可以了
