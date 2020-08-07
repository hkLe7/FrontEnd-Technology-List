### Vue-Router
0
Vue-Router 支持三种路由方式：hash、history、abstract

提供了两种路由组件：<router-link> 和 <router-view>

常用方式：

```
<div id="app">
  <h1>Hello App!</h1>
  <p>
    <!-- 使用 router-link 组件来导航. -->
    <!-- 通过传入 `to` 属性指定链接. -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
    <router-link to="/foo">Go to Foo</router-link>
    <router-link to="/bar">Go to Bar</router-link>
  </p>
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
  <router-view></router-view>
</div>

import Vue from 'vue'
import VueRouter from 'Vue-Router'
import App from './App'

Vue.use(VueRouter)

// 1. 定义（路由）组件。
// 可以从其他文件 import 进来
const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

// 2. 定义路由
// 每个路由应该映射一个组件。 其中"component" 可以是
// 通过 Vue.extend() 创建的组件构造器，
// 或者，只是一个组件配置对象。
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
})

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
  el: '#app',
  render(h) {
    return h(App)
  },
  router
})
```

```
export function initMixin (Vue: GlobalAPI) {
  Vue.mixin = function (mixin: Object) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}
```

Vue-Router 安装最重要的一步是利用 Vue.mixin 去把 beforeCreated 和 destoryed 钩子函数注册到每个组件中，mixin函数的功能就是把混入的对象通过 mergeOptions 合并到 Vue 的 option 中，由于每个组件的构造函数都会在 extend 阶段合并 Vue.options 中，其实也就相当于每个组件都定义了mixin定义的选项。

Vue-Router 内部定义的 Matcher返回了 match 和 addRoutes 方法，通过对定义好的 Location 进行拆解，创建对应的路由映射表，通过name和path可以匹配到对应的 route。

* name
有name情况下会根据nameMap匹配到record，它是一个 RouterRecord 对象，如果Record不存在，则匹配失败返回空路径，再根据规则返回新路径

* path
通过name我们可以很快找到record，但是通过path不能，因为计算后的location.path 是一个真实路径。所以在matchRoute中会根据规则匹配，因为是顺序遍历，所有书写路由配置要注意路径的顺序，因为写在前面的会优先尝试匹配。

### $router 和 $route

1. $router是 Vue-Router 的一个对象，通过Vue.use(VueRouter)和VueRouter构造函数得到一个router的实例对象，这个对象是一个全局的对象，包含了所有的路由和路由的关键属性方法。

2. $route是一个跳转的路由对象，每一个路由都会有一个route对象，是一个局部的对象，可以获取对应的name、path、params、query等

#### 路由懒加载

首先将异步组件定义为返回一个 Promise 的工厂函数，Promise 应该 resolve 组件自身，在 webpack2+ 版本 中用 import 语法定义代码分块点。 结合以上就定义了一个能被 webpack 自动代码分割的异步组件。
```
const Foo = import('./Foo.vue)
```
如果需要把路由下的某些组件打包到同个异步块 chunk 中，可以使用命名 chunk。


#### 路径切换

#### 导航守卫

路由切换过程中，从表象上有2个地方会发生变化，一个是url发生变化，一个是组件发生变化。

其中的执行顺序：
1. 在失活的组件里调用离开守卫。
2. 调用全局的 beforeEach 守卫。
3. 在重用的组件里调用 beforeRouteUpdate 守卫。
4. 在激活的路由配置里调用 beforeEnter。
5. 解析异步路由组件。

router的权限处理，在 router.beforeEach 函数中，判断参数to是否具有对应权限，next做对应处理和调整，router.beforeEach函数必须使用 next() 方法完成跳出。

当点击浏览器返回按钮的时候，如果已经有 url 被压入历史栈，则会触发 popstate 事件，然后拿到当前要跳转的 hash，执行 transtionTo 方法做一次路径转换。

#### 路由传参

在router中定义了路由的params和query，二者都可以传参数，不同的是params并不会记录，一旦刷新页面就会消失，query会存在记录，刷新页面也不会消失。

#### 总结
路由始终会维护当前的线路，路由切换的时候会把当前线路切换到目标线路，切换过程中会执行一系列的导航守卫钩子函数，会更改 url，同样也会渲染对应的组件，切换完毕后会把目标线路更新替换当前线路，这样就会作为下一次的路径切换的依据。

