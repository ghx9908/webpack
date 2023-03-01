//babel核心模块
const core = require("@babel/core")
//用来生成或者判断节点的AST语法树的节点
let types = require("@babel/types")
let arrowFunctionPlugin = require("babel-plugin-transform-es2015-arrow-functions")

let arrowFunctionPlugin1 = {
  visitor: {
    //如果是箭头函数，那么就会进来此函数，参数是箭头函数的节点路径对象
    ArrowFunctionExpression(path) {
      let { node } = path
      let body = node.body
      //如果函数体不是语句块
      if (!types.isBlockStatement(body)) {
        node.body = types.blockStatement([types.returnStatement(body)])
      }
      node.type = "FunctionExpression"
    },
  },
}

let sourceCode = `
const sum = (a, b) => a + b;

`
let targetSource = core.transform(sourceCode, {
  plugins: [arrowFunctionPlugin1],
})
console.log(targetSource.code)
