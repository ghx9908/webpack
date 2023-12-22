const {
  parse,
  compileScript, // 编译脚本
  rewriteDefault,
  compileTemplate, // 编译模版
  compileStyleAsync,
} = require("vue/compiler-sfc")
const path = require('path');
const fs = require("fs")
const hash = require('hash-sum');
const descriptorCache = new Map()
function vue() {
  return {
    name: "vue",
    config(config) {
      root = config.root
      return {
        define: {
          __VUE_OPTIONS_API__: true,
          __VUE_PROD_DEVTOOLS__: true,
        },
      }
    },
    async load(id) {
      const { filename, query } = parseVueRequest(id)
      if (query.has("vue")) {
        const descriptor = await getDescriptor(filename, root)
        if (query.get("type") === "style") {
          let block = descriptor.styles[Number(query.get("index"))]
          if (block) {
            return { code: block.content }
          }
        }
      }
    },
    async transform(code, id) {
      const { filename, query } = parseVueRequest(id)
      if (filename.endsWith(".vue")) {
        if (query.get("type") === "style") {
          const descriptor = await getDescriptor(filename, root)
          let result = await transformStyle(code, descriptor, query.get("index"))
          return result
        } else {
          let result = await transformMain(code, filename, root)
          return result
        }
      }
      return null
    },
  }
}

async function transformStyle(code, descriptor, index) {
    const block = descriptor.styles[index];
    //如果是CSS，其实翻译之后和翻译之前内容是一样的
    const result = await compileStyleAsync({
      filename: descriptor.filename,
      source: code,
      id: `data-v-${descriptor.id}`,//必须传递，不然报错 为了实现局部作用域，id不能重复
      scoped: block.scoped
    });
    let styleCode = result.code;
    const injectCode =
      `\nvar  style = document.createElement('style');` +
      `\nstyle.innerHTML = ${JSON.stringify(styleCode)};` +
      `\ndocument.head.appendChild(style);`
    return {
      code: injectCode
    };
  }
  

async function getDescriptor(filename) {
  let descriptor = descriptorCache.get(filename)
  if (descriptor) return descriptor
  const content = await fs.promises.readFile(filename, "utf8")
  const result = parse(content, { filename })
  descriptor = result.descriptor
  descriptor.id = hash(path.relative(root, filename));
  descriptorCache.set(filename, descriptor)
  return descriptor
}
async function transformMain(source, filename) {
  const descriptor = await getDescriptor(filename)
  const stylesCode = genStyleCode(descriptor, filename)
  console.log("stylesCode=>", stylesCode)
  const scriptCode = genScriptCode(descriptor, filename)
  const templateCode = genTemplateCode(descriptor, filename)
  let resolvedCode = [
    stylesCode,
    templateCode,
    scriptCode,
    `_sfc_main['render'] = render`,
    `export default _sfc_main`,
  ].join("\n")
  return { code: resolvedCode }
}

function genStyleCode(descriptor, filename) {
  let styleCode = ""
  if (descriptor.styles.length) {
    descriptor.styles.forEach((style, index) => {
      const query = `?vue&type=style&index=${index}&lang=css`
      const styleRequest = (filename + query).replace(/\\/g, "/")
      styleCode += `\nimport ${JSON.stringify(styleRequest)}`
    })
    return styleCode
  }
}

function genScriptCode(descriptor, id) {
  let scriptCode = ""
  let script = compileScript(descriptor, { id })
  if (!script.lang) {
    scriptCode = rewriteDefault(script.content, "_sfc_main")
  }
  return scriptCode
}
function genTemplateCode(descriptor, id) {
  let content = descriptor.template.content
  const result = compileTemplate({ source: content, id })
  return result.code
}
function parseVueRequest(id) {
  const [filename, querystring = ""] = id.split("?")
  let query = new URLSearchParams(querystring)
  return {
    filename,
    query,
  }
}
module.exports = vue
