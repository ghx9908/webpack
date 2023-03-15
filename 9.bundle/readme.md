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
