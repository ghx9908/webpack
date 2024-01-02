class Scope {
  constructor(options = {}) {
    //作用域的名称
    this.name = options.name;
    //父作用域
    this.parent = options.parent;
    //此作用域内定义的变量
    this.names = options.names || [];
    // 表示这个作用于是不是一个块级作用域
    this.isBlock = !!options.isBlock
  }
  
  /**
   * 
   * @param {*} name 变量名
   * @param {*} isBlockDeclaration 是否为块级声明，比如let a = 1;
   */
  add(name, isBlockDeclaration) {
    if(!isBlockDeclaration && this.isBlock){
      // if(true){ var a = 1 }
      //这是一个var或者函数声明，并且这是一个块级作用域，所以我们需要向上提升
      this.parent.add(name, isBlockDeclaration)
    }else{
      this.names.push(name);
    }
  }
  findDefiningScope(name) {
    if (this.names.includes(name)) {
      return this;
    } else if (this.parent) {
      return this.parent.findDefiningScope(name);
    } else {
      return null;
    }
  }
}
module.exports = Scope;
