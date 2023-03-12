## 1. sourcemap

### 1.1 什么是sourceMap

- sourcemap是为了解决开发代码与实际运行代码不一致时帮助我们debug到原始开发代码的技术
- webpack通过配置可以自动给我们`source maps`文件，`map`文件是一种对应编译文件和源文件的方法

| sourcemap 类型                 | 适用场景                                 | 优缺点                                                     |
| :----------------------------- | :--------------------------------------- | :--------------------------------------------------------- |
| `source-map`                   | 原始代码，需要最好的 sourcemap 质量      | 最高的质量和最低的性能                                     |
| `eval-source-map`              | 原始代码，需要高质量的 sourcemap         | 高质量和低性能，sourcemap 可能会很慢                       |
| `cheap-module-eval-source-map` | 原始代码，需要高质量和低性能的 sourcemap | 高质量和更低的性能，只有每行的映射                         |
| `cheap-eval-source-map`        | 转换代码，需要行内 sourcemap             | 更高的质量和更低的性能，每个模块被 eval 执行               |
| `eval`                         | 生成代码，需要带 eval 的构建模式         | 最低的质量和更低的性能，但可以缓存 sourcemap               |
| `cheap-source-map`             | 转换代码，需要行内 sourcemap             | 没有列映射，从 loaders 生成的 sourcemap 没有被使用         |
| `cheap-module-source-map`      | 原始代码，需要只有行内的 sourcemap       | 没有列映射，但包括从 loaders 中生成的 sourcemap 的每行映射 |
| `hidden-source-map`            | 需要隐藏 sourcemap                       | 能够隐藏 sourcemap                                         |
| `nosources-source-map`         | 需要正确提示报错位置，但不暴露源码       | 能够正确提示报错位置，但不会暴露源码                       |



### 1.2 配置项

- 配置项其实只是五个关键字eval、source-map、cheap、module和inline的组合

| sourcemap 类型 | 描述                                            |
| :------------- | :---------------------------------------------- |
| `source-map`   | 生成 .map 文件                                  |
| `eval`         | 使用 eval 包裹模块代码                          |
| `cheap`        | 不包含列信息，也不包含 loader 的 sourcemap      |
| `module`       | 包含 loader 的 sourcemap，否则无法定义源文件    |
| `inline`       | 将 .map 作为 DataURI 嵌入，不单独生成 .map 文件 |

#### 1.2.1 source-map



