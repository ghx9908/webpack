const fs = require("fs-extra")
const path = require("path")
const { createPluginContainer } = require("../server/pluginContainer")
const resolvePlugin = require("../plugins/resolve")
const { normalizePath } = require("../utils")
const htmlTypesRE = /\.html$/
const scriptModuleRE = /<script type="module" src\="(.+?)"><\/script>/
const JS_TYPES_RE = /\.js$/
// 异步函数，用于扫描插件
// 获取扫描插件的工程方法
async function esbuildScanPlugin(config, depImports) {
  // 将resolvePlugin添加到config.plugins中
  config.plugins = [resolvePlugin(config)]
  // 创建插件容器
  const container = await createPluginContainer(config)
  // 异步函数，用于解析id和importer
  const resolve = async (id, importer) => {
    // 由插件容器解析路径，返回解析后的路径
    return await container.resolveId(id, importer)
  }
  // 返回插件
  return {
    name: "vite:dep-scan", // 依赖扫描插件
    setup(build) {
      //如果遇到vue文件，则返回它的绝对路径，并且标识为外部依赖，不再进一步解析了
      build.onResolve(
        {
          filter: /\.vue$/,
        },
        async ({ path: id, importer }) => {
          const resolved = await resolve(id, importer)
          if (resolved) {
            return {
              path: resolved.id,
              external: true,
            }
          }
        }
      )
      // 当解析html文件时，调用resolve函数
      build.onResolve({ filter: htmlTypesRE }, async ({ path, importer }) => {
        // 把任务路径转换为绝对路径
        const resolved = await resolve(path, importer)
        if (resolved) {
          return {
            path: resolved.id || resolved, // 绝对路径
            namespace: "html", //重写命名空间为html
          }
        }
      })
      // 当解析其他文件时，调用resolve函数
      build.onResolve({ filter: /.*/ }, async ({ path, importer }) => {
        const resolved = await resolve(path, importer)
        if (resolved) {
          const id = resolved.id || resolved // 此模块绝对路径
          const included = id.includes("node_modules") // 判断是否是node_modules中的模块
          if (included) {
            // 将路径和id添加到depImports中
            depImports[path] = normalizePath(id) //第三方模块
            return {
              path: id,
              external: true, // 外部模块 不需要进一步处理了
            }
          }
          return {
            // 内部模块
            path: id,
          }
        }
        return { path }
      })
      // 当解析html文件时，返回js文件
      build.onLoad({ filter: htmlTypesRE, namespace: "html" }, async ({ path }) => {
        let html = fs.readFileSync(path, "utf-8") // 读取文件内容
        let [, scriptSrc] = html.match(scriptModuleRE) // 匹配script标签中的src属性
        let js = `import ${JSON.stringify(scriptSrc)};\n` // 拼接js代码  impirt './src/mian.js'
        return {
          // 返回js文件
          loader: "js",
          contents: js,
        }
      })
      // 当解析js文件时，返回js文件
      build.onLoad({ filter: JS_TYPES_RE }, ({ path: id }) => {
        let ext = path.extname(id).slice(1)
        let contents = fs.readFileSync(id, "utf-8")
        return {
          loader: ext,
          contents,
        }
      })
    },
  }
}
// 导出esbuildScanPlugin函数
module.exports = esbuildScanPlugin
