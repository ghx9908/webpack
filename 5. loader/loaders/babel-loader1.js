const babel = require("@babel/core")
const path = require("path")
function loader(source, ast, inputSourceMap) {
  //在loader里this其实是一个称为loaderContext的对象
  //需要把loader的执行从同步变成异步
  //https://webpack.docschina.org/api/loaders/#thisresourcepath
  //告诉 loader-runner 这个 loader 将会异步地回调。返回 this.callback
  //console.log(this);
  const callback = this.async()
  let options = this.getOptions()
  let babelOptions = {
    ...options,
    ast: true,
    sourceMaps: true, //当前转换babel的时候要生成sourcemap
    inputSourceMap, //接收上一个份sourcemap
  }
  babel.transformAsync(source, babelOptions).then(({ code }) => {
    //在loader执行完成后才让调用callback表示本loader 已经完成了，才能继续向下执行下一个loader或者后续的编译
    callback(null, code)
    //this.callback(null,code);
  })
}
module.exports = loader

/* 
同步转换
function loader(source) {
  //在loader里this其实是一个称为loaderContext的对象
  let options = this.getOptions();
  const { code} = babel.transformSync(source,options);
  return code;
} */

/**
 * 异步
 * function loader(source) {
  //在loader里this其实是一个称为loaderContext的对象
  //需要把loader的执行从同步变成异步
  //https://webpack.docschina.org/api/loaders/#thisresourcepath
  //告诉 loader-runner 这个 loader 将会异步地回调。返回 this.callback
  //console.log(this);
  const callback = this.async();
  console.log(callback === this.callback);
  let options = this.getOptions();
  babel.transformAsync(source, options).then(({ code }) => {
    //在loader执行完成后才让调用callback表示本loader 已经完成了，才能继续向下执行下一个loader或者后续的编译
    callback(null, code);
    //this.callback(null,code);
  });
}
 */
