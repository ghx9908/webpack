const MagicString = require('magic-string');
const { parse } = require('acorn');
let analyse = require('./ast/analyse');
class Module {
  /**
   * 构造函数
   *
   * @param options - 选项对象
   * @param options.code - 模块的源代码
   * @param options.path - 模块的路径
   * @param options.bundle - Bundle实例
   */
  constructor({ code, path, bundle }) {
    this.code = new MagicString(code, { filename: path });
    this.path = path;
    this.bundle = bundle;
    this.ast = parse(code, {
      ecmaVersion: 8,
      sourceType: 'module'
    })
    // 给每个语句添加_module和_source属性
    analyse(this.ast, this.code, this);
  }
  /**
   * 展开所有语句
   *
   * @returns 返回所有语句的数组
   */
  expandAllStatements() {
    // 定义一个空数组，用于存储所有的语句
    let allStatements = [];
    // 遍历抽象语法树（AST）的语句
    this.ast.body.forEach(statement => {
      // 扩展单个语句
      let statements = this.expandStatement(statement);
      // 将扩展后的语句添加到所有的语句中
      allStatements.push(...statements);
    });
    // 返回所有的语句
    return allStatements;
  }
  /**
   * 扩展语句
   *
   * @param statement 要扩展的语句
   * @returns 返回扩展后的语句数组
   */
  expandStatement(statement) {
    // 将传入的statement对象的_included属性设置为true
    statement._included = true;
    // 定义一个空数组result
    let result = [];
    // 将statement对象推入result数组中
    result.push(statement);
    // 返回result数组
    return result;
  }
}
module.exports = Module;
