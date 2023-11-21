const { SyncHook } = require("tapable")
/**
 * 所有的构造函数都接收一个可选参数，参数是一个参数名的字符串数组
 * 参数的名字可以任意填写，但是参数数组的长数必须要根实际接受的参数个数一致
 */
debugger
const hook = new SyncHook(["name", "age"])
hook.tap("1", (name, age) => {
  console.log(1, name, age)
  return 1
})
hook.tap("3", (name, age) => {
  console.log(2, name, age)
  return 2
})
hook.tap("2", (name, age) => {
  console.log(3, name, age)
  return 3
})

hook.call("ghx", 10)
//顺序执行所有

/* function anonymous(name, age) {
  var _x = this._x
  var _fn0 = _x[0]
  _fn0(name, age)
  var _fn1 = _x[1]
  _fn1(name, age)
  var _fn2 = _x[2]
  _fn2(name, age)
} */
