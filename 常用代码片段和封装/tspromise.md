### promise typescript版本

#### Promise/A+
Promise/A+规范并不涉及如果创建，解决和拒绝promise，而是专注于提供一个通用的then方法。

#### Promise的状态

> Promise的当前状态必须为Pending, Fullfilled或者Rejected中的一种。

> then方法接受两个参数：
```
promise.then(onFullfilled, onRejected)
```

#### Then参数（函数）返回值
