let envPlugin = {
  name: "env", // 插件名字
  // setup函数在每次BUILD API调用时都会运行一次
  setup(build) {
    //拦截名为env的导入路径，以便esbuild不会尝试将它们映射到文件系统位置
    //用env-ns名称空间标记它们，以便为该插件保留它们
    build.onResolve({ filter: /^env$/, namespace: "file" }, (args) => {
      return {
        external: false, // 是否是外部模块 是的话就不处理的
        path: args.path,
        namespace: "env-ns", //重写命名空间
      }
    })
    //加载带有env-ns名称空间标记的路径，它们的行为就像指向包含环境变量的JSON文件一样
    build.onLoad({ filter: /.*/, namespace: "env-ns" }, () => {
      return {
        contents: JSON.stringify(process.env),
        loader: "json",
      }
    })
  },
}

require("esbuild")
  .build({
    entryPoints: ["entry.js"],
    loader: { ".js": "jsx" }, // .js 文件用jsx文件加载器
    bundle: true,
    plugins: [envPlugin],

    outfile: "out.js",
  })
  .catch(() => process.exit(1))

/**
{
  path: 'env',//引入的模块的名字
  namespace: 'file',//命名空间的名字
  //从哪里引入的,或者说是哪个模块引入的这个env
  importer: 'C:\\aproject\\webpack202208\\14.vite\\entry.js',
  resolveDir: 'C:\\aproject\\webpack202208\\14.vite',//根目录
  kind: 'import-statement',//导入语句
} 
*/
