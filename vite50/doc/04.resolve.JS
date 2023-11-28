// 引入resolve模块
const resolve = require("resolve");
// 同步查找文件路径，并返回
const res = resolve.sync("check-is-array", { basedir: __dirname });
// 打印出文件路径
console.log(res);
