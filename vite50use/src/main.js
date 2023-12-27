import { render } from "./render.js";
render();
window.hotModulesMap = new Map();// 热更新文件模块映射对象
var ownerPath = "/src/main.js";//当前模块的路径
import.meta.hot = {
  // 依赖的模块和回调
  accept(deps, callback) {
    acceptDeps(deps, callback);
  },
};
/**
 * 接受依赖项和回调函数作为参数
 *
 * @param deps 依赖项
 * @param callback 回调函数
 */
function acceptDeps(deps, callback) {
  const mod = hotModulesMap.get(ownerPath) || {
    id: ownerPath,
    callbacks: [],
  };
  mod.callbacks.push({
    deps,
    fn: callback,
  });
  hotModulesMap.set(ownerPath, mod);
}
if (import.meta.hot) {
  import.meta.hot.accept(["./render.js"], ([renderMod]) => {
    renderMod.render();
  });
}
