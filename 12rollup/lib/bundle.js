let fs = require("fs")
let path = require("path")
let Module = require("./module")
let MagicString = require("magic-string")
class Bundle {
  constructor(options) {
    //入口文件数据
    this.entryPath = path.resolve(options.entry.replace(/\.js$/, "") + ".js")
    //存放所有的模块
    this.modules = {}
  }
  /**
   * 构建函数
   *
   * @param {string} filename - 要构建的文件名
   * @returns {void}
   */
  build(filename) {
    // 获取入口文件的模块实例 创建模块实例
    const entryModule = this.fetchModule(this.entryPath) //获取模块代码
    // 展开所有的语句
    this.statements = entryModule.expandAllStatements(true) //展开所有的语句
    // 生成打包后的代码
    const { code } = this.generate() //生成打包后的代码
    // 将打包后的代码写入文件系统
    fs.writeFileSync(filename, code) //写入文件系统
  }
  /**
   * 获取模块
   *
   * @param importee 被引入的模块 ./msg.js
   * @param importer 引入别的模块的模块 main.js
   * @returns 返回模块实例
   */
  fetchModule(importee, importer) {
    let route
    if (!importer) {
      // 如果没有importer，将importee作为路由
      route = importee
    } else {
      // 如果importee是绝对路径
      if (path.isAbsolute(importee)) {
        // 将importee作为路由
        route = importee
      } else {
        // 否则，解析importee相对于importer的路径
        route = path.resolve(path.dirname(importer), importee.replace(/\.js$/, "") + ".js")
      }
    }

    // 如果路由存在
    if (route) {
      // 同步读取文件内容
      let code = fs.readFileSync(route, "utf8")
      //创建一个模块的实例
      const module = new Module({
        code, //模块的源代码
        path: importee, //模块的路径
        bundle: this, //Bundle实例
      })
      // 返回模块
      return module
    }
  }
  /**
   * 生成代码
   *
   * @returns 返回包含代码的对象
   */
  generate() {
    // 创建一个 MagicString.Bundle 对象
    let magicString = new MagicString.Bundle()

    // 遍历语句数组
    this.statements.forEach((statement) => {
      // 克隆语句的源代码
      const source = statement._source.clone()
      if (statement.type === "ExportNamedDeclaration") {
        source.remove(statement.start, statement.declaration.start)
      }
      // 向 magicString 中添加源代码
      magicString.addSource({
        content: source,
        separator: "\n",
      })
    })

    // 返回包含代码的字符串
    return { code: magicString.toString() }
  }
}
module.exports = Bundle
