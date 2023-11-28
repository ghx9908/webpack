// 引入fast-glob模块
const fg = require("fast-glob");
// 异步执行函数
(async () => {
  // 获取当前目录下所有js文件
  const entries = await fg(["**/*.js"]);
  // 打印文件路径
  console.log(entries);
})();
