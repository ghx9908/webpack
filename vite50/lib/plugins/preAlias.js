
function preAlias() {
  let server;
  return {
    name: 'preAlias',
    configureServer(_server) {
      server = _server;
    },
    resolveId(id) {
      const metadata = server._optimizeDepsMetadata;
      const isOptimized = metadata.optimized[id];
      //如果有对应的值说明此模块预编译过了
      if (isOptimized) {
        return {
          //file硬盘写入的是相对于deps的相对路径，但是内存里放的是vue.js的绝对路径
          id: isOptimized.file
        }
      }
    }
  }
}
module.exports = preAlias;
