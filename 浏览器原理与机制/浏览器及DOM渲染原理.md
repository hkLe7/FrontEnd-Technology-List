# DOM 渲染原理

#### 操作 DOM 成本很高

狭义的 DOM 是 HTML 内的各个标签，广义的 DOM 是对象模型，视为 HTML 以及 XML 提供的API。不止 js 可以调用，Python 也可以调用。

#### 浏览器渲染过程

> 经典面试题：从键入地址到渲染出页面，中间经历了哪些过程？

##### 从 URL 到网络请求

当我们打开空白标签页，浏览器会创建一个新的 Renderer 进程。在这之后我们键入 URL 按下回车，浏览器的 Browser 主进程会开辟一个网络请求线程用于网络请求。流程如下：

**解析 URL：** 解析 URL 的协议名，域名，端口号，路径，查询参数，哈希值等。

**DNS 解析：** 读取 DNS 缓存，如果有相应浏览器缓存或者本地缓存，直接使用缓存，不进行 DNS 解析，如果没用相应 DNS 缓存，则进行 DNS 解析，查出域名对应的 IP 地址。

**建立TCP/IP连接：** 通过三次握手建立与服务器的连接（长连接与短连接），在此之后发送具体请求到服务器，等待服务器响应。浏览器根据请求做出回应，返回数据包。最后当关闭连接时，双方通过四次挥手断开连接。

##### 页面渲染

1. 解析 HTML，构建 DOM 树（这里遇到外联，此时会发起请求）
2. 解析 CSS， 生成 CSS 规则树
3. 合并 DOM 树和 CSS 规则，生成 render 树
4. 布局 render 树（Layout/reflow），负责各元素尺寸、位置的计算
5. 绘制 render 树（paint），绘制页面像素信息
6. 浏览器会将各层的信息发送给 GPU，GPU 将各层合成（composite），显示在屏幕上

> 无论是 DOM 还是 CSSOM 流程都是 Bytes -> characters -> tokens -> nodes -> objectmodel 这个过程

> 当前节点的所有子节点都构建好后才会去构建当前节点的下一个兄弟节点

> 构建 DOM 树和 CSSOM 树的过程中，最终计算各个节点的样式时，浏览器都会先从该节点的普遍属性（比如body设置的全局样式）开始，再去应用该节点的具体属性（从整体到局部）。还有要注意的点，每个浏览器都有自己默认的样式表，因此很多时候 CSSOM 树知识对这张默认样式表进行替换。

> DOM 树和 CSSOM 树合成 render 树

DOM 树从根节点遍历可见节点，保存各个节点的样式信息和其余节点的从属关系。其中display: none;会被跳过，visibility: hidden; 和 opacity: 0;不会跳过。

> Layout 布局
有了各个节点的样式和信息，但不知道各个节点的确切位置和大小，通过布局将样式信息和属性转换为实际可视窗口的相对大小和位置。

> Paint 绘制
将确定好大小位置的各个节点通过 GPU 渲染到屏幕的实际像素。

##### tips：

1. 构建 DOM 树、CSSOM 树和生成 render 树可能会多次执行。js 操作 dom 或者更改 css 样式时，浏览器需要重新构建 DOM、 CSSOM 树、重新 render，重新 Layout、paint；
2. Layout 在 paint 之前，所以 Layout 和 reflow 一定出发 paint，paint 不一定触发 Layout。
3. 图片下载完也会重新触发 Layout 和 paint。

#### 回流（reflow）和重绘（repaint）

> reflow：元素的内容、结构。位置或尺寸发生了变化，需要重新计算样式和渲染树；
> repaint： 元素的改变只影响了节点的一些样式（背景色、边框颜色，文字颜色等），只需要应用新样式绘制此元素。
> 回流的成本高于重绘，一个子节点的回流往往导致子节点以及同级节点的回流。 


##### 引起reflow回流
现代浏览器会对回流做优化，它会等到足够数量的变化发生，再做一次批处理回流。
1. 页面第一次渲染（初始化）
2. DOM树变化（如：增删节点）
3. Render树变化（如：padding改变）
4. 浏览器窗口resize
5. 获取元素的某些属性：

浏览器为了获得正确的值也会提前触发回流，这样就使得浏览器的优化失效了，这些属性包括offsetLeft、offsetTop、offsetWidth、offsetHeight、 scrollTop/Left/Width/Height、clientTop/Left/Width/Height、调用了getComputedStyle()或者IE的currentStyle

##### 引起repaint重绘
1. reflow回流必定引起repaint重绘，重绘可以单独触发
2. 背景色、颜色、字体改变（注意：字体大小发生变化时，会触发回流

##### 优化 reflow 和 repaint 的触发次数
避免逐个修改节点样式，尽量一次性修改

使用DocumentFragment将需要多次修改的DOM元素缓存，最后一次性append到真实DOM中渲染

可以将需要多次修改的DOM元素设置display: none，操作完再显示。（因为隐藏元素不在render树内，因此修改隐藏元素不会触发回流重绘）

避免多次读取某些属性（见上）

将复杂的节点元素脱离文档流，降低回流成本

#### 为什么一再强调将css放在头部，将js文件放在尾部

##### DOMContentLoaded 和 load

DOMContentLoaded 事件触发时，仅当DOM加载完成，不包括样式表，图片...
load 事件触发时，页面上所有的DOM，样式表，脚本，图片都已加载完成

##### CSS 资源阻塞渲染
构建Render树需要DOM和CSSOM，所以HTML和CSS都会阻塞渲染。所以需要让CSS尽早加载（如：放在头部），以缩短首次渲染的时间。

##### JS 资源
阻塞浏览器的解析，也就是说发现一个外链脚本时，需等待脚本下载完成并执行后才会继续解析HTML
这和之前文章提到的浏览器线程有关，浏览器中js引擎线程和渲染线程是互斥的。

普通的脚本会阻塞浏览器解析，加上defer或async属性，脚本就变成异步，可等到解析完毕再执行
async异步执行，异步下载完毕后就会执行，不确保执行顺序，一定在onload前，但不确定在DOMContentLoaded事件的前后
defer延迟执行，相对于放在body最后（理论上在DOMContentLoaded事件前）

#### 首屏优化Tips

说了这么多，其实可以总结几点浏览器首屏渲染优化的方向
1. 减少资源请求数量（内联亦或是延迟动态加载）
2. 使CSS样式表尽早加载，减少@import的使用，因为需要解析完样式表中所有import的资源才会算CSS资源下载完
3. 异步js：阻塞解析器的 JavaScript 会强制浏览器等待 CSSOM 并暂停 DOM 的构建，导致首次渲染的时间延迟