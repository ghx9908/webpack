const { init, parse } = require("es-module-lexer");
const MagicString = require("magic-string");
const { lexAcceptedHmrDeps } = require('../server/hmr');
const path = require('path');
function importAnalysisPlugin(config) {
  const { root } = config;
  let server
  return {
    name: "vite:import-analysis",
    //1.找到源文件中第三方模块2.进行转换 vue=>deps/vue.js

    configureServer(_server) {
      server = _server
    },
    // 处理模块  1 找文件 2 读内容 3 转换内容
    // src/main.js  soucrce=main.js  importer= 绝对路径
    async transform(source, importer) {
      await init;//等待解析器初始化完成
      let imports = parse(source)[0]; //获取导入的模块
      if (!imports.length) {
        return source;
      }

      const { moduleGraph } = server// 取出模块以依赖图
      // 通过导入方的模块路径获取模块节点
      const importerModule = moduleGraph.getModuleById(importer)//main.js
      const importedUrls = new Set() //此模块将要导入的模块
      const acceptedUrls = new Set()//接收变更的依赖的模块
      let ms = new MagicString(source);
       //url= vue =>  /node_modules/.vite/deps/vue.js
      const normalizeUrl = async (url) => {
        //解析此导入的模块的路径
        const resolved = await this.resolve(url, importer);
        if (resolved.id.startsWith(root + "/")) {
          //把绝对路径变成相对路径
            //C:/vite50use/node_modules/.vite50/deps/vue.js
            // /node_modules/.vite50/deps/vue.js
          url = resolved.id.slice(root.length);
        }
        await moduleGraph.ensureEntryFromUrl(url)// 建立此导入模块和模块节点的对应关系
        return url;
      };
      //重写路径
      for (let index = 0; index < imports.length; index++) {
          //n=specifier=vue
        const { s: start, e: end, n: specifier } = imports[index];
        const rawUrl = source.slice(start, end)// 原始的引用地址 import.mate
        if (rawUrl === 'import.meta') {
            const prop = source.slice(end, end + 4)
            if (prop === '.hot') {
              if (source.slice(end + 4, end + 11) === '.accept') {
                lexAcceptedHmrDeps(source, source.indexOf('(', end + 11) + 1, acceptedUrls)//此法分析热更新的依赖 此处存的路径可能是相对的 也可能是第三方
              }
            }
          }
          
        if (specifier) {
          const normalizedUrl = await normalizeUrl(specifier);
          if (normalizedUrl !== specifier) {
            ms.overwrite(start, end, normalizedUrl);
          }
          //把解析后的模块ID 添加到importedUrls
          importedUrls.add(normalizedUrl)
        }
      }
      const normalizedAcceptedUrls = new Set()
      const toAbsoluteUrl = (url) =>
        path.posix.resolve(path.posix.dirname(importerModule.url), url)
      //把解析后的模块ID 添加到normalizedAcceptedUrls
      for (const { url, start, end } of acceptedUrls) {
        const [normalized] = await moduleGraph.resolveUrl(toAbsoluteUrl(url),)
        normalizedAcceptedUrls.add(normalized)
        ms.overwrite(start, end, JSON.stringify(normalized))// 重写路径
      }
      //更新模块依赖信息
      await moduleGraph.updateModuleInfo(
        importerModule,
        importedUrls,//导入的模块
        normalizedAcceptedUrls//依赖的绝对路径模块
      )
      return ms.toString();
    },
  };
}
module.exports = importAnalysisPlugin;
