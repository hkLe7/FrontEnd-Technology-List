### Vuex

#### 核心思想

Vuex 的核心是store。store是一个容器，包含应用中大部分的状态state。 Vuex 和普通全局api的区别：
*  Vuex的状态存储是响应式的。当Vue组件从store读取状态的时候，如果store的状态发生变化，那么相应的组件也会相应的得到高效的更新。
* 不能直接改变store中的状态。改变store中的状态的唯一途径就是显式提交(commit)mutation。这样使得我们可以方便的跟踪每一个状态的变化，从而让我们能够实现一些工具帮我们更好的调整应用。

#### store
store数据结构是树型，支持我们按照模块划分来对不同模块进行数据分割。store本身可以理解为一个root module。

每个module下分别定义了state,getters,mutations,actions。store还定义了一个内部的Vue实例，用来建立state到getters的联系，并且可以在严格模式下检测state的变化是不是来自外部，确保改变state的唯一途径就是显式提交mutation。

mutation必须式同步函数，如果我们需要在异步操作后去修改state，需要用 action 去提交mutation。dispatch方法可以协助我们提交action。

批量操作数据：mapState，mapGetters，mapMutations，mapActions

#### 插件
Vuex 支持我们使用插件监控store的变化，例如Logger插件，它相当于订阅了 mutation 的提交，它的 prevState 表示之前的 state，nextState 表示提交 mutation 后的 state，这两个 state 都需要执行 deepCopy 方法拷贝一份对象的副本，这样对他们的修改就不会影响原始 store.state