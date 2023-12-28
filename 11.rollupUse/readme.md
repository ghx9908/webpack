##  vite3
- 开发的时候打包用的esbuild
- 上线的时候打包用的是rollup
- vite内部也是通过插件实现的，插件机制复用的rollup的插件机制

## webpack和rollup打包区别
webpack和rollup都会支持esm 和commonjs
但是打包出来的结果 webpack只能是commonjs .rollup可以打包出commonjs也可以打包出esm


## 插件规范
rollup和vite插件可复用，但是和esbuild插件不行不行


## 摇树功能不是要求webpack得是es吗规范吗
  treeshaking必须 要求是esm 
  esm是静态的 commonsjs是动态的


## 支持babel
为了使用新的语法，可以使用babel来进行编译输出
- @babel/core是babel的核心包
- @babel/preset-env 是预设
- @rollup/plugin-babel 是babel插件

### .babelrc 和 babel.config.js 有什么区别？ 
配置文件的格式不同，本质上没有区别
https://www.babeljs.cn/docs/config-files

### webpack中规定插件是类，rullup中的插件是普通函数吗，
是的

## tree-shaking
- Tree-shaking的本质是消除无用的js代码
- rollup只处理函数和顶层的import/export变量


## 使用第三方模块

1. rollup.js编译源码中的模块引用默认只支持 ES6+的模块方式import/export，不支持CommonJS的require()，
2. 如需要使用CommonJS的模块，需要安装rollup-plugin-commonjs插件



## 问答
1. rollup中是不是没有loader的概念，所有东西都是通过插件来实现
  是的
