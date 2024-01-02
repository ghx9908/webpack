const walk = require("./ast/walk")

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}
exports.hasOwnProperty = hasOwnProperty

/**
 * 替换语句中的标识符
 *
 * @param statement 语句
 * @param source 源代码
 * @param replacements 替换规则
 */
function replaceIdentifiers(statement, source, replacements) {
  // 遍历语法树
  walk(statement, {
    enter(node) {
      // 如果节点类型为 Identifier
      if (node.type === "Identifier") {
        // 如果节点名称存在且替换规则中存在
        if (node.name && replacements[node.name]) {
          // 使用源代码覆盖节点起始位置到结束位置的代码，替换为替换规则中的内容
          source.overwrite(node.start, node.end, replacements[node.name])
        }
      }
    },
  })
}
exports.replaceIdentifiers = replaceIdentifiers
