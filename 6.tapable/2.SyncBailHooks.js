const { SyncBailHook } = require("tapable")
//同步遇到返回值非undefined的时候停止
debugger
const hook = new SyncBailHook(["name", "age"])
hook.tap("1", (name, age) => {
  console.log(1, name, age)
})
hook.tap("2", (name, age) => {
  console.log(2, name, age)
  return 2
})
hook.tap("3", (name, age) => {
  console.log(3, name, age)
  return 3
})

hook.call("ghx", 10)

/* function anonymous(name, age) {
  var _x = this._x
  var _fn0 = _x[0]
  var _result0 = _fn0(name, age)
  if (_result0 !== undefined) {
    return _result0
  } else {
    var _fn1 = _x[1]
    var _result1 = _fn1(name, age)
    if (_result1 !== undefined) {
      return _result1
    } else {
      var _fn2 = _x[2]
      var _result2 = _fn2(name, age)
      if (_result2 !== undefined) {
        return _result2
      } else {
      }
    }
  }
} */
