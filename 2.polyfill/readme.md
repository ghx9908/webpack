### 1、 useBuiltIns: false

- `babel-polyfill` 它是通过向全局对象和内置对象的`prototype`上添加方法来实现的。比如运行环境中不支持`Array.prototype.find`方法，引入`polyfill`, 我们就可以使用`ES6`方法来编写了，但是缺点就是会造成全局空间污染
- [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env)为每一个环境的预设
- `@babel/preset-env`默认只支持语法转化，需要开启`useBuiltIns`配置才能转化 API 和实例方法
- `useBuiltIns`可选值包括："usage" | "entry" | false, 默认为 false，表示不对`polyfills` 处理，这个配置是引入 polyfills 的关键
- `useBuiltIns: false` 此时不对 `polyfill` 做操作。如果引入 `@babel/polyfill`，则无视配置的浏览器兼容，引入所有的 `polyfill`

### 2、useBuiltIns: "entry"

- 在项目入口引入一次（多次引入会报错）
- "useBuiltIns": "entry" 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill。需要在入口文件手动添加 `import '@babel/polyfill'`，会自动根据 browserslist 替换成浏览器不兼容的所有 polyfill
- 这里需要指定 core-js 的版本,`corejs`默认是 2,
- 如果配置 `corejs: 3`, 则`import '@babel/polyfill'` 需要改成 `import 'core-js/stable';import 'regenerator-runtime/runtime';`
- - `corejs`默认是 2

### 3、 "useBuiltIns": "usage"

- "useBuiltIns": "usage" `usage` 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill，实现了按需添加
- 当设置为 usage 时，polyfill 会自动按需添加，不再需要手工引入`@babel/polyfill`
