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

