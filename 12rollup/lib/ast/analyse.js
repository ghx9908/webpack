const Scope = require("./scope")
const walk = require("./walk.js")
const { hasOwnProperty } = require("../utils")
//第1个循环 找出导入导出的变量
// 第2个循环 找出定义和依赖的变量

function analyse(ast, code, module) {
  //第1个循环，找出导入导出的变量
  ast.body.forEach((statement) => {
    Object.defineProperties(statement, {
      _included: { value: false, writable: true },//表示这条语句默认不包括在输出结果里
      _module: { value: module }, //所属模块
      _source: { value: code.snip(statement.start, statement.end) }, //源码
      _defines: { value: {} }, //本顶级语句定义的变量
      _dependsOn: { value: {} }, //依赖的变量 { name: true}
    })
    //import { name as name1, age } from './msg';
    if (statement.type === "ImportDeclaration") { // 语句中有import
      let source = statement.source.value // ./msg 导入模块的相对路劲
      statement.specifiers.forEach((specifier) => {
        let importName = specifier.imported.name //导入的变量名
        let localName = specifier.local.name //本地的变量名
        //imports.name1 = {source:'./msg',importName:'name'};
        module.imports[localName] = { source, importName }
      })
    } else if (statement.type === "ExportNamedDeclaration") {
      // export var name = 12;
      const declaration = statement.declaration
      if (declaration && declaration.type === "VariableDeclaration") {
        const declarations = declaration.declarations
        declarations.forEach((variableDeclarator) => {
          const localName = variableDeclarator.id.name //name
          const exportName = localName
          //exports.name = {localName:'name'};
          module.exports[exportName] = { localName }
        })
      }
      // export {k as kk}
      const specifiers = statement.specifiers
      if (specifiers && specifiers.length > 0) {
        specifiers.forEach((specifier) => {
          const localName = specifier.local.name //name
          const exportName = specifier.exported.name 
          // exports.kk = {localName:'k'};
          module.exports[exportName] = { localName }
        })
      }
    }
  })
  //第2次循环创建作用域链
  let currentScope = new Scope({ name: "当前模块全局作用域" })
  //创建作用域链,为了知道我在此模块中声明哪些变量，这些变量的声明节点是哪个 var name = 1;
  ast.body.forEach((statement) => {
    function addToScope(name) {
      currentScope.add(name) //把name变量放入当前的作用域的变量数组中
      //如果当前作用于没有父亲，就相当于顶级作用域
      if (!currentScope.parent) {
        //如果没有父作用域，说明这是一个顶级作用域
        // 表示此语句定义了一个顶级变量
        statement._defines[name] = true //在一级节点定义一个变量name _defines.say=true
        //表示此顶级变量的定义就是这个语句
        module.definitions[name] = statement
      }
    }
    walk(statement, {
      enter(node) {
        //收集本节点上使用的变量
        if (node.type === "Identifier") {
          statement._dependsOn[node.name] = true
        }
        // 创建作用域链
        let newScope
        switch (node.type) {
          // 函数声明
          case "FunctionDeclaration":
            addToScope(node.id.name) // 把函数名放入当前作用域
            const names = node.params.map((param) => param.name)
            newScope = new Scope({ name: node.id.name, parent: currentScope, names })
            break
          case "VariableDeclaration":
            node.declarations.forEach((declaration) => {
              addToScope(declaration.id.name) //var
            })
            break
          default:
            break
        }
        if (newScope) {
          Object.defineProperty(node, "_scope", { value: newScope })
          currentScope = newScope
        }
      },
      leave(node) {
        // 如果当前节点有_scope，说明当前节点是一个函数，离开的时候需要退出当前作用域
        if (hasOwnProperty(node, "_scope")) {
          currentScope = currentScope.parent
        }
      },
    })
  })
}
module.exports = analyse
