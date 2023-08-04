class AsyncParallelHook {
  constructor(args = []) {
    this.args = args //形参列表
    this.taps = [] //{name,fn}[],调用tap方法的参数
    this.callAsync = CALL_ASYNC_DELEGATE
    this._x = [] // 需要执行的函数
  }
  tapAsync(name, fn) {
    const tapInfo = {
      name,
      fn,
    }
    this.resetCompilation()
    this.taps.push(tapInfo)
  }
  resetCompilation() {
    this.callAsync = CALL_ASYNC_DELEGATE
  }
  _createCall(type) {
    this._x = this.taps.map((tapInfo) => tapInfo.fn)
    let fn
    fn = new Function(
      this.argsSting({ after: "_callback" }),
      this.header() + this.content({ onDone: () => "_callback();\n" })
    )
    return fn
  }

  argsSting(config = {}) {
    const { after } = config
    let allArgs = [...this.args]
    if (after) {
      allArgs.push(after)
    }
    return allArgs.join(",") //name,age,_callback
  }
  header() {
    let code = ``
    code += `var _x = this._x;\n`
    return code
  }
  content({ onDone }) {
    const taps = this.taps
    let code = ``
    code += `var _counter = ${taps.length};\n`
    code += `
      var _done = function () {
        ${onDone()}
      };
    `
    for (let j = 0; j < this.taps.length; j++) {
      const tapContent = this.callTap(j)
      code += tapContent
    }
    return code
  }
  callTap(tapIndex) {
    let code = ``
    code += `var _fn${tapIndex} = _x[${tapIndex}];\n` //取出回调函数
    code += `_fn${tapIndex}(${this.argsSting()}, function () {
        if (--_counter === 0) _done();
      });\n` //执行回调函数
    return code
  }
}
const CALL_ASYNC_DELEGATE = function (...args) {
  this.callAsync = this._createCall("async")
  return this.callAsync(...args)
}
module.exports = AsyncParallelHook
