// 此法状态  
const LexerState = {
  inCall: 0,//在方法调用中
  inQuoteString: 1,// 在字符串中 引号里面就是1
};

/**
 * 处理HMR更新
 *
 * @param file 更新的文件
 * @param server 服务器对象
 * @returns Promise<void>
 */
async function handleHMRUpdate(file, server) {
  const { moduleGraph, ws } = server;
  // 根据文件获取模块
  // 根据文件获取模块
  const module = moduleGraph.getModuleById(file);
  if (module) {
    const updates = [];
    const boundaries = new Set();// 边界模块 可能有多个  1个模块被多个模块引用
    // 广播更新
    propagateUpdate(module, boundaries);
    updates.push(
      ...[...boundaries].map(({ boundary, acceptedVia }) => ({
        // 更新类型
        type: `${boundary.type}-update`,
        // 更新路径
        path: boundary.url,// 谁要更新 main.js
        // 被接受的路径
        acceptedPath: acceptedVia.url, //通过谁更新的 render.js
      }))
    );
    ws.send({
      // 更新类型
      type: "update",
      // 更新列表
      updates,
    });
  }
}


function updateModules(file, modules, { ws }) {}
/**
 * 找到该模块的边界放到boundaries集合中
 *
 * @param node 要更新的节点
 * @param boundaries 边界集合
 * @returns 如果边界集合中有边界接受该节点的 HMR 依赖，则返回 true，否则返回 false
 */
function propagateUpdate(node, boundaries) {
  // 如果节点没有被别的模块导入，则直接返回true
  if (!node.importers.size) {
    return true;
  }
  // 遍历节导入该模块的模块
  for (const importer of node.importers) {
    // 导入模块接受的热更新里面是否有该模块  说明就是边界
    if (importer.acceptedHmrDeps.has(node)) {
      boundaries.add({
        boundary: importer,// 接受变更的模块
        acceptedVia: node,// 通过谁得到的变更 变更的模块
      });
      continue;
    }
  }
  // 如果没有找到接受节点的导入者，则返回false
  return false;
}


// 使用有限状态机器
/**
 * 从代码中提取引用的依赖
 *
 * @param code 源代码
 * @param start 开始位置
 * @param urls 依赖列表
 * @returns 如果成功提取到依赖则返回false，否则返回true
 */
// import.meta.hot.accept(['./renderModule.js','otherModule.js']
function lexAcceptedHmrDeps(code, start, urls) {
  // 当前状态
  let state = LexerState.inCall;
  // 上一个状态
  let prevState = LexerState.inCall;
  // 当前依赖项
  let currentDep = "";
  // 添加依赖项
  function addDep(index) {
    urls.add({
      url: currentDep,
      start: index - currentDep.length - 1,
      end: index + 1,
    });
    currentDep = "";
  }
  // 遍历代码
  for (let i = start; i < code.length; i++) {
    // 当前字符
    const char = code.charAt(i);
    // 根据当前状态进行逻辑处理
    switch (state) {
      case LexerState.inCall:
        // 如果当前字符是引号
        if (char === `'` || char === `"`) {
          // 记录上一个状态
          prevState = state;
          // 进入 inQuoteString 状态
          state = LexerState.inQuoteString;
        }
        break;
      case LexerState.inQuoteString:
        // 如果当前字符是引号
        if (char === `'` || char === `"`) {
          // 添加依赖项
          addDep(i);
          prevState = LexerState.inQuoteString;
          state = LexerState.inCall;
          // 返回 false
          return false;
        } else {
          // 将字符添加到当前依赖项中
          currentDep += char;
        }
        break;
      default:
        break;
    }
  }
  // 返回 false
  return false;
}
exports.handleHMRUpdate = handleHMRUpdate;
exports.updateModules = updateModules;
exports.lexAcceptedHmrDeps = lexAcceptedHmrDeps;
