const fs = require("fs");
const path = require("path");
const resolve = require("resolve");
//函数resolvePlugin用于解析插件
// 这个插件既是vite的插件，也是rollup的插件
function resolvePlugin(config) {
  //返回一个对象
  return {
    //对象属性name
    name: "vite:resolve",
    //resolveId函数用于解析id
    resolveId(id, importer) {
      //如果/开头表示是绝对路径
      if (id.startsWith("/")) {
        return { id: path.resolve(config.root, id.slice(1)) };
      }
      //如果是绝对路径
      if (path.isAbsolute(id)) {
        return { id };
      }
      //如果是相对路径
      if (id.startsWith(".")) {
        const basedir = path.dirname(importer);
        const fsPath = path.resolve(basedir, id);
        return { id: fsPath };
      }
      //如果是第三方包
      let res = tryNodeResolve(id, importer, config);
      if (res) {
        return res;
      }
    },
  };
}

//函数tryNodeResolve用于尝试使用node的resolve解析
function tryNodeResolve(id, importer, config) {
  //使用resolve.sync解析id，并返回解析后的路径
  const pkgPath = resolve.sync(`${id}/package.json`, { basedir: config.root });
  //获取解析后的路径的父路径
  const pkgDir = path.dirname(pkgPath);
  //读取解析后的路径的文件
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  //获取模块的入口
  const entryPoint = pkg.module;
  //拼接模块的入口的路径
  const entryPointPath = path.join(pkgDir, entryPoint);
  //返回模块的入口的路径
  return { id: entryPointPath };
}
//导出resolvePlugin函数
module.exports = resolvePlugin;
