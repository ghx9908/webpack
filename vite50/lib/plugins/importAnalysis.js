const { init, parse } = require("es-module-lexer");
const MagicString = require("magic-string");
function importAnalysisPlugin(config) {
  const { root } = config;
  return {
    name: "vite:import-analysis",
    //1.找到源文件中第三方模块2.进行转换 vue=>deps/vue.js
    async transform(source, importer) {
      debugger
      await init;//等待解析器初始化完成
      let imports = parse(source)[0]; //获取导入的模块
      if (!imports.length) {
        return source;
      }
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
        return url;
      };
      //重写路径
      for (let index = 0; index < imports.length; index++) {
          //n=specifier=vue
        const { s: start, e: end, n: specifier } = imports[index];
        if (specifier) {
          const normalizedUrl = await normalizeUrl(specifier);
          if (normalizedUrl !== specifier) {
            ms.overwrite(start, end, normalizedUrl);
          }
        }
      }
      return ms.toString();
    },
  };
}
module.exports = importAnalysisPlugin;
