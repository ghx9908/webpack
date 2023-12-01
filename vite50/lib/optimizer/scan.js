const { build } = require("esbuild");
const esbuildScanPlugin = require("./esbuildScanPlugin");
const path = require("path");
// 扫描项目中导入的第三方依赖
async function scanImports(config) {
  // 存储导入的依赖
  const depImports = {};
  // 加载esbuild插件 创建一个esbuild的扫描插件
  const esPlugin = await esbuildScanPlugin(config, depImports);
  // 使用esbuild构建
  await build({
    // 当前工作目录
    absWorkingDir: config.root,
    // 编译入口文件
    entryPoints: [path.resolve("./index.html")],
    // 是否打包
    bundle: true,
    // 输出格式
    format: "esm",
    // 输出文件
    outfile: "dist/index.js",
    // 是否写入文件
    write: true,//真是的代码中write:false 不需要写入文件
    // 插件
    plugins: [esPlugin],
  });
  // 返回导入的依赖
  return depImports;
}
// 导出函数
module.exports = scanImports;
