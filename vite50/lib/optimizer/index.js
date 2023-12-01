// 引入scan模块
const scanImports = require("./scan");
// 异步函数，用于创建优化依赖运行
// 分析项目依赖的第三方模块
async function createOptimizeDepsRun(config) {
  // 扫描导入
  const deps = await scanImports(config);
  // 打印依赖
  console.log(deps);
}
// 导出函数
exports.createOptimizeDepsRun = createOptimizeDepsRun;
