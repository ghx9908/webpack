const MagicString = require("magic-string")
const { hasOwnProperty } = require("./utils")
const { parse } = require("acorn")
let analyse = require("./ast/analyse")
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
    this.code = new MagicString(code, { filename: path })
    this.path = path
    this.bundle = bundle
    this.ast = parse(code, {
      ecmaVersion: 8,
      sourceType: "module",
    })
    //存放本模块的导入信息
    // {
    //   localName:{
    //     source: './msg', //./msg 导入的路径 相对的
    //     importName: 'name'//导入的变量名
    //   }
    // }
    this.imports = {}
    //本模块的导出信息
    //  { name = {localName:'name'}}
    this.exports = {}
    //存放本模块的定义变量的语句 a=>var a = 1; b =var b =2;
    this.definitions = {}
    // 给每个语句添加_module和_source属性

    //存放变量修改语句 当前定义顶级变量的语句
    this.modifications = {}
    analyse(this.ast, this.code, this)
  } 
  /**
   * 展开所有语句
   *
   * @returns 返回所有语句的数组
   */
  expandAllStatements() {
    // 定义一个空数组，用于存储所有的语句
    let allStatements = []
    // 遍历抽象语法树（AST）的语句
    this.ast.body.forEach((statement) => {
      //导入的语句默认全部过滤掉
      if (statement.type === "ImportDeclaration") return
      // 扩展单个语句
      let statements = this.expandStatement(statement)
      // 将扩展后的语句添加到所有的语句中
      allStatements.push(...statements)
    })
    // 返回所有的语句
    return allStatements
  }
  /**
   * 展开单个语句
   * 
   * @param statement 要展开的语句
   * @returns 返回扩展后的语句数组
   */
  expandStatement(statement) {
    // 将传入的statement对象的_included属性设置为true
    statement._included = true // 标识该语句已经添加到了结果里面了
    // 定义一个空数组result
    let result = []
    // 找到此语句使用的变量,把该变量定义的语句也取出来放到result数组中
    //获取此语句依赖的变量
    let _dependsOn = Object.keys(statement._dependsOn)

    _dependsOn.forEach((name) => {
      //找到此变量定义的语句，添加到输出数组里
      let definitions = this.define(name)
      result.push(...definitions)
    })

    // 将statement对象推入result数组中
    result.push(statement)
    //找到此语句定义的变量,把定义的变量和修改语句也包括进来
    //注意要先定义再修改，所以要把这行放在push(statement)的下面
    const defines = Object.keys(statement._defines)
    defines.forEach((name) => {
      const modifications = hasOwnProperty(this.modifications, name) && this.modifications[name]
      if (modifications) {
        //把修改语句也展开放到结果里
        modifications.forEach((statement) => {
          if (!statement._included) {
            let statements = this.expandStatement(statement)
            result.push(...statements)
          }
        })
      }
    })
    // 返回result数组
    return result
  }
  /**
   * 查找变量定义语句
   * @param {*} name 变量名
   * @returns 返回变量定义语句
   */
  define(name) {
    //先判断此变量是外部导入的还是模块内声明的
    if (hasOwnProperty(this.imports, name)) {
      //说明此变量不是模块内声明的，而是外部导入的,获取从哪个模块内导入了哪个变量
      const { source, importName } = this.imports[name]
      //获取这个模块 source为相对于当前模块的路径 path为当前模块的路径
      const importModule = this.bundle.fetchModule(source, this.path)
      //从这个模块的导出变量量获得本地变量的名称
      const { localName } = importModule.exports[importName]
      //获取本地变量的定义语句
      return importModule.define(localName) //name
    } else {
      //如果是模块的变量的话
      let statement = this.definitions[name] //name
      if (statement && !statement._included) {
        //如果本地变量的话还需要继续展开
        return this.expandStatement(statement)
      } else {
        return []
      }
    }
  }
}
module.exports = Module
