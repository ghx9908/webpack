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
      default: () => DEFAULT_EXPORTS, //值是一个getter
    })
    //默认导出
    const DEFAULT_EXPORTS = "title_name"
    //命名导出
    const age = "title_age"
  },
}
/**
 * 执行modules对象对应的模块函数
 * @param {*} moduleId 模块Id
 * @returns module.exports
 */
function require(moduleId) {
  var module = {
    exports: {},
  }
  modules[moduleId](module, module.exports, require)
  return module.exports
}
/**
 * 给exports 上面定义属性
 * @param {*} exports 导出对象
 * @param {*} definition 定义的属性
 */
require.d = (exports, definition) => {
  //遍历key
  for (var key in definition) {
    //在 definition 上不在 exports 上就赋值
    if (require.o(definition, key) && !require.o(exports, key)) {
      // 给exports 上面定义属性 geT 获取
      Object.defineProperty(exports, key, {
        enumerable: true,
        get: definition[key],
      })
    }
  }
}
//对象自身属性中是否具有指定的属性
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

var exports = {}

let title = require("./src/title.js")
console.log(title)
console.log(title.default)
console.log(title.age)
