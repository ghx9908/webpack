/**
 * 如果原模块是esmodule
 * 先执行require.r
 * 再执行require.d
 */
var modules = {
  "./src/title.js": (module, exports, require) => {
    //1.声明或者说表示当前的模块原来是一个es module

    require.r(exports)
    //2. 定义属性
    require.d(exports, {
      age: () => age,
      default: () => _DEFAULT_EXPORT__,
    })
    // 此处为了实现Livbinding做准备
    const _DEFAULT_EXPORT__ = (name = "title_name")
    const age = "title_age"
  },
}
var cache = {}
/**
 * 执行modules对象对应的模块函数
 * @param {*} moduleId 模块Id
 * @returns module.exports
 */
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
/**
 * 给exports 上面定义属性
 * @param {*} exports 导出对象
 * @param {*} definition 定义的属性
 */
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

require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/**
 * 给exports 声明 Symbol.toStringTag为Module ，__esModule 未true
 * @param {*} exports
 */
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

//入口
var exports = {}
//标明是esModule模块
require.r(exports)
//加载对应的模块
var _title_0__ = require("./src/title.js")
//取值
console.log(_title_0__["default"])
console.log(_title_0__.age)
