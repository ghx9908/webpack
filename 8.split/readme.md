## 1. 代码分割

- 对于大的 Web 应用来讲，将所有的代码都放在一个文件中显然是不够有效的，特别是当你的某些代码块是在某些特殊的时候才会被用到。
- webpack 有一个功能就是将你的代码库分割成 chunks 语块，当代码运行到需要它们的时候再进行加载

## 2. 入口点分割

- Entry Points：入口文件设置的时候可以配置
- 这种方法的问题
  - 如果入口 chunks 之间包含重复的模块(lodash)，那些重复模块都会被引入到各个 bundle 中
  - 不够灵活，并且不能将核心应用程序逻辑进行动态拆分代码

```js
{
  entry: {
   page1: "./src/page1.js",
   page2: "./src/page2.js"
  }
}
```

## 3 动态导入和懒加载

- 用户当前需要用什么功能就只加载这个功能对应的代码，也就是所谓的按需加载 在给单页应用做按需加载优化时
- 一般采用以下原则：
  - 对网站功能进行划分，每一类一个 chunk
  - 对于首次打开页面需要的功能直接加载，尽快展示给用

### 3.1 normal

```js
document.querySelector("#play").addEventListener("click", () => {
  import("./video").then((result) => {
    console.log(result.default)
  })
})
```

### 3.2 prefetch(预先拉取)

- prefetch 跟 preload 不同，它的作用是告诉浏览器未来可能会使用到的某个资源，浏览器就会在闲时去加载对应的资源，若能预测到用户的行为，比如懒加载，点击到其它页面等则相当于提前预加载了需要的资源

### 3.3 preload(预先加载)

- preload 通常用于本页面要用到的关键资源，包括关键 js、字体、css 文件
- preload 将会把资源得下载顺序权重提高，使得关键数据提前下载好,优化页面打开速度
- 在资源上添加预先加载的注释，你指明该模块需要立即被使用
- 一个资源的加载的优先级被分为五个级别,分别是
  - Highest 最高
  - High 高
  - Medium 中等
  - Low 低
  - Lowest 最低
- 异步/延迟/插入的脚本（无论在什么位置）在网络优先级中是 `Low`
- [link-rel-prefetch-preload-in-webpack](https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c)
- [Support for webpackPrefetch and webpackPreload](https://github.com/jantimon/html-webpack-plugin/issues/1317)
- [preload-webpack-plugin](https://www.npmjs.com/package/@vue/preload-webpack-plugin)
- [webpackpreload-webpack-plugin](https://www.npmjs.com/package/webpackpreload-webpack-plugin)
- [ImportPlugin.js](https://github.com/webpack/webpack/blob/c181294865dca01b28e6e316636fef5f2aad4eb6/lib/dependencies/ImportParserPlugin.js#L108-L121)
