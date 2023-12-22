const importAnalysisPlugin = require("./importAnalysis");
const preAliasPlugin = require("./preAlias");
const resolvePlugin = require("./resolve");
const definePligin = require("./define");
async function resolvePlugins(config,userPlugins) {
  // 此处返回的是vite的内置插件
  return [
    preAliasPlugin(config), //把vue=>vue.js
    resolvePlugin(config),// 返回绝对路径
    ...userPlugins,
    definePligin(config),// 定义环境变量
    importAnalysisPlugin(config),
  ];
}
exports.resolvePlugins = resolvePlugins;
