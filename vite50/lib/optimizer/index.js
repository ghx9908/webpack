const { build } = require("esbuild")
const fs = require("fs-extra")
const path = require("path")
const { normalizePath } = require("../utils")
// 引入scan模块
const scanImports = require("./scan")
// 异步函数，用于创建优化依赖运行
// 分析项目依赖的第三方模块
async function createOptimizeDepsRun(config) {
  // 扫描导入
  // { vue: '/Users/dxm/Desktop/self/webpack核心/webpack/vite50use/node_modules/vue/dist/vue.runtime.esm-bundler.js'}
  const deps = await scanImports(config)
  // 创建缓存目录
  const { cacheDir } = config //cacheDir =node_modules\.vite50
  const depsCacheDir = path.resolve(cacheDir, "deps") //depsCacheDir =node_modules\.vite50\deps
  const metadataPath = path.join(depsCacheDir, "_metadata.json")
  const metadata = {
    optimized: {},
  }

  for (const id in deps) {
    const entry = deps[id]
    //内存里存的绝对路径，写入硬盘是相对路径
    metadata.optimized[id] = {
      file: normalizePath(path.resolve(depsCacheDir, id + ".js")), //C:\vite50use\node_modules\.vite\deps\vue.js
      src: entry, //C:/vite50use/node_modules/vue/dist/vue.runtime.esm-bundler.js
    }
    await build({
      absWorkingDir: process.cwd(), // 当前工作目录
      entryPoints: [deps[id]], // 入口文件
      outfile: path.resolve(depsCacheDir, id + ".js"), // 输出文件
      bundle: true,
      write: true,
      format: "esm",
    })
  }
  await fs.ensureDir(depsCacheDir)
  await fs.writeFile(
    metadataPath,
    JSON.stringify(
      metadata,
      (key, value) => {
        if (key === "file" || key === "src") {
          //optimized里存的是绝对路径，此处写入硬盘的是相对于缓存目录的相对路径
          return normalizePath(path.relative(depsCacheDir, value))
        }
        return value
      },
      2
    )
  )
  return { metadata }
}
// 导出函数
exports.createOptimizeDepsRun = createOptimizeDepsRun
