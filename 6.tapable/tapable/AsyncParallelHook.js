let Hook = require("./Hook")
const HookCodeFactory = require("./HookCodeFactory")
class AsyncParallelHookCodeFactory extends HookCodeFactory {
  content(options) {
    return this.callTapsParallel(options)
  }
}
let factory = new AsyncParallelHookCodeFactory()
class AsyncParallelHook extends Hook {
  compile(options) {
    factory.setup(this, options)
    return factory.create(options)
  }
}
module.exports = AsyncParallelHook
