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
module.exports = "title";
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
