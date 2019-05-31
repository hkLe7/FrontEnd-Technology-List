### vue 文档脉络

#### vue实例
每个vue应用都是通过Vue函数创建一个新的vue实例开始的

```
var vm = new Vue({
  // options
})
```

一个vue应用由一个通过new Vue创建的根vue实例以及可选的嵌套的、可复用的组件树组成。

常见todolist模型

#### 数据与方法
data的响应式绑定


#### 生命周期

声明周期钩子与各阶段区分

#### 指令
v-if v-on v-bind

2.6 新增动态参数

修饰符规定指令的特殊绑定方式
```
<form v-on:submit.prevent="onSubmit"></form>
```