### js执行机制
###
探讨js执行机制其实是探讨js中的异步代码的执行顺序，常见的在js中产生异步操作的代码，setTimeout，Promise，async

#### 宏任务与微任务
js执行中有主线程和事件队列，优先执行同步任务，然后执行当前宏任务中的微任务，执行完毕后执行下一个宏任务切分出的微任务
```
 
```

```
// 现在要实现一个红绿灯，把一个圆形 div 按照绿色 3 秒，黄1，红2
function light(duration, color) {
  return new Promise((res, rej) => {
      setTimeout(res, duration)
  })
}
async function changeLight() {
  let lightEle = document.querySelector('#light')
  while(true) {
    lightEle.style.backgroundColor = 'green'
    await light(3000)
    lightEle.style.backgroundColor = 'yellow'
    await light(1000)
    lightEle.style.backgroundColor = 'red'
    await light(2000)
  }
}
changeLight()
```