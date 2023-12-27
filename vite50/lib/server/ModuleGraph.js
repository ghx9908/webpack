/**
 * 模块节点 一个模块
 */
class ModuleNode {
  //哪些模块导入了自己
  importers = new Set();//被谁导入
  //接收哪些子模块的修改
  acceptedHmrDeps = new Set(); //导入了谁
  constructor(url) {
    this.url = url;
    this.type = "js";
  }
}
/**
 * 提供了模块ID到模块节点的映射
 */
class ModuleGraph {
  constructor(resolveId) {
    this.resolveId = resolveId;
  }
  //模块ID到模块节点的映射
  idToModuleMap = new Map();
  //通过ID查找模块
  getModuleById(id) {
    return this.idToModuleMap.get(id);
  }
  //把原始的URL添加到Map
  async ensureEntryFromUrl(rawUrl) {
    //获得他的绝对路径
    const [url, resolvedId] = await this.resolveUrl(rawUrl);
    let mod = this.idToModuleMap.get(resolvedId); //通过文件URL查找模块
    if (!mod) {
      this.idToModuleMap.set(resolvedId, new ModuleNode(url)); //把绝对路径和模块的对应关系保存在idToModuleMap中
    }
    return mod;
  }
  async resolveUrl(url) {
    const resolved = await this.resolveId(url);
    const resolvedId = resolved.id || url;
    return [url, resolvedId];
  }
  /**
   * 更新模块信息
   *
   * @param {Object} mod - 模块对象
   * @param {string[]} importedModules - 导入的依赖模块列表
   * @param {string[]} acceptedModules - 接受的热更新模块列表
   * @returns {Promise<void>} 异步操作完成的 Promise 对象
   */
  async updateModuleInfo(mod, importedModules, acceptedModules) {
    for (const imported of importedModules) {
      const dep = await this.ensureEntryFromUrl(imported);
      // 依赖的模块的导入方就是自己
      dep.importers.add(mod); //render.js   importerts main.js
    }
    // 维护接受个热更新依赖
    const deps = (mod.acceptedHmrDeps = new Set()); //main.js acceptedHmrDeps render.js
    for (const accepted of acceptedModules) {
      const dep = await this.ensureEntryFromUrl(accepted);
      deps.add(dep);
    }
  }
}
exports.ModuleGraph = ModuleGraph;
