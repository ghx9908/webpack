class Hook {
  constructor(args = []) {
    this.args = args //形参列表存下来 args =['name','age']
    this.taps = [] //这里存放回调函数
    this.call = CALL_DELEGATE //这是代理的CALL方法
    this.callAsync = CALL_ASYNC_DELEGATE
    this.promise = PROMISE_DELEGATE
    this.interceptors = []
    this._x = null
  }
  tap(options, fn) {
    //如果是通过tap注册的回调，那么类型type=sync,表示fn要以同步的方式调用
    this._tap("sync", options, fn)
  }
  tapAsync(options, fn) {
    this._tap("async", options, fn)
  }
  tapPromise(options, fn) {
    this._tap("promise", options, fn)
  }
  _tap(type, options, fn) {
    if (typeof options === "string") {
      options = { name: options }
    }
    const tapInfo = { ...options, type, fn } //type是回调函数的类型
    this.runRegisterInterceptors(tapInfo)
    this._insert(tapInfo)
  }
  runRegisterInterceptors(tapInfo) {
    for (const interceptor of this.interceptors) {
      if (interceptor.register) {
        interceptor.register(tapInfo)
      }
    }
  }
  _insert(tapInfo) {
    this.resetCompilation()
    let before
    if (typeof tapInfo.before === "string") {
      before = new Set([tapInfo.before])
    } else {
      before = new Set(tapInfo.before)
    }
    let stage = 0
    if (typeof tapInfo.stage === "number") {
      stage = tapInfo.stage //新注册的回调 tapInfo的阶段值
    }
    let i = this.taps.length
    while (i > 0) {
      i--
      const x = this.taps[i]
      this.taps[i + 1] = x
      if (before) {
        if (before.has(x.name)) {
          before.delete(x.name) //说明已经超过x.name tap3
          continue
        }
        if (before.size > 0) {
          //说明还没有超越所有想超越的回调
          continue
        }
      }
      const xStage = x.stage || 0
      if (xStage > stage) {
        //如果当前值比要插入的值要大，继续
        continue
      }
      i++
      break
    }
    this.taps[i] = tapInfo
  }
  intercept(interceptor) {
    this.interceptors.push(interceptor)
  }
  resetCompilation() {
    this.call = CALL_DELEGATE //这是代理的CALL方法
    this.callAsync = CALL_ASYNC_DELEGATE
  }
  _createCall(type) {
    return this.compile({
      taps: this.taps,
      args: this.args,
      interceptors: this.interceptors,
      type,
    })
  }
}
const CALL_DELEGATE = function (...args) {
  //动态创建一个sync类型的call方法
  this.call = this._createCall("sync")
  return this.call(...args)
}
const CALL_ASYNC_DELEGATE = function (...args) {
  this.callAsync = this._createCall("async")
  return this.callAsync(...args)
}
const PROMISE_DELEGATE = function (...args) {
  this.promise = this._createCall("promise")
  return this.promise(...args)
}
module.exports = Hook
