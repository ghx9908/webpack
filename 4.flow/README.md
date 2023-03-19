## webpack 编译流程

1. 初始化参数：从配置文件和 Shell 语句中读取并合并参数,得出最终的配置对象
2. 用上一步得到的参数初始化 Compiler 对象
3. 加载所有配置的插件
4. 执行对象的 run 方法开始执行编译
5. 根据配置中的`entry`找出入口文件
6. 从入口文件出发,调用所有配置的`Loader`对模块进行编译
7. 再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
8. 根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
9. 再把每个 Chunk 转换成一个单独的文件加入到输出列表
10. 在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

> 在以上过程中，Webpack 会在特定的时间点广播出特定的事件，插件在监听到感兴趣的事件后会执行特定的逻辑，并且插件可以调用 Webpack 提供的 API 改变 Webpack 的运行结果

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20230302105130.png)









### 3.11 src\entry1.js

src\entry1.js

```js
let title = require("./title");
console.log("entry12", title);
```

### 3.12 src\entry2.js

src\entry2.js

```js
let title = require("./title.js");
console.log("entry2", title);
```

### 3.13 src\title.js

src\title.js

```js
module.exports = "title";
```

### loader.js

- loader的本质就是一个函数，一个用于转换或者说翻译的函数

- 把那些webpack不认识的模块 less sass baxx转换为webpack能认识的模块js json

  

  

  loaders\logger1-loader.js

```js
function loader1(input) {
  return input
}
module.exports = loader1
```

loaders\logger2-loader.js

```js
function loader(source) {
  //let name= 'entry1';
  return source + "//logger2"; //let name= 'entry1';//logger2
}
module.exports = loader;
```



### 3.6 plugin.js

plugins\done-plugin.js

```js
class DonePlugin {
  apply(compiler) {
    compiler.hooks.done.tap("DonePlugin", () => {
      console.log("done:结束编译")
    })
  }
}
module.exports = DonePlugin
```

plugins\run1-plugin.js

```js
class RunPlugin {
  apply(compiler) {
    //在此插件里可以监听run这个钩子
    compiler.hooks.run.tap("Run1Plugin", () => {
      console.log("run1:开始编译")
    })
  }
}
module.exports = RunPlugin


```

plugins\run2-plugin.js

```js
class RunPlugin {
  apply(compiler) {
    compiler.hooks.run.tap("Run2Plugin", () => {
      console.log("run2:开始编译")
    })
  }
}
module.exports = RunPlugin

```



### 3.2 webpack.config.js

webpack.config.js

```js
const path = require("path")
const Run1Plugin = require("./plugins/run1-plugin")
const Run2Plugin = require("./plugins/run2-plugin")
const DonePlugin = require("./plugins/done-plugin")
module.exports = {
  mode: "development",
  devtool: false,
  context: process.cwd,
  entry: {
    entry1: "./src/entry1.js",
    entry2: "./src/entry2.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".tx", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [path.resolve(__dirname, "loaders/loader2.js"), path.resolve(__dirname, "loaders/loader1.js")],
      },
    ],
  },
  plugins: [new DonePlugin(), new Run2Plugin(), new Run1Plugin()],
}

```



### 3.1 debugger.js

debugger.js

```js
const fs = require("fs")
const webpack = require("./webpack2")
// const webpack = require("webpack")
const webpackConfig = require("./webpack.config")
debugger
const compiler = webpack(webpackConfig)
//4.执行`Compiler`对象的 run 方法开始执行编译
compiler.run((err, stats) => {
  if (err) {
    console.log(err)
  } else {
    //stats代表统计结果对象
    const statsJson = JSON.stringify(
      stats.toJson({
        // files: true, //代表打包后生成的文件
        assets: true, //其实是一个代码块到文件的对应关系
        chunks: true, //从入口模块出发，找到此入口模块依赖的模块，或者依赖的模块依赖的模块，合在一起组成一个代码块
        modules: true, //打包的模块 每个文件都是一个模块
      })
    )

    fs.writeFileSync("./statsJson.json", statsJson)
  }
})
```

### 3.3 webpack.js

webpack2.js

```js
const Compiler = require("./Compiler")
function webpack(options) {
  // 1.初始化参数：从配置文件和 Shell 语句中读取并合并参数,得出最终的配置对象
  //argv[0]是Node程序的绝对路径 argv[1] 正在运行的脚本
  // node debugger --mode=production
  const argv = process.argv.slice(2)
  const shellOptions = argv.reduce((shellOptions, options) => {
    // options = '--mode=development'
    const [key, value] = options.split("=")
    shellOptions[key.slice(2)] = value
    return shellOptions
  }, {})
  console.log("shellOptions=>", shellOptions)
  const finalOptions = { ...options, ...shellOptions }
  //2.用上一步得到的参数初始化 `Compiler` 对象
  const compiler = new Compiler(finalOptions)
  //3.加载所有配置的插件
  const { plugins } = finalOptions
  for (let plugin of plugins) {
    //订阅钩子
    plugin.apply(compiler)
  }
  return compiler
}
module.exports = webpack
```















## 总结

### 1. 文件作用

**webpack.js**中webpack方法

1. 接收webpack.config.js参数，返回compiler实例
2. 初始化参数
3. 始化 Compiler 对象实例
4. 加载所有配置的插件

### 2. 流程总结

#### **初始化参数：**

1. **初始化参数**：从配置文件和 Shell 语句中读取并合并参数,得出最终的配置对象（命令行优先级高）

#### **开始编译**

2. 用上一步得到的参数**初始化 Compiler 对象**
   1. 初始化options参数和hooks （` run: new SyncHook()`, //在开始编译之前调用...）

3. **加载**所有配置的**插件**：
   1. 在配置中找到plugins数组
   2. 遍历plugins执行每个插件的apply方法，并把compiler实例传进去（每个插件都有一个apply方法）
   3. 执行` compiler.hooks.run.tap`等方法注册事件

4. **执行**`compiler`实例的 **run 方法**开始执行编译
   1. 整个过程伴随着触发插件的注册个各种钩子函数，run done...
   2. 开启一次新的编译，创建一个新的Compilation实例
   3. 执行实例的build方法，传入完成的回调

#### **编译模块**

5. 根据配置中的entry找出入口文件
   1. 格式化入口文件，变成对象形式
   2. 对入口进行遍历，获取入口文件的绝对路径，添加到文件依赖列表中



6. 从入口文件出发,调用所有配置的Loader对模块进行编译



7. 再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
