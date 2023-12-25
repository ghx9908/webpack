const fs = require("fs-extra");
const { parse } = require("url");
/**
 * 转换请求
 * @param {*} url  请求的资源 /src/main.js
 * @param {*} server 
 * @returns 
 */
async function transformRequest(url, server) {
  // resolveId 获取src/main.js的绝对路径
  const { pluginContainer } = server;
  const { id } = await pluginContainer.resolveId(url); //获取此文件的绝对路径
  // load  读取src/main.js的内容
  const loadResult = await pluginContainer.load(id); //加载此文件的内容
  // transform  转换main.js的内容 把vue=》vue.js
  let code;
  if (loadResult) {
    code = loadResult.code;
  } else {
    let fsPath = parse(id).pathname;
    code = await fs.readFile(fsPath, 'utf-8')
  }
  await server.moduleGraph.ensureEntryFromUrl(url) 
  //转换文件内容
  const transformResult = await pluginContainer.transform(code, id);
  return transformResult;
}
module.exports = transformRequest;
