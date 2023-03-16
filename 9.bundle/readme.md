## 1. 同步加载

### 块没有依赖

src\index.js

```js
console.log(title)
```

bundle.js

```js
//导出对象
var exports = {}
//模块内容
console.log(title)
```

### **打包模块分析**

src\index.js

```JS
let title = require("./title.js");
console.log(title);
```

src\title.js

```js
module.exports = "title"
```

bundle.js

> 未加入缓存

```js
//模块定义
//key是模块ID，也就是模块相对于相前根目录的相对路径
var modules = {
  "./src/title.js": (module) => {
    module.exports = "title"
  },
}
function require(moduleId) {
  var module = {
    exports: {},
  }
  modules[moduleId](module, module.exports, require)
  return module.exports
}

//入口
var exports = {}
let title = require("./src/title.js")
console.log(title)
```

## 2. 兼容性实现

### 2.1 common.js 加载 common.js

#### 2.1.1 index.js

```js
let title = require("./title")
console.log(title.name)
console.log(title.age)
```

#### 2.1.2 title.js

```js
exports.name = "title_name"
exports.age = "title_age"
```

#### 2.1.3 bundle.js

```js
;(() => {
  //需要加载的模块
  var modules = {
    "./src/title.js": (module, exports) => {
      exports.name = "title_name"
      exports.age = "title_age"
    },
  }
  //缓存
  var cache = {}
  //require 方法
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
  // 入口
  var exports = {}
  ;(() => {
    let title = require("./src/title.js")
    console.log(title.name)
    console.log(title.age)
  })()
})()
```

### 2.2 common.js 加载 ES6 modules

#### 2.2.1 index.js

```js
let title = require("./title")
console.log(title)
console.log(title.age)
```

#### 2.2.2 title.js

```js
export default "title_name"
export const age = "title_age"
```

#### 2.2.3 bundle.js

> 去除了自执行函数和模块缓存

- 打包前面是 commonjs 打包后不需要变，打包前是 esmodule 打包后得变

```js
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
```
