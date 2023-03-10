const { SyncLoopHook } = require("tapable")

let hook = new SyncLoopHook(["name", "age"])
let counter1 = 0
let counter2 = 0
let counter3 = 0
hook.tap("1", (name, age) => {
  console.log(1, "counter1", counter1)
  if (++counter1 == 1) {
    counter1 = 0
    return
  }
  return true
})
hook.tap("2", (name, age) => {
  console.log(2, "counter2", counter2)
  if (++counter2 == 2) {
    counter2 = 0
    return
  }
  return true
})
hook.tap("3", (name, age) => {
  console.log(3, "counter3", counter3)
  if (++counter3 == 3) {
    counter3 = 0
    return
  }
  return true
})
hook.call("ghx", 10)
//SyncLoopHook 的特点是不停的循环执行回调函数，直到函数结果等于 undefined
//要注意的是每次循环都是从头开始循环的
