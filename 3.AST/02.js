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
      hoistFunctionEnvironment(path)
      let body = node.body
      //如果函数体不是语句块
      if (!types.isBlockStatement(body)) {
        node.body = types.blockStatement([types.returnStatement(body)])
      }
      node.type = "FunctionExpression"
    },
  },
}

/**
 * 1.要在函数的外面声明一个_this变量，值是this
 * 2.在函数的内容，换this 变成_this
 * @param {*} path
 */
function hoistFunctionEnvironment(path) {
  //1.看看当前节点里有没有使用到this
  const thisPaths = getThisPaths(path)
  if (thisPaths.length > 0) {
    //可以用来生成_this变量的路径
    const thisEnv = path.findParent((parent) => {
      //如果是函数，但是不是箭头函数的话就返回true
      //return types.isFunctionDeclaration(parent)|| parent.isProgram();;
      return (
        (parent.isFunction() && !parent.isArrowFunctionExpress()) ||
        parent.isProgram()
      )
    })
    let thisBindings = "_this"
    //如果此路径对应的作用域中没_this这个变量
    if (!thisEnv.scope.hasBinding(thisBindings)) {
      //向它对应的作用域里添加一个变量 ，变量名_this,变量的值this
      const thisIdentifier = types.identifier(thisBindings)
      thisEnv.scope.push({
        id: thisIdentifier,
        init: types.thisExpression(),
      })
      thisPaths.forEach((thisPath) => {
        thisPath.replaceWith(thisIdentifier)
      })
    }
  }
}

function getThisPaths(path) {
  let thisPaths = []
  //遍历此路径所有的子路径
  path.traverse({
    ThisExpression(thisPath) {
      thisPaths.push(thisPath)
    },
  })
  return thisPaths
}
let sourceCode = `
const sum = (a, b) => {
  console.log(this)
  return a+b
};

`
let targetSource = core.transform(sourceCode, {
  plugins: [arrowFunctionPlugin1],
})
console.log(targetSource.code)
