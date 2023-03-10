//只要有一个返回了不为 undefined 的值就直接结束
/* let { AsyncSeriesWaterfallHook } = require("tapable")
let queue = new AsyncSeriesWaterfallHook(["name", "age"])
console.time("cost")
queue.tap("1", function (name, age) {
  console.log(1, name, age)
})
queue.tap("2", function (data, age) {
  console.log(2, data, age)
  return "return2"
})
queue.tap("3", function (data, age) {
  console.log(3, data, age)
})
queue.callAsync("ghx", 10, (err) => {
  console.log(err)
  console.timeEnd("cost")
}) */

let { AsyncSeriesWaterfallHook } = require("tapable")
let queue = new AsyncSeriesWaterfallHook(["name", "age"])
console.time("cost")
queue.tapAsync("1", function (name, age, callback) {
  setTimeout(function () {
    console.log(1, name, age)
    callback(null, 1)
  }, 1000)
})
queue.tapAsync("2", function (data, age, callback) {
  setTimeout(function () {
    console.log(2, data, age)
    callback(null, 2)
  }, 2000)
})
queue.tapAsync("3", function (data, age, callback) {
  setTimeout(function () {
    console.log(3, data, age)
    callback(null, 3)
  }, 3000)
})
queue.callAsync("ghx", 10, (err, data) => {
  console.log(err, data)
  console.timeEnd("cost")
})
