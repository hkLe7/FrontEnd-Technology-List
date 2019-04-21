### vue.js 揭秘学习笔记
#### 准备工作
* 静态检查工具 flow

类型检查两种方式：通过变量的使用上下文来推断变量类型，然后根据这些推断来检查类型

类型注释： 事先注释好期待的类型，Flow会基于这些注释来判断

```
/*@flow*/
var arr:Array<number> = [1, 2, 3]
arr.push('hello')
// 报错，因为不符合指定类型

/*@flow*/
class Bar {
  x: string;
  y: string | number;
  z: boolean;
  
  constructor(x: string, y: string | number) {
    this.x = x
    this.y = y
    this.z = false
  }
}

var bar: Bar = new Bar('hello', 4)
var obj: { a: string, b: number, c:Array<string>, d: Bar } => {
  a: 'hello',
  b: 11,
  c: ['hello', 'world'],
  d: new Bar('hello', 3)
}
```
flow的写法个人看来是 typescript写法和es-lint的折衷

#### 源码目录结构

```
src
├── compiler        # 编译相关 
├── core            # 核心代码 
├── platforms       # 不同平台的支持
├── server          # 服务端渲染
├── sfc             # .vue 文件解析
├── shared          # 共享代码
```
