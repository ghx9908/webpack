console.log("[vite] connecting...")
var socket = new WebSocket(`ws://${window.location.host}`, "vite-hmr")
socket.addEventListener("message", async ({ data }) => {
    handleMessage(JSON.parse(data))
})
/**
 * 处理消息的异步函数
 *
 * @param payload 消息负载
 * @returns Promise<void>
 */
async function handleMessage(payload) {
  console.log('data=>',payload)
  switch (payload.type) {
    case "connected":
      // 当连接成功时，打印日志信息
      console.log(`[vite] connected.`)
      break
    case "update":
      // 更新逻辑
      payload.updates.forEach((update) => {
        if (update.type === "js-update") {
          // 如果是JS更新，执行fetchUpdate函数
          
          fetchUpdate(update)
        }
      })
      break
    case "full-reload":
      // 重新加载页面
      location.reload()
    default:
      break
  }
}

/**
 * 异步函数，用于更新模块
 *
 * @param {Object} param0 包含path和acceptedPath两个属性的对象
 * @param {string} param0.path 边界模块路径
 * @param {string} param0.acceptedPath 变更的模块路径
 * @returns {Promise<void>}
 */
async function fetchUpdate({ path, acceptedPath }) {
  console.log('window.hotModulesMap=>',window.hotModulesMap)
  const mod = window.hotModulesMap.get(path)
  if (!mod) {
    return
  }

  // 创建一个Map对象，用于存储更新后的模块  模块路径和新的模块内容
  const moduleMap = new Map()

  // 创建一个Set对象，用于存储需要更新的模块  将要更新的模块集合
  const modulesToUpdate = new Set()

  // 遍历mod对象的callbacks数组
  for (const { deps } of mod.callbacks) {
    // 遍历deps数组中的每个依赖
    deps.forEach((dep) => {
      // 如果acceptedPath与dep相等，则将dep添加到modulesToUpdate中
      if (acceptedPath === dep) {
        modulesToUpdate.add(dep)
      }
    })
  }

  // 并发加载需要更新的模块
  await Promise.all(
    Array.from(modulesToUpdate).map(async (dep) => {
      // 异步加载新的模块
      const newMod = await import(dep + "?ts=" + Date.now())
      // 将新的模块存储到moduleMap中
      moduleMap.set(dep, newMod)
    })
  )

  // 遍历mod对象的callbacks数组
  for (const { deps, fn } of mod.callbacks) {
    // 执行回调函数，并传入更新后的模块内容
    fn(deps.map((dep) => moduleMap.get(dep)))
  }

  // 记录更新路径
  const loggedPath = `${acceptedPath} via ${path}`

  // 打印更新日志
  console.log(`[vite] hot updated: ${loggedPath}`)
}
