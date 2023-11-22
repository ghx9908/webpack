require("esbuild").buildSync({
  entryPoints: ["main.js"],
  loader: { ".js": "jsx" },// .js 文件用jsx文件加载器
  outfile: "out.js",
});
