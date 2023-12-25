const { WebSocketServer } = require("ws");
const HMR_HEADER = "vite-hmr";
/**
 * 创建一个WebSocket服务器
 *
 * @param httpServer HTTP服务器实例
 * @returns 返回包含on、off和send方法的对象
 */
function createWebSocketServer(httpServer) {
  // 创建一个WebSocket服务器对象，参数为httpServer
  const wss = new WebSocketServer({ noServer: true });

  // 当httpServer进行升级时触发
  httpServer.on("upgrade", (req, socket, head) => {
    // 如果请求头中的"sec-websocket-protocol"字段等于HMR_HEADER
    if (req.headers["sec-websocket-protocol"] === HMR_HEADER) {
      // 处理WebSocket升级请求
      wss.handleUpgrade(req, socket, head, (ws) => {
        // 触发WebSocket服务器的连接事件，并传入WebSocket对象和请求对象
        wss.emit("connection", ws, req);
      });
    }
  });

  // 当WebSocket连接建立时触发
  wss.on("connection", (socket) => {
    // 向客户端发送连接成功的消息
    socket.send(JSON.stringify({ type: "connected" }));
  });

  // 返回WebSocket服务器对象
  return {
    // 绑定WebSocket服务器的on方法
    on: wss.on.bind(wss),//监听客户端发过来的请求
    // 绑定WebSocket服务器的off方法
    off: wss.off.bind(wss),//取消监听客户端发过来的请求
    // 发送消息的方法
    send(payload) {//调用此方法时，向所有WebSocket客户端发送消息
      // 将payload对象转换为字符串
      const stringified = JSON.stringify(payload);

      // 遍历所有WebSocket客户端
      wss.clients.forEach((client) => {
        // 如果客户端的连接状态为1（打开）
        if (client.readyState === 1) {
          // 向客户端发送消息
          client.send(stringified);
        }
      });
    },
  };
}
exports.createWebSocketServer = createWebSocketServer;
