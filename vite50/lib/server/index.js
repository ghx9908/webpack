const connect = require("connect");
// 异步函数，用于创建服务器
const serveStaticMiddleware = require('./middlewares/static');
const resolveConfig = require('../config');

const { createOptimizeDepsRun } = require('../optimizer');
// 异步函数，用于创建服务器
async function createServer() {
  // 解析配置
  const config = await resolveConfig()
  // 创建中间件
  const middlewares = connect();
  // 创建服务器
  const server = {
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
  // 使用静态中间件
  middlewares.use(serveStaticMiddleware(config))
  // 返回服务器
  return server;
}

// 异步函数，用于运行创建优化的依赖
async function runOptimize(config, server) {
  // 运行创建优化的依赖
  const optimizeDeps =  await createOptimizeDepsRun(config)
  // 保存优化依赖的元数据
  server._optimizeDepsMetadata = optimizeDeps.metadata
}

// 导出createServer函数

exports.createServer = createServer;
