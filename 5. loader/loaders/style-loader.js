function loader(source) {}
function normalize(path) {
  return path.replace(/\\/g, "/")
}
loader.pitch = function (remainingRequest) {
  console.log("remainingRequest", remainingRequest)
  console.log("context", this.context) //index.less模块所在的目录 可以用作解析其他模块成员的上下文
  console.log("context", this.context) //index.less模块所在的目录 可以用作解析其他模块成员的上下文
  //1.获取剩下的请求
  //2.用!分割得到各个部分的绝对路径前面是loader路径，后面是文件路径
  //3.把路径从绝对路径变成相对于根目录的相对路径
  //路径的前面要加上!!,只使用行内loader,不使用rule里面配置的loader,不然就会死循环了

  /*   const request = "!!"+(remainingRequest.split('!').map(
    //request => this.utils.contextify(this.context, request)
    //这个路径其实就是模块的ID
    requestAbsPath => ("./" + path.posix.relative(normalize(this.context), normalize(requestAbsPath)))
  ).join('!'));
  console.log('request', request);
   */

  const request =
    "!!" +
    remainingRequest
      .split("!")
      .map((request) => this.utils.contextify(this.context, request))
      .join("!")
  console.log("request", request)
  let script = `
  let styleCSS = require(${JSON.stringify(request)});
  let style = document.createElement('style');
  style.innerHTML =styleCSS;
  document.head.appendChild(style);
`
  return script
}

module.exports = loader

//require("!!../loaders/less-loader.js!./index.less");

// function loader(source) {
//   let script = `
//   let style = document.createElement('style');
//   style.innerHTML =${JSON.stringify(source)};
//   document.head.appendChild(style);
// `
//   return script
// }
