

## 基础知识
### 1. magic-string
magic-string是一个操作字符串和生成source-map的工具

### 2. AST
通过JavaScript Parser可以把代码转化为一颗抽象语法树AST,这颗树定义了代码的结构，通过操纵这颗树，我们可以精准的定位到声明语句、赋值语句、运算语句等等，实现对代码的分析、优化、变更等操作

#### 2.1 AST工作流
Parse(解析) 将源代码转换成抽象语法树，树上有很多的estree节点
Transform(转换) 对抽象语法树进行转换
Generate(代码生成) 将上一步经过转换过的抽象语法树生成新的代码


#### 2.2 acorn
[astexplorer](https://astexplorer.net/)可以把代码转成语法树
acorn 解析结果符合The Estree Spec规范



## 核心
###  实现tree-shaking

第一步
在module里收集imports、exports和definitions
在analyse收集_defines和_dependsOn
第二步
重构expandAllStatements

```js
//存放本模块导入了哪些变量
this.imports = {};
// 存放本模块导出了哪些变量
this.exports = {};
//存放本模块的定义变量的语句
this.definitions = {};
//此变量存放所有的变量修改语句,key是变量名，值是一个数组
this.modifications = {};//{name:[name+='jiagou'],age:'age++'}
//记得重命名的变量{key老的变量名:value新的变量名}
this.canonicalNames = {};//{age:'age$1'}
//本模块从哪个模块导入了什么变量，在当前模块内叫什么名字
//this.imports.name = {'./msg','name'};
this.imports[localName] = { source, importName }
//本模块导出了哪个变量，对应哪个本地变量
//this.exports.name = {localName:'name'};
this.exports[exportName] = { localName };
//本顶级语句定义的变量
statement._defines[name] = true;
//定义变量的语句
this.definitions[name] = statement;
//本语句用到的变量
statement._dependsOn[name] = true;
//从模块中获取定义变量的语句
module.define(name);

```

## 问题
### module和bundle的关系
项目只有一个bundle
bundle里会有很多的模块
