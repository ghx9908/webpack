var modules = {
  "./src/title.js": (module) => {
    module.exports = {
      name: "title_name",
      age: "title_age",
    }
  },
}
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
/**
 * 判断是否exModule 是的返回module["default"] 否则commonjs模块返回本身
 * @param {*} module
 * @returns
 */
require.n = (module) => {
  //判断是否exModule 是的化返回module["default"] 否则commonjs模块返回本身
  var getter =
    module && module.__esModule ? () => module["default"] : () => module
  require.d(getter, {
    a: getter,
  })
  return getter
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
//判断是否是自身属性
require.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
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
// 兼容处理，取默认值
var _title_0___default = require.n(_title_0__)
console.log(_title_0___default())
console.log(_title_0__.age)
