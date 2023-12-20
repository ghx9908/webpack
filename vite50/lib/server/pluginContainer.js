const { normalizePath } = require("../utils")
const path = require("path")
async function createPluginContainer({ plugins, root }) {
  class PluginContext {
    async resolve(id, importer = path.join(root, "index.html")) {
      return await container.resolveId(id, importer)
    }
  }
  const container = {
     //里面有很多很多工具方法 emitFile写在插件容器里不合适
    async resolveId(id, importer) {
      // 创建一个插件上下文对象
      let ctx = new PluginContext()
      // 初始化 resolveId 变量为 id
      let resolveId = id
      // 遍历 plugins 数组中的每个插件
      for (const plugin of plugins) {
        // 如果插件没有 resolveId 方法，则跳过当前循环
        if (!plugin.resolveId) continue
        // 调用插件的 resolveId 方法，并传入 id 和 importer 参数
        const result = await plugin.resolveId.call(ctx, id, importer)
        // 如果 resolveId 方法返回结果不为空
        if (result) {
          // 更新 resolveId 变量为结果中的 id 或结果本身
          resolveId = result.id || result
          // 跳出循环
          break
        }
      }
      // 返回处理后的 resolveId 对象
      return { id: normalizePath(resolveId) }
    },

    async load(id) {
      const ctx = new PluginContext()
      for (const plugin of plugins) {
        if (!plugin.load) continue
        const result = await plugin.load.call(ctx, id)
        if (result !== null) {
          return result
        }
      }
      return null
    },
    async transform(code, id) {
      for (const plugin of plugins) {
        if (!plugin.transform) continue
        const ctx = new PluginContext()
        const result = await plugin.transform.call(ctx, code, id)
        if (!result) continue
        code = result.code || result
      }
      return { code }
    },
  }
  return container
}
exports.createPluginContainer = createPluginContainer
