/**
 * 分析抽象语法树（AST）的语句，给每个语句添加_module和_source属性
 *
 * @param ast 抽象语法树
 * @param code 源代码
 * @param module 模块的实例
 */
function analyse(ast, code, module) {
  // 遍历ast的body，给每个statement定义属性
  ast.body.forEach(statement => {
    Object.defineProperties(statement, {
      // 给statement添加_module属性，指向模块的实例
      _module: { value: module },
      // 给statement添加_source属性，指向源代码
      _source: { value: code.snip(statement.start, statement.end) }
    })
    // console.log('=>',statement._source.toString())
  });
}
module.exports = analyse;
