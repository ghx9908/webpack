const importAnalysisPlugin = require("./importAnalysis");
const preAliasPlugin = require("./preAlias");
const resolvePlugin = require("./resolve");
async function resolvePlugins(config) {
  // 此处返回的是vite的内置插件
  return [
    preAliasPlugin(config), //把vue=>vue.js
    resolvePlugin(config),// 返回绝对路径
    importAnalysisPlugin(config),
  ];
}
exports.resolvePlugins = resolvePlugins;
