const { SyncWaterfallHook } = require("tapable")
// 上一个返回值传递给下一个函数
debugger
const hook = new SyncWaterfallHook(["name", "age"])
hook.tap("1", (name, age) => {
  console.log(1, name, age)
  return 1
})
hook.tap("2", (name, age) => {
  console.log(2, name, age)
  return
})
hook.tap("3", (name, age) => {
  console.log(3, name, age)
  return 3
})

hook.call("ghx", 10)

/* function anonymous(name, age) {
  var _context
  var _x = this._x
  var _fn0 = _x[0]
  var _result0 = _fn0(name, age)
  if (_result0 !== undefined) {
    name = _result0
  }
  var _fn1 = _x[1]
  var _result1 = _fn1(name, age)
  if (_result1 !== undefined) {
    name = _result1
  }
  var _fn2 = _x[2]
  var _result2 = _fn2(name, age)
  if (_result2 !== undefined) {
    name = _result2
  }
  return name
}
 */
