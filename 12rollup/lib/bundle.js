let fs = require("fs")
let path = require("path")
let Module = require("./module")
let MagicString = require("magic-string")

const { hasOwnProperty, replaceIdentifiers } = require("./utils")
class Bundle {
  constructor(options) {
    //入口文件数据
    this.entryPath = path.resolve(options.entry.replace(/\.js$/, "") + ".js")
    //存放所有的模块
    this.modules = new Map()
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
    this.deconflict() //解决变量名冲突

    // 生成打包后的代码
    const { code } = this.generate() //生成打包后的代码
    // 将打包后的代码写入文件系统
    fs.writeFileSync(filename, code) //写入文件系统
  }

  /**
   * 解决变量名冲突
   */
  deconflict() {
    debugger
    const defines = {} //所有变量对应的module  {age:[module1,module2],name:[module1]}
    const conflicts = {} //变量名冲突的变量 {age:true,name:true}
    this.statements.forEach((statement) => {
      Object.keys(statement._defines).forEach((name) => {//所有语句里定义的变量
        if (hasOwnProperty(defines, name)) {
          conflicts[name] = true// 冲突的变量名
        } else {
          defines[name] = [] //defines.age = [];
        }
        //把此声明变量的语句，对应的模块添加到数组里
        defines[name].push(statement._module)
      })
    })
    Object.keys(conflicts).forEach((name) => {
      const modules = defines[name] //获取定义此变量名的模块的数组
      modules.pop() //最后一个模块不需要重命名,保留 原来的名称即可 [age1,age2]
      modules.forEach((module, index) => {
        let replacement = `${name}$${modules.length - index}`
        module.rename(name, replacement) //module age=>age$2
      })
    })
  }

  /**
   * 获取模块 创建模块实例
   *
   * @param importee 被引入的模块 ./msg.js
   * @param importer 引入别的模块的模块 main.js
   * @returns 返回模块实例
   */
  fetchModule(importee, importer) {
    let route
    if (!importer) {
      // 如果没有importer，说明是入口文件
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

      if (this.modules.has(route)) {
        return this.modules.get(route)
      } else {
        let code = fs.readFileSync(route, "utf8")
        //创建一个模块的实例
        const module = new Module({
          code, //模块的源代码
          path: importee, //模块的路径
          bundle: this, //Bundle实例
        })
        this.modules.set(route, module) //将模块添加到Bundle的modules集合中
        // 返回模块
        return module
      }
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
      let replacements = {}
      Object.keys(statement._dependsOn)//获取语句的依赖的变量和定义的变量
        .concat(Object.keys(statement._defines))
        .forEach((name) => {
          const canonicalName = statement._module.getCanonicalName(name)//获取新的变量名
          if (name !== canonicalName) replacements[name] = canonicalName
        })

      // 克隆语句的源代码
      const source = statement._source.clone()
      if (statement.type === "ExportNamedDeclaration") {
        source.remove(statement.start, statement.declaration.start)
      }
      // 替换语句的源代码中的变量名
      replaceIdentifiers(statement, source, replacements);
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
