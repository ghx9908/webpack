const connect = require("connect")
// 异步函数，用于创建服务器
const serveStaticMiddleware = require("./middlewares/static")
const transformMiddleware = require("./middlewares/transform")
const resolveConfig = require("../config")
const { createPluginContainer } = require("./pluginContainer")
const { createOptimizeDepsRun } = require("../optimizer")
const { createWebSocketServer } = require("./ws.js")
const { normalizePath } = require('../utils');
const path = require('path');
const { handleHMRUpdate } = require('./hmr');
const chokidar = require("chokidar") //监听文件变更
const { ModuleGraph } = require('./moduleGraph')//模块依赖图
// 异步函数，用于创建服务器
async function createServer() {
  // 解析配置
  const config = await resolveConfig()
  // 创建中间件
  const middlewares = connect()
  const httpServer = require("http").createServer(middlewares)
  const ws = createWebSocketServer(httpServer, config)

  const watcher = chokidar.watch(path.resolve(config.root), {
    ignored: ["**/node_modules/**", "**/.git/**"],
  })

  const moduleGraph = new ModuleGraph((url) =>
   pluginContainer.resolveId(url)
)
  const pluginContainer = await createPluginContainer(config)
  // 创建服务器
  const server = {
    pluginContainer,
    ws,
    watcher,
    moduleGraph,
    // 监听端口
    async listen(port) {
      // 项目启动前 进行依赖的与构建
      // 1. 找到项目依赖的第三方模块
      await runOptimize(config, server)
      // 创建http服务器

      // 监听端口
      httpServer.listen(port, async () => {
        // 打印服务器地址
        console.log(`dev server running at: http://localhost:${port}`)
      })
    },
  }
  // 监听文件变化
  watcher.on("change", async (file) => {
    file = normalizePath(file)
    await handleHMRUpdate(file, server)
  })

  for (const plugin of config.plugins) {
    if (plugin.configureServer) {
      plugin.configureServer(server)
    }
  }
  // 转换中间件  将mian.js 转换成main.js中的vue=> /node_modules/.vite/deps/vue?v=xxx
  middlewares.use(transformMiddleware(server))
  // 使用静态中间件
  middlewares.use(serveStaticMiddleware(config))
  // 返回服务器
  return server
}

// 异步函数，用于运行创建优化的依赖
async function runOptimize(config, server) {
  // 运行创建优化的依赖
  const optimizeDeps = await createOptimizeDepsRun(config)
  // 保存优化依赖的元数据  此时吧预编译的模块保存在了metadata
  server._optimizeDepsMetadata = optimizeDeps.metadata
}

// 导出createServer函数

exports.createServer = createServer
