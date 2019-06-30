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
主要为以上：合并配置，初始化生命周期，初始化事件中心，初始化渲染，初始化data，props，computed，watcher等等。

#### 虚拟dom Virtual Dom

浏览器标准中把 dom 元素设计的非常复杂，真实的 dom 元素是非常庞大的。当我们频繁去做dom更新，会产生一定的性能问题。

Virtual Dom就是用一个原生的 JS 对象去描述一个 DOM 节点，所以它比创建一个 dom 的代价要小很多。在 Vue.js 中， Virtual Dom 使用 VNode class 去描述。

VNode 是对真实 dom 的一种抽象描述，核心定义主要是几个关键属性：标签名、数据、子节点、键值等，其他属性是用来扩展 VNode 的灵活性以及实现一个特殊的 feature 的。由于 VNode 只是用来映射到真实 dom 的渲染，不需要包含操作 dom 的方法，因此能做到轻量和简单。

除了定义，VNode 映射到真实 DOM 实际要经历 VNode 的create、diff、patch等过程。

* created 过程中，VNode 会调用 createElement ，Virtual Dom 实际上是一个树状结构，每一个 VNode 节点可能有若干个子节点，这些子节点也是 VNode 类型。 在编译 slot 和 v-for 情况下会产生嵌套数组，对应的 children 规范化的方法会把对应结构扁平化。

* update update


#### vue监听数组变化

通过对数组的7个方法(push, pop, shift, unshift, splice, sort, reverse)重新包装(这里指data中的数组)，并将数组的原型指向包装后的arrayMethods，当数组调用这7个方法，其实是调用arrayMethods中的方法而不是Array.prototype中的方法。同时对push,unshift,splice中插入的新值进行响应式绑定，并向所有依赖发送通知，告知数组的值发生了变化。


#### vue.$nexttick

使用原生的 MutationObserver 对象来监听dom变化，MutationObserver是一个构造器，接受一个callback参数，用来返回节点变化： mutations - 节点变化的记录列表；observe - 构造 MutationObserver 对象。

observe对象有三个方法：
1. 设置观察目标，接受两个参数，target：观察目标 options：观察目标设置选项
2. disConnect: 阻止观察者观察任何改变
3. takeRecord: 清空队列并返回其中的内容

如果在created中进行dom操作一定要放到vue.nexttick()中，因为created中并未完成dom渲染，同时在created中获取ref也是空数组

为了在数据变化之后等待 Vue 完成更新 DOM ，可以在数据变化之后立即使用 Vue.nextTick(callback) 。这样回调函数在 DOM 更新完成后就会调用。



#### vue diff算法

虚拟dom是真实dom的映射，因为操作dom较为消耗性能，所以vue和react选择了虚拟dom的方式来解决操作dom的性能问题。virtual dom很多时候不是最优操作，但是它具有普适性，在效率和可维护性之间达到平衡。


diff的过程是调用patch函数，像打补丁一样修改真实dom

```javascript
function patch (oldVnode, vnode) {
  if (sameVnode(oldVnode, vnode) {
    patchVnode(oldVnode, vnode)
  } else {
    const oEl = oldVnode.el
    let parentEle = api.parentNode(oEl)
    createEle(vnode)
    if (parentEle !== null) {
      api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl))
      api.removeChild(parentEle, oldVnode.el)
      oldVnode = null
    }
  }
  return vnode
}
```

patch接收两个参数，vnode和oldVnode，也就是新旧两个虚拟节点。完整的vnode通常拥有以下属性：

```javascript
{
  el: div,
  tagName: 'DIV',
  sel: 'div#v.classA',
  data: null,
  children: [],
  text: null,
}
```

el属性引用了virtual dom对应的真实dom元素，patch的vnode参数的el最初是null，因为patch之前它还没有对应的真实dom。

##### sameVnode

sameVnode函数是看这两个节点是否值得比较：

```javascript
function sameVnode(oldVnode, vnode) {
  return vnode.key === oldVnode.key && vnode.sel === oldVnode.sel
}
```
两个vnode的key和sel相同才去比较它们，当不值得比较会执行else逻辑，直接取得oldVnode.el的父节点并在parentELe中插入新dom，移除旧dom。

进入patch函数之前，vnode.el的值为null，执行patch之后它引用了对应的真实dom。

##### patchNode

patchNode是两个节点的比较

```javascript
patchVnode (oldVnode, vnode) {
    const el = vnode.el = oldVnode.el
    let i, oldCh = oldVnode.children, ch = vnode.children
    if (oldVnode === vnode) return
    if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text)
    }else {
        updateEle(el, vnode, oldVnode)
        if (oldCh && ch && oldCh !== ch) {
            updateChildren(el, oldCh, ch)
        }else if (ch){
            createEle(vnode) //create el's children dom
        }else if (oldCh){
            api.removeChildren(el)
        }
    }
}
```

const el = vnode.el = oldVnode.el 让vnode.el引用到现在的真实dom，当el修改时，vonde.el会同步发生变化。

节点的比较有5种情况：

1. if (oldVnode === vnode)，他们的引用一致，可以认为没有变化。

2. if(oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text)，文本节点的比较，需要修改，则会调用Node.textContent = vnode.text。

3. if( oldCh && ch && oldCh !== ch ), 两个节点都有子节点，而且它们不一样，这样我们会调用updateChildren函数比较子节点，这是diff的核心，后边会讲到。

4. else if (ch)，只有新的节点有子节点，调用createEle(vnode)，vnode.el已经引用了老的dom节点，createEle函数会在老dom节点上添加子节点。

5. else if (oldCh)，新节点没有子节点，老节点有子节点，直接删除老节点。

##### updateChildren

updateChildren 函数对子节点的多种情况进行了处理

```javascript
function updateChildren (parentElm, oldCh, newCh) {
  let oldStartIdx = 0, newStartIdx = 0
  let oldEndIdx = oldCh.length - 1
  let oldStartVnode = oldCh[0]
  let oldEndVnode = oldCh[oldEndIdx]
  let newEndIdx = newCh.length - 1
  let newStartVnode = newCh[0]
  let newEndVnode = newCh[newEndIdx]
  let oldKeyToIdx
  let idxInOld
  let elmToMove
  let before
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode == null) {   //对于vnode.key的比较，会把oldVnode = null
        oldStartVnode = oldCh[++oldStartIdx] 
    }else if (oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx]
    }else if (newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx]
    }else if (newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx]
    }else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
    }else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
    }else if (sameVnode(oldStartVnode, newEndVnode)) {
        patchVnode(oldStartVnode, newEndVnode)
        api.insertBefore(parentElm, oldStartVnode.el, api.nextSibling(oldEndVnode.el))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
    }else if (sameVnode(oldEndVnode, newStartVnode)) {
        patchVnode(oldEndVnode, newStartVnode)
        api.insertBefore(parentElm, oldEndVnode.el, oldStartVnode.el)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
    }else {
      // 使用key时的比较
      if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) // 有key生成index表
      }
      idxInOld = oldKeyToIdx[newStartVnode.key]
      if (!idxInOld) {
          api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
          newStartVnode = newCh[++newStartIdx]
      }
      else {
        elmToMove = oldCh[idxInOld]
        if (elmToMove.sel !== newStartVnode.sel) {
            api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
        }else {
            patchVnode(elmToMove, newStartVnode)
            oldCh[idxInOld] = null
            api.insertBefore(parentElm, elmToMove.el, oldStartVnode.el)
        }
        newStartVnode = newCh[++newStartIdx]
      }
    }
  }
  if (oldStartIdx > oldEndIdx) {
      before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
  }else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
  }
}
```

diff过程可以概括为：oldCh和newCh各有两个头尾的变量StartIdx和OldIdx，它们的2个变量相互比较，一共有4种比较方式。如果4种比较都没匹配，如果设置了key，就会用key进行比较，比较的时候变量会往中间靠，一旦StartIdx > EndIdx表明oldCh和newCh至少有一个已经遍历完了，就会结束比较。

设置key和不设置key的区别：

不设key，newCh和oldCh只会进行头尾两端的相互比较，设key后，除了头尾两端的比较外，还会从用key生成的对象oldKeyToIdx中查找匹配的节点，所以为节点设置key可以更高效的利用dom。







