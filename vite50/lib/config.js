const path = require("path")
const { normalizePath } = require("./utils")
const { resolvePlugins } = require("./plugins")
const fs = require("fs-extra")
async function resolveConfig() {
  const root = normalizePath(process.cwd())
  const cacheDir = normalizePath(path.resolve(`node_modules/.vite50`)) //缓存目录
  let config = {
    root,
    cacheDir,
  }
  //读取用户自己设置的插件
  const jsconfigFile = path.resolve(root, "vite.config.js")
  const exists = await fs.pathExists(jsconfigFile)

  if (exists) {
    const userConfig = require(jsconfigFile)
    //用用户自定义配置项覆盖默认配置
    config = { ...config, ...userConfig }
  }
  const userPlugins = config.plugins || []
  for (const plugin of userPlugins) {
    if (plugin.config) {
      const res = await plugin.config(config)
      if (res) {
        config = { ...config, ...res }
      }
    }
  }

  const plugins = await resolvePlugins(config, userPlugins)

  config.plugins = plugins
  return config
}
module.exports = resolveConfig
