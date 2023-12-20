const connect = require("connect");
// 异步函数，用于创建服务器
const serveStaticMiddleware = require('./middlewares/static');
const transformMiddleware = require('./middlewares/transform');
const resolveConfig = require('../config');
const { createPluginContainer } = require('./pluginContainer');
const { createOptimizeDepsRun } = require('../optimizer');
// 异步函数，用于创建服务器
async function createServer() {
  // 解析配置
  const config = await resolveConfig()
  // 创建中间件
  const middlewares = connect();
  const pluginContainer = await createPluginContainer(config)
  debugger
  // 创建服务器
  const server = {
    pluginContainer,
    // 监听端口
    async listen(port) {
      // 项目启动前 进行依赖的与构建
      // 1. 找到项目依赖的第三方模块
      await runOptimize(config, server)
      // 创建http服务器
      require("http")
        .createServer(middlewares)
        // 监听端口
        .listen(port, async () => {
          // 打印服务器地址
          console.log(`dev server running at: http://localhost:${port}`);
        });
    },
  };

  for (const plugin of config.plugins) {
    if (plugin.configureServer) {
      plugin.configureServer(server);
    }
  }
  // 转换中间件  将mian.js 转换成main.js中的vue=> /node_modules/.vite/deps/vue?v=xxx
  middlewares.use(transformMiddleware(server))
  // 使用静态中间件
  middlewares.use(serveStaticMiddleware(config))
  // 返回服务器
  return server;
}

// 异步函数，用于运行创建优化的依赖
async function runOptimize(config, server) {
  // 运行创建优化的依赖
  const optimizeDeps =  await createOptimizeDepsRun(config)
  // 保存优化依赖的元数据  此时吧预编译的模块保存在了metadata
  server._optimizeDepsMetadata = optimizeDeps.metadata
}

// 导出createServer函数

exports.createServer = createServer;
