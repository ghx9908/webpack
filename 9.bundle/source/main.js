var modules = {}
var cache = {}
function require(moduleId) {
  var cachedModule = cache[moduleId]
  if (cachedModule !== undefined) {
    return cachedModule.exports
  }
  var module = (cache[moduleId] = {
    exports: {},
  })
  modules[moduleId](module, module.exports, require)
  return module.exports
}
require.m = modules
require.d = (exports, definition) => {
  for (var key in definition) {
    if (require.o(definition, key) && !require.o(exports, key)) {
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key],
      })
    }
  }
}
require.f = {} //空对象
/**
 *
 * @param {*} chunkId  chunk 代码块 模块的集合
 * @returns 返回Promise
 */
require.e = (chunkId) => {
  let promises = []
  require.f.j(chunkId, promises)
  return Promise.all(promises)
}

require.u = (chunkId) => {
  return "" + chunkId + ".main.js"
}
require.g = (function () {
  if (typeof globalThis === "object") return globalThis
  try {
    return this || new Function("return this")()
  } catch (e) {
    if (typeof window === "object") return window
  }
})()
require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
// 通过JSONP加载代码 动态加载代码 原代码中会有一个定时器，成功后达到时间删除创建script标签
require.l = (url) => {
  let script = document.createElement("script")
  script.src = url
  document.head.appendChild(script)
}
require.r = (exports) => {
  if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
    Object.defineProperty(exports, Symbol.toStringTag, {
      value: "Module",
    })
  }
  Object.defineProperty(exports, "__esModule", {
    value: true,
  })
}

//源代码加载绝对路径 此处写成''
require.p = ""

//已经安装过的，或者说已经加载好的代码块
//key是代码块的名字，值是代码块的状态
//main就是默认代码块的名称 0表示已经加载完成
var installedChunks = {
  main: 0,
  //当一个代码块它的值是一个数组的时候表示此代码块对应的JS文件正在加载中
  //'src_hello_js':[resolve,reject,promise]=>0
}
/**
 *sonp 通过JSONP的方式加载chunkId对应的JS文件，生成一个promise放到promises数组里
 * @param {*} chunkId
 * @param {*} promises
 */
require.f.j = (chunkId, promises) => {
  //做缓存
  var installedChunkData = require.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined
  if (installedChunkData !== 0) {
    const promise = new Promise((resolve, reject) => {
      installedChunkData = installedChunks[chunkId] = [resolve, reject]
    })
    installedChunkData[2] = promise
    //installedChunkData=[resolve,reject,promise]
    promises.push(promise)
    const url = require.p + require.u(chunkId)
    require.l(url)
  }
}
/**
 *
 * @param {*} chunkIds ["src_title_js"],
 * @param {*} moreModules Modules 对象
 */
function webpackJsonpCallback([chunkIds, moreModules]) {
  const resolves = []
  for (let i = 0; i < chunkIds.length; i++) {
    const chunkId = chunkIds[i] //src_title_js
    const resolve = installedChunks[chunkId][0]
    resolves.push(resolve)
    //到这里此代码块就已经加载成功了，可以把chunkId的值设置为0
    installedChunks[chunkId] = 0
  }
  for (const moduleId in moreModules) {
    modules[moduleId] = moreModules[moduleId]
  }
  while (resolves.length) {
    //取出所有的resolve方法，让它执行，让它对应的promise变成成功态
    resolves.shift()()
  }
}
const chunkLoadingGlobal = (window["someName"] = [])
chunkLoadingGlobal.push = webpackJsonpCallback
var exports = {}
debugger
require
  .e("src_title_js")
  .then(require.bind(require, "./src/title.js"))
  .then((module) => {
    console.log(module.default)
    require
      .e("src_title_js")
      .then(require.bind(require, "./src/title.js"))
      .then((result) => {
        console.log(result.default)
      })
  })
