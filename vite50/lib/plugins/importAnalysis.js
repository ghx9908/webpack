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
    async transform(source, importer) {
      await init;//等待解析器初始化完成
      let imports = parse(source)[0]; //获取导入的模块
      if (!imports.length) {
        return source;
      }

      const { moduleGraph } = server
      const importerModule = moduleGraph.getModuleById(importer)
      const importedUrls = new Set() //被谁导入
      const acceptedUrls = new Set()//导入了谁
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
        await moduleGraph.ensureEntryFromUrl(url)
        return url;
      };
      //重写路径
      for (let index = 0; index < imports.length; index++) {
          //n=specifier=vue
        const { s: start, e: end, n: specifier } = imports[index];
        const rawUrl = source.slice(start, end)
        if (rawUrl === 'import.meta') {
            const prop = source.slice(end, end + 4)
            if (prop === '.hot') {
              if (source.slice(end + 4, end + 11) === '.accept') {
                lexAcceptedHmrDeps(source, source.indexOf('(', end + 11) + 1, acceptedUrls)
              }
            }
          }
          
        if (specifier) {
          const normalizedUrl = await normalizeUrl(specifier);
          if (normalizedUrl !== specifier) {
            ms.overwrite(start, end, normalizedUrl);
          }
          importedUrls.add(normalizedUrl)
        }
      }
      const normalizedAcceptedUrls = new Set()
      const toAbsoluteUrl = (url) =>
        path.posix.resolve(path.posix.dirname(importerModule.url), url)
      for (const { url, start, end } of acceptedUrls) {
        const [normalized] = await moduleGraph.resolveUrl(toAbsoluteUrl(url),)
        normalizedAcceptedUrls.add(normalized)
        ms.overwrite(start, end, JSON.stringify(normalized))
      }
      await moduleGraph.updateModuleInfo(
        importerModule,
        importedUrls,
        normalizedAcceptedUrls
      )
      return ms.toString();
    },
  };
}
module.exports = importAnalysisPlugin;
