// 将id中的反斜杠替换为正斜杠
function normalizePath(id) {
  return id.replace(/\\/g, "/"); //将所有的左斜杠替换为正斜杠
}

exports.normalizePath = normalizePath;
const knownJsSrcRE = /\.(js|vue)/
const isJSRequest = (url) => {
  if (knownJsSrcRE.test(url)) {
    return true
  }
  return false
}
exports.isJSRequest = isJSRequest;

