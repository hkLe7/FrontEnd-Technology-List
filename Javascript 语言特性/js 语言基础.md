### JS语言基础

#### 内置类型
js中有七种内置类型，七种分为两大类型：基本类型和对象(Object)

基本类型有六种：null, undefined, boolean, number, string, symbol

其中数字类型是浮点类型，没有整型。浮点类型基于IEEE 754标准实现。NaN也属于number类型，并且NaN不等于自身。

基本类型如果使用字面量的方式，那么这个变量只是个字面量，只有在必要的时候才会转换为对应的类型。

对象是引用类型，在使用过程中会遇到浅拷贝和深拷贝的问题。

基本数据类型存储在栈内存，引用类型的地址存储在栈内存，指向存储在堆内存。当我们把对象赋值给另外一个变量时，复制的是地址，指向同一块内存空间，当其中一个对象改变，另一个对象也会变化。




```
let a = { name: 'FE' }
let b = a 
b.name = 'FF'
console.log(a.name) // FF
```

##### Typeof

typeof 方法对于基本类型，除了null都可以显示正确的类型，对于对象，除了函数都会显示object

> typeof 能否正确判断数据类型？ instanceof 呢？ instanceof 实现的原理是什么？

typeof 能正确判断基本数据类型，但是除了null， typeof null 返回的是对象。但是对对象来说，typeof不能正确的判断其类型， typeof 一个函数输出function，而除此以外，输出的全是object，这种情况下无法准确知道对象的类型。

instanceof 可以准确判断复杂数据类型，但是不能正确判断基本数据类型。

正确判断类型：
```
function isComplex(data) {
  if (data && (typeof data === 'object' || typeof data === 'function')) {
    return true
  }
  return false
}

class PriStr {
  static [Symbol.hasInstance](data) {
    return typeof data === 'string';
  }
}
class PriNumber {
  static [Symbol.hasInstance](data) {
    return typeof data === 'number';
  }
}
class PriBoolean {
  static [Symbol.hasInstance](data) {
    return typeof data === 'boolean';
  }
}
class PriUndefined {
  static [Symbol.hasInstance](data) {
    return typeof data === 'undefined';
  }
}
class PriNull {
  static [Symbol.hasInstance](data) {
    return data === null
  }
}
class PriSymbol {
  static [Symbol.hasInstance](data) {
    return data === 'symbol'
  }
}

```


##### instanceof
instanceof 是通过原型链判断的， A instanceof B， 在A的原型链中层层查找是否有原型等于B.prototype, 如果一直找到A的原型链顶端仍然不等于B.prototype，返回false，否则返回true。

尝试实现instanceof

instanceof的实现：
```
function myInstanceof (L, R) {
  var O = R.prototype;
  L = L.__proto__;
  while (true) {
    if (L === null) return false;
    if (O === L) return true;
    L = L.__proto__;
  }
}
```


##### 类型转换
转Boolean

条件判断时，除了undefined, null, '', NaN, false, 0, -0, 其他值为true, 包括所有对象。

对象转基本类型 极少用

##### 四则运算

加法运算时，其中一方是字符串类型，就会把另一个也转为字符串类型。其他只要一方为数字，那另一方就转为数字。并且加法运算会触发三种类型转换：将值转换为原始值，转换为数字，转换为字符串。

```
[1, 2] + [2, 1]
// '1,22,1'
// [1, 2].toString() -> '1,2'
// [2, 1].toString() -> '2,1'
// '1,2' + '2,1' = '1,22,1'
```
特别注意 'a' + + 'b'
```
'a' + + 'b' // -> 'aNaN'
// 因为 + 'b' -> NaN
```
##### == 操作符

![avatar][base64zhenzhibiao]

解析 [] == ![] 为true

```
// [] 转成 true，然后取反变成 false 
[] == false 
// 根据第 8 条得出 
[] == ToNumber(false) 
[] == 0 
// 根据第 10 条得出 
ToPrimitive([]) == 0 
// [].toString() -> '' 
'' == 0 
// 根据第 6 条得出 
0 == 0 // -> true
```
##### 比较运算符
1. 如果是对象，通过toPrimitive转换对象
2. 如果是字符串，通过unicode字符索引来比较

##### 原型与继承
参考同目录下文档 继承

##### new 
调用new关键字会执行以下四个步骤
1. 新生成一个对象
2. 新对象隐式原型链接到函数原型
3. 调用函数绑定this
4. 返回新对象

根据以上，我们可以自己实现一个 new
```
function creatObject(fun) {
    return function() {
        let obj = {
            __proto__: fun.prototype
        };
        let result = fun.apply(obj, arguments)
        return typeof result === 'object' ? result : obj
    }
}


function person(name, age) {
  this.name = name
  this.age = age
}
let obj = _new(person)('LL', 100)
console.log(obj)
//  {name: 'LL', age: 100}
```
或者
```
function Person(name, age, job) {
    this.name = name;
    this.age = age;
    this.job = job;
    this.sayName = function () {
        alert(this.name);
    };
}
 
let New = function (P) {
    let o = {};
    let arg = Array.prototype.slice.call(arguments,1);
    
    o.__proto__ = P.prototype;
    P.prototype.constructor = P;
    
    P.apply(o,arg);
    
    return o;
};
let p1 = New(Person,"Ysir",24,"stu");
let p2 = New(Person,"Sun",23,"stus");
console.log(p1.name);//Ysir
console.log(p2.name);//Sun
console.log(p1.__proto__ === p2.__proto__);  //  true
console.log(p1.__proto__ === Person.prototype);  //  true
```

对于实例对象，都是通过new产生的，不论是function Foo() 还是 let a = { b : 1}

对于创建一个对象来说，更推荐使用字面量方式创建对象。因为使用new Object()的方式创建对象需要通过作用域链一层层找打Object，使用字面量方式就没这个问题。



##### this 规则简介
```
function foo() {
    console.log(this.a)
}
var a = 1
foo()  // 1
var obj = {
    a: 2,
    foo: foo
}
obj.foo() // 2
// 以上两种情况 this 值依赖于调用函数前的对象，优先级第二个情况大于第一个情况

// 以下情况是优先级最高的，this只会绑定在c上，不会被任何方式修改this指向
var c = new foo()
c.a = 3
console.log(c.a) // 3 
// 还有种情况就是利用call, apply, bind改变this，优先级仅次于new
```

箭头函数中的this需要单独考虑
```
function aaa() {
    return () => {
        return () => {
            console.log(this)
        }
    }
}
console.log(aaa()()());
```
箭头函数其实是没有this的，箭头函数的this只取决于他外面的第一个不是箭头函数的函数的this。在上面的例子中，因为调用aaa符合前面代码的第一个情况，所以this是window。并且this一旦绑定了上下文，就不会被任何代码改变。


##### 执行上下文

当执行js代码时，会产生三种执行上下文

1. 全局执行上下文
2. 函数执行上下文
3. eval执行上下文

每个执行上下文都有三个重要属性
1. 变量对象(OV)，包含变量，函数声明和函数的形参，该属性只能在全局上下文中访问
2. 作用域链（js采用词法作用域，也就是说变量的作用域在定义时就决定了）
3. this
```
var a = 10
function foo(i) {
    var b = 20
}
foo()
```
上述代码中，执行栈中有两个上下文：全局上下文和函数foo上下文
```
stack = [
    globalContent,
    fooContent
]
```
对于全局上下文，VO大概是这样子
```
globalContent.VO === global
globalContent.VO = {
    a: undefined,
    foo: <Function>,
}
```
对于函数foo来说，VO不能访问，只能访问到活动对象(AO)
```
fooContent.VO === foo.VO
fooContent.AO = {
    i: undefined,
    b: undefined,
    arguments: <>
}
// arguments 是函数独有的对象（箭头函数没有）
// 该对象是一个伪数组，有length属性而且可以通过下标访问元素
// 该对象中的callee属性代表函数本身
// caller属性代表函数的调用者
```
对于作用域链，可以把它理解成包含自身变量对象和上级变量对象的列表，通过[[Scope]]属性查找上级变量
```
fooContext.[[Scope]] = [
    globalContent.VO
]
fooContent.Scope = fooContent.[[Scope]] + fooContent.VO
fooContent.Scope = [
    fooContent.VO,
    globalContent.VO
]
```
常见例子：
```
b()  // 'call b'
console.log(a)
a = 'hello world'
function b () {
    console.log('call b')
}
```
因为函数的提升，可以正常打印'call b'。通常的解释是说讲声明的代码移动到了顶部，其实更准确的解释是：在生成执行上下文时，会有两个阶段，第一阶段是创建阶段，js解释器会找出需要提升的变量和函数，并且给他们提前在内存中开辟空间，函数的话会将整个函数存入内存中，变量只声明并且赋值为undefined，第二阶段：执行代码阶段可以提前使用

在提升过程中，相同的函数会覆盖上一个函数，并且函数优先于变量提升
```
b() // call b second 
function b() { 	
    console.log('call b fist')
} 
function b() {
   console.log('call b second')
} 
var b = 'Hello world'
```
var 太过灵活会产生很多错误，所以es 6引入了let。let不能在声明前使用，let提升了声明但没有赋值，因为暂时性死区导致了不能在声明前使用。

对于非匿名的立即执行函数需要注意：
```
var foo = 1
(foo(){
    foo = 10
    console.log(foo)
}())
// ƒ foo() {
//     foo = 10
//     console.log(foo)
//  }
// Uncaught TypeError: 1 is not a function
```
js解释器遇到非匿名的立即执行函数时，会创建一个辅助的特定对象，然后将函数名称作为这个对象的属性，因此函数内部才可以访问到foo，同时这个值又是只读的，所以对它的赋值并不生效，所以打印结果还是这个函数，而且会报错，调用的foo非函数，虽然它进行了执行。

```
specialObject = {};
Scope = specialObject + Scope;
foo = new FunctionExpression;
foo.[[Scope]] = Scope;
specialObject.foo = foo; // {DontDelete}, {ReadOnly}
delete Scope[0]; // remove specialObject from the front of scope chain
```
##### 闭包

定义：能够读取其他函数内部变量的函数。js中，内部函数总是可以访问其所在的外部函数的参数和变量，即使是在外部函数被销毁之后。

函数A返回了函数B，并且B中使用了A的变量，函数B就被称为闭包。

```
function fa() {
    var c = 1
    function fb() {
        console.log(c)
    }
    return fb()
}
fa() // 1
```
为什么函数A已经弹出调用栈了，函数B还能引用A中的变量，因为函数A中的变量此时存储在堆上，现在的js引擎可以通过逃逸分析辨别哪些变量需要存储在堆，哪些变量需要存储在栈上。

经典题，通过闭包解决var定义函数的问题：
```
for ( var i=1; i<=5; i++) {
    setTimeout( function timer() {
        console.log( i ); 
    }, i*1000 );
}
```
setTimeout为异步，会先把循环执行完毕，此时i为6，所以输出5个6

解决办法，第一种闭包：
```
for ( var i=1; i<=5; i++) {
    (function(j){
        setTimeout(function timer() {
            console.log(j)
        }, j * 1000)
    })(i)
}
```
第二种，使用setTimeout的第三个参数
```
for ( var i=1; i<=5; i++) {
    setTimeout(function timer(j) {
        console.log(j); 
    }, i*1000, i); 
}
```
第三种，使用let定义i
```
for(let i = 1; i <= 5; i++) {
    setTimeout(function timer() {
        console.log(i);
    }, i * 1000) 
}
```
对于let来说，它会创建一个块级作用域，相当于
```
{
    let i = 0 {
        let ii = i
        setTimeout(function timer() {
            console.log(i)
        }, i * 1000)
    }
    i++ {
        let ii = i
        ...
    }
    i++ {
        let ii = i
        ...
    }
}
```

##### 深浅拷贝
浅拷贝：复制之后产生的变量和原来的变量指向同一个地址，彼此之间操作会互相影响。

深拷贝：在堆中重新分配内存，复制后的变量和原变量拥有不同地址，完全隔离，互不影响。(深拷贝是对对象以及对象的所有子对象进行拷贝)

赋值操作：普通类型赋值是在栈中重新分配内存，赋值双方互不影响，引用类型赋值后，双方指向同一个地址的引用，相互影响。

> 深浅拷贝 的主要区别就是：复制的是引用(地址)还是复制的是实例。

浅拷贝只能对最外层的对象进行拷贝，并不包括对象里面的为引用类型的数据，所以对象的子对象的改变依旧会相互影响。

```
var obj1 = {
    name: 'obj11',
    handle: 'handle1',
    subNames: {
        name: 'sub11'
    }
}
var obj2 = obj1
var obj3 = Object.assign({}, obj1)
var obj4 = { ...obj1 }

obj2.name = 'obj22'
console.log(obj1)
console.log(obj2)
console.log(obj3)
console.log(obj4)

obj3.subNames.name = 'sub33'
console.log(obj1)
console.log(obj2)
console.log(obj3)
console.log(obj4)
```
通常浅拷贝就可以解决大部分问题，但是如果遇到需要深拷贝的场景，通常方法有：

1. JSON.parse(JSON.stringify(object))

但是该方法有局限性的：
会忽略 undefined，
不能序列化函数，
不能解决循环引用的对象，
不能处理正则表达式

如果你所需拷贝的对象含有内置类型并且不包含函数，可以使用 MessageChannel
```
function structuralClone(obj) {
    return new Promise(resolve => {
        const {port1, port2} = new MessageChannel();
        port2.onmessage = ev => resolve(ev.data);
        port1.postMessage(obj);
    });
}
var obj = {a: 1, b: {  c: 3 }}
// 注意该方法是异步的
// 可以处理 undefined 和循环引用对象
const clone = await structuralClone(obj);
```

如果MessageChannel依旧不满足需求，可以使用lodash的深拷贝函数。


##### 模块化

###### ES6 模块

在有Babel的情况下，我们可以直接使用es6的模块化
```
// file a.js
export function a() {}
export function b() {}
// file b.js
export default function() {}

// other files
import {a, b} from './a.js'
import xxx from './b.js'

```

###### CommonJS
CommonJS 是Node独有的规范，浏览器环境需要用到 Browerify解析

```
// a.js
module.exports = {
    a: 1
}
// or 
exports.a = 1
// b.js
var module = require('./a.js')
module.a // -> log 1
```
上述代码中，module.exports 和 exports 很容易混淆，它们大致的内部实现如下
```
var module = require('./a.js')
module.a
// 这里其实是包装了一层立即执行函数，这样就不会污染全局变量
// 重要的是module这里，module是Node独有的一个变量
module.exports = { 
    a: 1
}
// 基本实现
var module = {
    exports: {} // exports 就是个空对象
}
// 这个是为什么 exports 和 module.exports 用法相似的原因
var exports = module.exports
var load = function(module) {
    // 导出的东西
    var a = 1
    module.exports = 1
    return module.exports
}
```
再来说module.exports 和 exports，用法其实是相似的，但是不能对exports直接赋值，直接赋值不会有任何效果。

对于CommonJS和ES6中的模块化，两者的区别是：
CommonJS规范在Node中发扬光大，它有以下特性：
1. 动态加载模块：CommonJS模块的动态加载能轻松实现懒加载
2. 加载整个模块：CommonJS模块中，导出的是整个模块
3. 每个模块皆为对象：CommonJS模块都被视为一个对象
4. 值拷贝：CommonJS模块输出和函数的值传递相似，都是值的拷贝

ES6模块：
1. 静态解析：在解析阶段就确定输出的模块，所以es6模块的import一般写在引入文件的开头
2. 模块不是对象：在es6模块中，每个模块并不会当作一个对象看待
3. 加载的不是整个模块：在es6模块中经常会有多个export导出
4. 模块引用：es6模块中，导出的并不是模块的值拷贝，而是这个模块的引用

AMD：
AMD是RequireJs的规范，通过 define 方法定义模块，通过 require 方法实现代码的模块加载
AMD依赖前置，CMD依赖就近
CMD 是同步加载规范，AMD 是非同步加载规范，允许指定的回调函数
```
define(['./a', './b'], function(a, b) {
    a.do()
    b.do()
})
define(function(require, exports, module) {
    var a = require('./a')
    a.dosomething()
    var b = require('./b')
    b.dosomething()
})
```

[base64zhenzhibiao]:data:image/jpeg;base64,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