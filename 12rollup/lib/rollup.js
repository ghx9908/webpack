const Bundle = require('./bundle')

/**
 * 使用 Rollup 进行打包
 *
 * @param entry 入口文件路径
 * @param filename 输出文件名
 */
function rollup(entry, filename) {
  // 创建一个新的 Bundle 实例
  const bundle = new Bundle({ entry });

  // 调用 Bundle 实例的 build 方法，并传入 filename 参数
  bundle.build(filename);
}

module.exports = rollup;
