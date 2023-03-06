//1.webpack通过node.js读取CSS文件的内容,交给css-loader进行处理
let cssText = `
body{
    color: red;
}
`
//2.css-loader是一个转换函数，接收老内容，返回新内容
let cssModule = `
module.exports = "
body{
    color: red;
}
"
`
//3.把上面转换后的内容交给style-loader,返回一个新的JS内容
;```js
let style = document.createElement('style');
style.innerHTML = "
body{
    color: red;
}
"
document.head.appendChild(style);
```
