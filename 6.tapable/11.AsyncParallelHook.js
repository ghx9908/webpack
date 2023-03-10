const { AsyncParallelHook } = require("./tapable")
const hook = new AsyncParallelHook(["name", "age"])
console.time("cost")
hook.tapAsync("1", (name, age, callback) => {
  setTimeout(() => {
    console.log(1, name, age)
    callback()
  }, 1000)
})
hook.tapAsync("2", (name, age, callback) => {
  setTimeout(() => {
    console.log(2, name, age)
    callback()
  }, 2000)
})
hook.tapAsync("3", (name, age, callback) => {
  setTimeout(() => {
    console.log(3, name, age)
    callback()
  }, 3000)
})
//不需要每次调用tapAsync就动态编译
//只有当你调用callAsync方法的时候才会去动态编译
//而且动态编译后的方法会覆盖hook.callAsync
//以后再执行hook.callAsync也不需要再编译
hook.callAsync("ghx", 18, () => {
  console.log("done")
  console.timeEnd("cost")
})
//tapAsync会让缓存失效，下次调用callAsync的时候会重新编译
//但是按照常理 是先做饭才吃饭呢 先callAsync编译再运行
/* hook.tapAsync('4', (name,age,callback) => {
  setTimeout(() => {
    console.log(4, name, age);
    callback();
  }, 4000);
});
hook.callAsync('ghx', 18, () => {
  console.log('done');
}); */
