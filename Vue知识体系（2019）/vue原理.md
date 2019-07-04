### Vue 2.0 和 3.0 原理

#### Object.defineProperty()

利用Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

常见应用：

a === 1 && a === 2 && a === 3 为 true ？
```
let count = 0;
Object.defineProperty(window, 'a', {
  get() {
    count++
    return count
  }
})
console.log(a === 1 && a === 2 && a === 3)
```

#### proxy

3.0 使用 proxy 来进行数据劫持，proxy 相对 Object.defineProperty 的优势，可以监听数组的变化。在 vue2.0 单独为监听数组变化写了hack（重新包装了数组中的7个方法，并对方法中的push，unshift，splice中插入的新值进行响应式绑定，如果对应值发生变化会将通知发送给所有依赖）

##### proxy 用法:

基础：

```
let p = new Proxy(target, handler)
```

targer 表示用Proxy包装的目标对象（可以是任意类型，包括原生数组，函数，甚至另外一个代理）

handler 表示一个对象，其属性是当执行一个操作时定义代理的行为的函数

```
let handler = {
  get: function(target, name) {
    return name in target ? target[name] : 37
  }
}
let p =  new Proxy({}, handler)

p.a = 1
p.b = undefined

console.log(p.a, p.b) // 1, undefined
console.log('c' in p, p.c) // false, 37
```

实现私有变量

```
var api = {
  _apiKey: '1233dae'
}

const PRIVATE = ['_apiKey']

api = new Proxy(api, {
  get(target, key, proxy) {
    if (PRIVATE.indexOf(key) > -1) {
      throw Error(`${key} is private`)
    }
    return Reflect.get(target, key, proxy)
  },
  set(target, key, value, proxy) {
    if (PRIVATE.indexOf(key) > -1) {
      throw Error(`${key} is private`)
    }
    return Reflect.get(target, key, value, proxy)
  }
})

api._apiKey = '987654321';  // throw error
```

