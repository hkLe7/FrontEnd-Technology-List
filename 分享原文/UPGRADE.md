# webpack 3.x 升级到 4.x

## ---- from panmin

## 升级步骤

* 升级webpack
* 升级带有webpack字段的所有插件
* 升级所有可能loader插件
* 安装 offline-plugin 插件
* 安装 terser-webpack-plugin
* 因为vue-loader报错regeneratorRuntime is not defined ,安装 babel-plugin-transform-runtime
* 如果是手动升级webpack到4.x ，没有使用vue的脚手架，则，必须手动配置vue-loader插件`const VueLoaderPlugin = require('vue-loader/lib/plugin');`,并引入plugin
* 去掉babel-pollify 使用transform-runtime 代替,更轻量
* 添加hard-source-webpack-plugin插件，因为html-webpack-plugin不会把dllplugin生成的文件加入到dist/index.html中，使用该插件，可以完全替代webpacl.DllPlugin,不过在第二次构建才会生效


## 优化点

* 编译时间过长（通过speed测速，主要浪费在loader上，方案：因为多线程编译，提升速度，但是vue-loader引入happy因为loader顺序问题，解决中）
* 打包时间过长（主要浪费在压缩上，减少打出的包的数量，原打包速度在12s,去掉压缩后，打包速度在5s ，提升不是一点点）
* 查看时间浪费在哪些环节上：speed-measure-webpack-plugin来检测webpack打包过程中各个部分所花费的时间
* webpack.DllPlugin  & webpack.DllReferrencePlugin 通过缓存第三方变动较小的库，极大提升编译速度（19-11）/19, 提升了40%左右
* 多线程parallel:os.cpu().length, 设置多核
* 添加happypack/loader 提升编译速度
* Tree Shaking 的功能，需要开启optimization中的UglifyJS 才能起作用

## 优化编译打包

* 添加happypack,vue由于使用的vueloaderplugin, 引入happypack目前有问题，继续研究
* moment模板只打包中文版/zh-cn/，使用webpack.ContextReplacementPlugin（984-803）/984≈18.39%
* moment打包中农 esmodule 和umd都打包进去了，使用alias，强制使用esmodule ，配置resolve: alias: 'moment$':
* 生产配置中，最耗时的是UglifyJsPlugin，打包出越多的环境，这个过程越耗时间(speed-measure-webpack-plugin来检测),如果minimize为false，该插件不起作用
* 需要权衡，optimization中如果开启minimize：true, 打包速度会提升55%左右，但是每个包的大小（再用gzip压缩一下），会比原来大40%！流量为主的情况下，以忽略打包时间为牺牲，做设置，
* UglifyJsPlugin 的mangle混淆，也会给压缩包减负24%左右，而该option默认是false，需要手动开启（默认false是因为webpack某些极端及情况下，mangle混淆会导致编译错误，遇到过）
* 默认打包的chunks: 'all', 所以入口处的moment会被打到common中，但是moment不属于首页加载必须的模块，所以，应该放到后面按需加载，这样首页包的大小可以减少150k
* 把AddDriver.vue & AddTruckDriver.vue 中的this.$moment 变成import按需引入的方式，其他文件不需要修改
* optimization.minize.UglifyJs添加cache: '.uglifyJsCache',之前： 第一次编译<=26s, 第二次<=18s, 第二次<=8s

## 升级采坑

* vue , vue-loader， vue-template-runtime 一定要版本一致
* CompressionWebpackPlugin 插件的assets换成了filename字段
* extract-text-webpack-plugin插件切换成 mini-css-extract-plugin
* 安装 babel-plugin-transform-runtime 插件，否则vue-loader会一直报错


## 升级废弃说明（proxy?）

* babel-pollyfill 废弃
* 多个插件废弃，4.x 内置了
* webpack5 的提倡开箱即用（out-of-box）,hard-source-webpack-plugin会变成内置,


