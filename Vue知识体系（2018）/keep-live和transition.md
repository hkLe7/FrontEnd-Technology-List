### keep-alive 和 transition
<transition> 组件和 <keep-alive> 组件都是 Vue 的内置组件。

<keep-alive> 组件是为了缓存优化使用的，组件一旦被 <keep-alive> 缓存，那么再次渲染的时候就不会执行 created、mounted 等钩子函数，Vue 提供了activated钩子函数，执行时机是  <keep-alive> 包裹的组件渲染的时候。