var MagicString = require('magic-string')
let sourceCode = `export var name  = 'ghx`
let ms = new MagicString(sourceCode)
console.log('ms=>',ms)


//裁剪出原始字符串开始和结束之间所有的内容
//返回一个克隆后的MagicString的实例
console.log(ms.snip(0,6).toString());
//删除0, 7之间的内容
console.log(ms.remove(0,7).toString());
//还可以用用来合并代码 
const bundle = new MagicString.Bundle()
bundle.addSource({
  content:'var age  =20',
  separotor:'\n'
})

bundle.addSource({
  content:'var name  ="ls"',
  separotor:'\n'
})

console.log('bundle=>',bundle.toString())
