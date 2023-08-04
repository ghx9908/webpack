// const { SyncHook } = require("./tapable")
const SyncHook = require("./SyncHook")
const hook = new SyncHook(["name", "age"])
hook.tap({ name: "1" }, (name, age) => {
  console.log(1, name, age)
})
hook.tap("2", (name, age) => {
  console.log(2, name, age)
})
hook.tap("3", (name, age) => {
  console.log(3, name, age)
})
hook.call("ghx", 18)

/* // 最后call调用的方法
function anonymous(name, age) {
  var _x = this._x
  var _fn0 = _x[0]
  _fn0(name, age)
  var _fn1 = _x[1]
  _fn1(name, age)
  var _fn2 = _x[2]
  _fn2(name, age)
}
 */
