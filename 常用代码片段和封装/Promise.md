### js 异步简单实现

#### promise

将 promise 看做一个状态机，初始为 pending 状态，可以通过函数 resolve 和 reject ,将状态机变为 resolved 或者 rejected 状态，状态一旦改变无法再次发生变化。

then 函数会返回一个 Promise 实例，并且该返回值是一个新的实例而不是之前的实例。因为 Promise 规范规定除了 pending 状态，其他状态是不可改变的，如果返回一个相同实例，多个 then 调用就毫无意义了。

```
c
```

