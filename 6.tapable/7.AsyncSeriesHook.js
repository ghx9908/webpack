//异步串行钩子

let { AsyncSeriesHook } = require("tapable")
let queue = new AsyncSeriesHook(["name"])
console.time("cost")
queue.tapPromise("1", function (name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(1, name)
      resolve()
    }, 1000)
  })
})
queue.tapPromise("2", function (name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(2, name)
      resolve()
    }, 2000)
  })
})
queue.tapPromise("3", function (name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      console.log(3, name)
      resolve()
    }, 3000)
  })
})
queue.promise("ghx").then((data) => {
  console.log(data)
  console.timeEnd("cost")
})
