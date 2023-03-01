const core = require("@babel/core")
const types = require("@babel/types")
const path = require("path")
const uglifyPlugin = require("./uglifyPlugin")
const sourceCode = `
var agedddddddddddddddddddddddddddddddddddddd = 12;
console.log(agedddddddddddddddddddddddddddddddddddddd);
var namedddddddddddddddddddddddddddddddd = '';
console.log(namedddddddddddddddddddddddddddddddd);
var a = 1;
console.log(a)
`
const { code } = core.transformSync(sourceCode, {
  plugins: [uglifyPlugin()],
})
console.log(code)
