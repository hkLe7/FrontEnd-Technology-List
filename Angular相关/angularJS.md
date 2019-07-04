angularJS

原理：

angular并不存在定时脏检测。
angular对常用的dom事件，xhr事件等做了封装， 在里面触发进入angular的digest流程。
在digest流程里面， 会从rootscope开始遍历， 检查所有的watcher。

谈起angular的脏检查机制(dirty-checking), 常见的误解就是认为： ng是定时轮询去检查model是否变更。其实，ng只有在指定事件触发后，才进入$digest cycle：

> * DOM事件，譬如用户输入文本，点击按钮等。
> * (ng-click)
> * XHR响应事件 ($http)
> * 浏览器Location变更事件 ($location)
> * Timer事件($timeout, $interval)
> * 执行$digest()或$apply()

angular 的