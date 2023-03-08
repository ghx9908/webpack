## 1.loader

### 1.1 概念

- 所谓 loader 只是一个导出为函数的 JavaScript 模块。它接收上一个 loader 产生的结果或者资源文件(resource file)作为入参。也可以用多个 loader 函数组成 loader chain
- compiler 需要得到最后一个 loader 产生的处理结果。这个处理结果应该是 String 或者 Buffer（被转换为一个 string）

### 1.2 loader 类型

- [loader 的叠加顺序](https://github.com/webpack/webpack/blob/v4.39.3/lib/NormalModuleFactory.js#L159-L339) = post(后置)+inline(内联)+normal(正常)+pre(前置)

### 1.3 特殊配置

```js
/**
 * Auto=Normal
 * !  noAuto 不要普通 loader
 * -! noPreAuto 不要前置和普通 loader
 * !! noPrePostAuto 不要前后置和普通 loader,只要内联 loader
 */
```

### 1.4 pitch

- 比如 `a!b!c!module`, 正常调用顺序应该是 c、b、a，但是真正调用顺序是 a(pitch)、b(pitch)、c(pitch)、c、b、a,如果其中任何一个 pitching loader 返回了值就相当于在它以及它右边的 loader 已经执行完毕
- 比如如果 b 返回了字符串"result b", 接下来只有 a 会被系统执行，且 a 的 loader 收到的参数是 result b

![](https://raw.githubusercontent.com/ghx9908/image-hosting/master/img/20230307173454.png)

### 1.5 配置自定义 loader 有以下几种方式

1. 配置绝对路径

2. 配置 resolveLoader 中的 alias

3. 如果说 loader 很多，用 alias 一个一个配很麻烦，resolveLoader.modules 指定一个目录，找 loader 的时候会先去此目录下面找
