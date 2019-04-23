
Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

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