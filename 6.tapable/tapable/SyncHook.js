const Hook = require("./Hook")
const HookCodeFactory = require("./HookCodeFactory")
class SyncHookCodeFactory extends HookCodeFactory {
  content() {
    return this.callTapsSeries()
  }
}
//此处创建的是子类的实例，所以都可以调
const factory = new SyncHookCodeFactory()
class SyncHook extends Hook {
  compile(options) {
    //初始化代码工厂 this就是钩子的实例 options选项{taps,args,type}
    factory.setup(this, options)
    return factory.create(options)
  }
}
module.exports = SyncHook
