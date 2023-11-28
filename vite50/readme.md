## 描述
1. 扫描整个项目,找到依赖的第三方模块
2. 编译这些第三方模块,放到.vite目录中
3. 重写返回的导入路径,指向编译 后的文件 main.js

```js
import { createApp } from 'vue';
import { createApp } from '/node_modules/.vite/deps/vue.js';
```
4. 请求服务器的时候,服务器可以返回/node_modules/.vite/deps/vue.js
