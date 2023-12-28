

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




## 问题
