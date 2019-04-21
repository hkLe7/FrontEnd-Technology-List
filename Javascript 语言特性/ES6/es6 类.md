### es6 类

es6 类的实现和 es5 中构造函数的原型一致，class语法是对应原写法的一种语法糖。

```
class Person {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    multip() {
        return this.x * this.y;
    }
}
```
等同于
```
var Person = function(x, y) {
    this.x = x;
    this.y = y;
}
Person.prototype.multip = function() {
    return this.x * this.y;
}
```
但是需要注意在类内部定义的方法 multip 是不可枚举的，但是通过 es5 构造函数定义的方法是可枚举的 multip。
```
var Person = function(x, y) {
    this.x = x;
    this.y = y;
}
Person.prototype.multip = function() {
    return this.x * this.y;
}

Object.key(Person.prototype)
// ["multip"]
Object.getOwnPropertyNames(Person.prototype)
// ["constructor", "multip"]
```
类必须有 constructor 函数，如果没用添加，js引擎会帮我们添加一个空 constructor。

类必须通过new关键字调用，构造函数可以直接调用。

#### get 和 set
可以通过 get 和 set 关键字来给类中的某个属性设置存值函数和取值函数，拦截该属性的存取行为:
```
class GetAndSet {
    constructor() {

    }

    get prop() {
        console.log('getter')
    }

    set prop(y) {
        console.log(y)
    }
}
let test = new GetAndSet()
test.prop = 333
// 333
test.prop
// 'getter'
```
#### Class 表达式

类的属性名字可以用表达式，类也可以使用表达式的形式定义。利用表达式可以写出立即执行的类。
```
const ExClass = new class {
    constructor(name) {
        this.name = name
    }
    sayName() {
        console.log(this.name) 
    }
}('tom');
ExClass.sayName();
```

#### this 指向
类内部的 this 默认指向类的实例，但是如果把类内部的方法提取到外部使用，this 会指向方法的外部运行环境。所以以下代码会报错。
```
class logger{
    printName() {
        this.print(`Hello ${name}`)
    }

    print(text) {
        console.log(text)
    }
};
let log = new logger();
const { printName } = log;
printName();
// Uncaught TypeError: Cannot read property 'print' of undefined
```
解决办法：

手动绑定 this
```
class logger{
    constructor() {
        this.printName = this.printName.bind(this)
    }
    printName(name = 'Tom') {
        this.print(`Hello ${name}`)
    }

    print(text) {
        console.log(text)
    }
};
let log = new logger();
const { printName } = log;
printName();
```
使用箭头函数
```
class logger {
    constructor() {
        this.printName = (name = 'Tom') => {
            this.print(`Hello ${name}`)
        }
    }

    print(text) {
        console.log(text)
    }
}
let log = new logger();
const { printName } = log;
printName();
```
使用 proxy

```
待补充
```
#### 静态方法
类的方法前有 static 关键字，表明该方法是一个静态方法，可以直接在类上调用，但是不能通过类的实例调用。
```
class Foo {
    static classMethod() {
        return 'Hello';
    }
}
Foo.classMethod();
// 'Hello'
let foo = new Foo();
foo.classMethod();
//  TypeError: foo.classMethod is not a function
```
静态方法和普通方法可以重名，静态方法内的 this 指向为类而不是实例。
```
class FnStatic {
    static test() {
        this.baz()
    }

    static baz() {
        console.log('baz')
    }

    baz() {
        console.log('tt')
    }
}
FnStatic.test(); // baz
FnStatic.baz(); // baz
let fns = new FnStatic();
fns.baz(); // tt
```
父类的静态方法可以被子类继承，静态方法可以从**super**对象上调用。

#### 实例属性和静态属性

实例属性可以写在 constructor 中，也可以直接写在类的最顶层。
```
class Attr {
    constructor() {
        this._count = 0
    }
}
// 两种写法一样
class Attr {
    _count = 0;
}
```
静态属性是指 Class 本身的属性，而不是定义在实例对象(this)上的属性。

目前只有一种写法：
```
class Per {

}
Per.propA = 1;
```
新提案可以用 static 关键字：
```
class Per {
    static propA = 1;
}
```

#### 私有属性和私有方法 ？？

目前只能通过模拟方式实现私有属性，新提案中用 # 来标识私有属性。
```
class Widget {
    constructor() {
        this.test()
    }
    foo (baz) {
        bar.call(this, baz);
    }
    test() {
        console.log(this.snaf);
    }
    
}
function bar(baz) {
    return this.snaf = baz;
}

```
