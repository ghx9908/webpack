import fs from 'fs';

function build() {
  return {
    name: 'build',
    async watchChange(id, change) {
      console.log('watchChange', id, change);
    },
    async closeWatcher() {
      console.log('closeWatcher');
    },
    // 第一个
    async options(inputOptions) {
      console.log('options',inputOptions);
      //inputOptions.input = './src/main.js';
    },
    // 开始
    async buildStart(inputOptions) {
      console.log('buildStart',inputOptions);
    },
    // 解析路径
    async resolveId(source, importer) {
      console.log('resolveId', source, importer);
      if (source === 'virtual') {
        console.log('resolveId', source);
        //如果resolveId钩子有返回值了，那么就会跳过后面的查找逻辑，以此返回值作为最终的模块ID
        return source;
      }
    },
    //加载此模块ID对应的内容
    async load(id) {
      console.log('load=>',id)
      if (id === 'virtual') {
        console.log('load', id);
        return `export default "virtual"`;
      }
    },
    // 是否转换缓存的模块
    async shouldTransformCachedModule({ id, code, ast }) {
      console.log('shouldTransformCachedModule', id, code, ast);
      //不使用缓存，再次进行转换
      return true;
    },
    // 转换模块内容
    async transform(code, id) {
      console.log('transform',code,id);
    },
    // 解析模块ID
    async moduleParsed(moduleInfo) {
      console.log('moduleInfo',moduleInfo);
    },
    // 解析动态导入
    async resolveDynamicImport(specifier, importer) {
      console.log('resolveDynamicImport', specifier, importer);
    },
    // 结束
    async buildEnd() {
      console.log('buildEnd');
    }
  }
}
export default build;
