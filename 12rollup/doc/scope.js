
class Scope {
  constructor(options = {}) {
    //作用域的名称
    this.name = options.name;
    //父作用域
    this.parent = options.parent;
    //此作用域内定义的变量
    this.names = options.names || [];
  }
  add(name) {
    this.names.push(name);
  }
  /**
   * 查找定义作用域
   *
   * @param name 变量名
   * @returns 包含变量名的当前作用域或父级作用域（如果存在）或null（如果不存在）
   */
  findDefiningScope(name) {
    // 如果当前作用域的变量集合包含目标变量名，则返回当前作用域
    if (this.names.includes(name)) {
      return this;
    // 如果当前作用域的父作用域存在，则递归调用父作用域的findDefiningScope方法，传入目标变量名
    } else if (this.parent) {
      return this.parent.findDefiningScope(name);
    // 如果当前作用域没有父作用域，则返回null
    } else {
      return null;
    }
  }
}
module.exports = Scope;
