class SyncHook {
  constructor(args) {
    this.args = args
    this.taps = []
    this._x = []
  }

  tap(name, fn) {
    const tapInfo = {
      name,
      fn,
    }
    this.taps.push(tapInfo)
  }
  call(...args) {
    debugger
    this._x = this.taps.map((tapInfo) => tapInfo.fn)
    let fn
    this.call = new Function(this.argsSting(), this.header() + this.content())
    console.log("this.call=>", this.call.toString())
    this.call(...args)
  }

  argsSting() {
    return this.args.join(",")
  }
  header() {
    let code = ``
    code += `var _x = this._x;\n`
    return code
  }
  content() {
    let code = ""
    for (let j = 0; j < this.taps.length; j++) {
      const tapContent = this.callTap(j)
      code += tapContent
    }
    return code
  }
  callTap(tapIndex) {
    debugger
    let code = ``
    code += `var _fn${tapIndex} = _x[${tapIndex}];\n` //取出回调函数
    code += `_fn${tapIndex}(${this.argsSting()});\n` //执行回调函数
    return code
  }
}

module.exports = SyncHook
