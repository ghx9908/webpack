vite分为两部分
- 一部分是Node服务器端
- 一部分是client客户端代码

## 描述
1. 扫描整个项目,找到依赖的第三方模块
2. 编译这些第三方模块,放到.vite目录中
3. 重写返回的导入路径,指向编译 后的文件 main.js

```js
import { createApp } from 'vue';
import { createApp } from '/node_modules/.vite/deps/vue.js';
```
4. 请求服务器的时候,服务器可以返回/node_modules/.vite/deps/vue.js


##  项目启动的第一步

- 1. 查找当前项目依赖的第三方模块
- 2. 把它们的es module版本进行打包，存放在`node_modules\.vite\deps`
node_modules\.vite\deps\vue.js
node_modules\.vite\deps\_metadata.json
node_modules\.vite\deps就是依赖缓存存放目录
{
  "optimized": {
    "vue": {
      "src": "../../vue/dist/vue.runtime.esm-bundler.js",
      "file": "vue.js"
    }
  },
}



## 打包的时候 
找到入口模块，然后再找到入口模块依赖的模块，
每个模块的处理都要有3步走
1. 找到模块绝对路径
2. 读取模块内容
3. 解析模块内容
onResolve onLoad


## vite 的入口是index
是的


## 为什么要先编译发了叫这样可以减少http请求
index.js  a  b c d 100.js
请客户端index.js,再去请求 a b c d 100个请求
服务器启动前
index  a b c d  1000合并成一个文件
后面请求的时候请求一个文件就可以


## 编译的时候esbuild 会 tree shaking吗 
没有


## esbuild执行了几次？？

至少是一次
找依赖
然后有多少第三方依赖就再执行多次少
1+n次


## HRM
```json
{"type":"update","updates":[{"type":"js-update","timestamp":1663766475066,"path":"/src/main.js","explicitImportRequired":false,"acceptedPath":"/src/renderModule.js"}]}
```

当一个模块发生变化的时候，会向上通知，如果有一个模块能够接收自己的改变，那么就到此为止
让此接收的模块执行回调，处理更新
如果一直向上通知，没有任何一个模块能接收，直接 刷新浏览器


## 热更新思路
1.会在服务器端构建一个moduleGraph,或者说模块依赖图，里面会记录
每个模块的信息。
idToModuleMap key模块的绝对路径 值是模块节点的对象
ModuleNode
importers 此模块被哪些模块导入了，或者说依赖了
acceptedHmrDeps 当哪些子模块发生变更 的时候，自己的可以处理对应的更新了
a  [b,c,d]
a acceptedHmrDeps b 只能接受或者说处理b的更新
