const acorn = require('acorn');


const sourceCode = 'import $ from "jquery"'

const ast = acorn.parse(sourceCode, {
  ecmaVersion: 8,//版本
  locations: true,//是否生成位置信息
  ranges: true,//是否生成范围信息
  sourceType: 'module',//模块还是脚本
 });

 //遍历语法树
ast.body.forEach((statement) => {
  walk(statement, {
    enter(node) {
      console.log('进入' + node.type);
    },
    leave(node) {
      console.log('离开' + node.type);
    }
  });
});


/**
 * 遍历 AST 节点
 *
 * @param astNode - 要遍历的 AST 节点
 * @param options - 遍历选项
 * @param options.enter - 进入节点回调函数
 * @param options.leave - 离开节点回调函数
 */
function walk(astNode, { enter, leave }) {
  // 调用visit函数，传入astNode节点、null、enter函数和leave函数作为参数
  visit(astNode, null, enter, leave);
}


/**
 * 访问节点
 *
 * @param node 节点
 * @param parent 父节点
 * @param enter 进入节点回调函数
 * @param leave 离开节点回调函数
 */
function visit(node, parent, enter, leave) {
  // 进入节点回调函数
  if (enter) {
    enter(node, parent);
  }
  // 过滤出对象类型的属性
  const keys = Object.keys(node).filter(key => typeof node[key] === 'object')
  debugger
  // 遍历对象的属性
  keys.forEach(key => {
    let value = node[key];
    // 如果是数组
    if (Array.isArray(value)) {
      // 遍历数组中的元素
      value.forEach(val => {
        // 如果元素具有type属性，则递归访问
        if (val.type) {
          visit(val, node, enter, leave)
        }
      });
    } else if (value && value.type) {
      // 如果元素具有type属性，则递归访问
      visit(value, node, enter, leave);
    }
  });
  // 离开节点回调函数
  if (leave) {
    leave(node, parent);
  }
}

// 进入ImportDeclaration
// 进入ImportDefaultSpecifier
// 进入Identifier
// 离开Identifier
// 离开ImportDefaultSpecifier
// 进入Literal
// 离开Literal
// 离开ImportDeclaration
