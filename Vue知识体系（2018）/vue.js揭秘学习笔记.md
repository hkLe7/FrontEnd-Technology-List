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

#### vue.js 源码构建
遵循rollup的构建规则，entry 表示入口JS文件地址，dest表示构建后的js文件地址，format属性表示构建的格式，cjs表示 commonJS 规范，es表示 ES Module 规范，umd表示 UMD 规范。

#### Vue 实例
本质是一个用 Function 实现的类，我们只能通过 new Vue 来实例化它。

为何不使用ES6 的 Class 实现？在调用 xxxMixin 之类的函数时，会把 Vue 当作参数传入，它们的功能都是给 Vue 的 prototype 上扩展一些方法，Vue 按功能把这些扩展分散到多个模块中去实现，而不是在一个模块里面实现所有，这种方式是用 Class 难以实现的。这么做的好处是方便代码维护管理。

在 new 一个 Vue 实例的时候做了哪些事情？

```
vm._isVue = true
  // merge options
  if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options)
  } else {
    vm.$options = mergeOptions(
      resolveConstructorOptions(vm.constructor),
      options || {},
      vm
    )
  }
  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    initProxy(vm)
  } else {
    vm._renderProxy = vm
  }
// expose real self
  vm._self = vm
  initLifecycle(vm)
  initEvents(vm)
  initRender(vm)
  callHook(vm, 'beforeCreate')
  initInjections(vm) // resolve injections before data/props
  initState(vm)
  initProvide(vm) // resolve provide after data/props
  callHook(vm, 'created')
```
主要为以上：合并配置，初始化生命周期，初始化事件中心，初始化渲染，初始化data，props，computed，wathcer等等。

#### 虚拟dom Virtual Dom

浏览器标准中把 dom 元素设计的非常复杂，真实的 dom 元素是非常庞大的。当我们频繁去做dom更新，会产生一定的性能问题。

Virtual Dom就是用一个原生的 JS 对象去描述一个 DOM 节点，所以它比创建一个 dom 的代价要小很多。在 Vue.js 中， Virtual Dom 使用 VNode class 去描述。

VNode 是对真实 dom 的一种抽象描述，核心定义主要是几个关键属性：标签名、数据、子节点、键值等，其他属性是用来扩展 VNode 的灵活性以及实现一个特殊的 feature 的。由于 VNode 只是用来映射到真实 dom 的渲染，不需要包含操作 dom 的方法，因此能做到轻量和简单。

除了定义，VNode 映射到真实 DOM 实际要经历 VNode 的create、diff、patch等过程。

* created 过程中，VNode 会调用 createElement ，Virtual Dom 实际上是一个树状结构，每一个 VNode 节点可能有若干个子节点，这些子节点也是 VNode 类型。 在编译 slot 和 v-for 情况下会产生嵌套数组，对应的 children 规范化的方法会把对应结构扁平化。

* update