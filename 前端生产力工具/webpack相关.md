### webpack相关

#### 原理
从配置文件定义的模块列表开始，处理应用程序，从入口文件开始递归构建一个依赖图，然后将所有模块打包为少量的bundle，通常只有一个，可由浏览器加载。

### package.json
生成方式 npm init -y

#### devdependencies 和 dependencies

npm 是本来设计用来服务于Node.js包管理的。

开发一个模块时，如果在发布模块时依旧依赖某个包，例如写一个 proxy 的插件，依赖了 request 模块，这个时候，发布以后如果别人使用必须同时安装 request 模块，那这个 request 包就是 dependencies

如果只是在 dev 环境调试或者做功能辅助，比如代码检测工具，测试工具等用户使用或者正式发布不需要的包，就属于 devdependencies

#### npm 相关指令

```
--save === -S
--save-dev === -D
npm i --save-dev <packname> 
```
工程开发环境和打包的依赖

```
npm i --save <packname> 
```
项目运行和发布到生产环境的依赖

#### scripts
自定义 npm run 命令，可以简化build, server 等webpack命令
```
"scripts": {
  "dev": " webpack-dev-server --inline --hot --progress  --config  build/webpack.dev.conf.js",
  "build": "node build/build.js",
  "build:dll": "webpack --config build/webpack.dll.conf.js",
  "release": "node ./build/release.js"
},
```

### webpack.config.js

webpack 4.0+之后，内部集成了大部分的默认设置，但是如果我们需要添加一些自定义设置，那么需要在根目录添加 webpack.config.js 文件来进行相应处理。

#### 入口和出口

入口写在 webpack.config.js 设置中
```
const config = {
  entry: './path/to/main.js'
}
module.exports = config
```
```
const config = {
  output: './path/to/main.js'
}
module.exports = config
```
通过设置来管理我们的输入和输出

> 单页面应用中常用配置
```
const config = {
  entry: {
    app: './src/app.js',
    vendors: './src/vendors.js'
  }
};
```
分离主app和外部第三方依赖。此设置允许你使用 CommonsChunkPlugin 从「应用程序 bundle」中提取 vendor 引用(vendor reference) 到 vendor bundle，并把引用 vendor 的部分替换为 __webpack_require__() 调用。如果应用程序 bundle 中没有 vendor 代码，那么你可以在 webpack 中实现被称为长效缓存的通用模式。

> 多页面应用程序中常用配置 
利用CommonsChunkPlugin
```
const config = {
  entry: {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js'
  }
};
```
拆分三个独立依赖图作为独立入口，允许我们做很多操作

#### 重要插件
##### HtmlWebpackPlugin
build之后生成新的index.html替换掉原有html
##### CleanWebpackPlugin
清除 dist/*

#### 模式
开发模式和生产模式，分别对应不同的内置插件
```
// webpack.development.config.js
module.exports = {
+ mode: 'development'
- plugins: [
-   new webpack.NamedModulesPlugin(),
-   new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
- ]
}
// webpack.production.config.js
module.exports = {
+  mode: 'production',
-  plugins: [
-    new UglifyJsPlugin(/* ... */),
-    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
-    new webpack.optimize.ModuleConcatenationPlugin(),
-    new webpack.NoEmitOnErrorsPlugin()
-  ]
}
```

#### loader
对模块的源代码进行转换，允许你在 import 时加载模块的预处理文件。类似其他构建工具中的task。

使用loader的方式：
1. 配置： 在webpack.config.js指定loader
```
module: {
  rules: [
    {
      test: /\.css$/,
      use: [
        { loader: 'style-loader' },
        {
          loader: 'css-loader',
          options: {
            modules: true
          }
        }
      ]
    }
  ]
}
```
2. 内联： 在每个import中显示指定loader
```
import Styles from 'style-loader!css-loader?module!./style.css';
```
3. CLI：  在shell命令中指定
```
webpack --module-bind jade-loader --module-bind 'css=style-loader!css-loader'
```

#### 模块

常用的模块模式都可以在webpack中表达对应依赖关系：
ES6 import / CommonJS require() / AMD define require / css,sass,less中 @import / url(...) / \<img src=... />

##### 模块解析

使用 enhanced-resolve, webpack 能解析三种文件路径：
绝对路径/相对路径/模块路径

##### Loader解析
解析 Loader 规则遵循与文件解析起指定规则相同的规则。但是 resolveLoader 配置选项可以用来为 Loader 提供独立的解析规则

#### manifest
当编译器 compiler 开始执行，解析和映射应用程序是，它会保留所有模块的详细要点。这个数据集称为"Manifest"，当完成打包并发送到浏览器时，会在运行时通过Manifest来解析和加载模块。无论你选择哪种模块语法，那些 import 和 require 的语句已经转换为 \__webpack_require__ 语法，此方法指向模块标识符。通过使用 manifest 中的数据， runtime 将能够查询模块标识符，检索出背后对应的模块。

#### targets
构建目标：webpack是针对前端项目的打包工具，所有并不单只是支持html5的部分，服务器代码和浏览器代码在webpack中提供了多种构建目标(target),可以在 webpack.config.js 中设置。

```
module.exports = {
  target: 'node'
}
```
可以通过打包多份数配置来创建同构的哭：
```
var path = require('path')
var serverConfig = {
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.node.js'
  }
}

var clientConfig = {
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.js'
  }
}

module.exports = [ serverConfig, clientConfig ]
```
#### 原理相关
##### ast
抽象语法树

##### 模块热替换
HMR
