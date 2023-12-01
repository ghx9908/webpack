const path = require('path');
const { normalizePath } = require("./utils");
async function resolveConfig() {
  const root = normalizePath(process.cwd());
  const cacheDir = normalizePath(path.resolve(`node_modules/.vite50`))//缓存目录
  let config = {
    root,
    cacheDir
  };
  return config;
}
module.exports = resolveConfig;
