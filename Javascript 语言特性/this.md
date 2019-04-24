### this

#### this 的本质
this 并非像它的语义一样指向自身难保，其实它是一个指针，指向调用对象的函数。

this的绑定规则：
1. 默认绑定
2. 隐式绑定
3. 硬绑定
4. new 绑定
##### 默认绑定
在不能应用其他绑定规则时使用默认规则，通常是独立函数调用。
```
function sayHi() {
  console.log('Hello,', this.name)
}
var name = 'xiaoming'
sayHi()
```
在调用sayHi()时，应用了默认绑定，this指向全局对象（非严格模式下），严格模式下，this指向undefined。undefined上没有this对象，会抛出错误。

上面的代码在浏览器环境运行结果是 'Hello xiaoming'，如果在node环境，结果就是'Hello undefined'。因为node环境中，name并不是挂在全局对象上。目前我们只讨论浏览器环境的执行结果。

##### 隐式绑定
函数的调用是在某个对象上触发的，即调用位置上存在上下文对象。典型的形式为 XXX.fn() 我们来看一段代码：
```
function sayHi() {
  console.log('Hello,', this.name)
}
var person = {
  name: 'xiaoming',
  sayHi: sayHi
}
var name = 'xiaohong'
person.sayHi() // 'Hello,xiaoming'
```
sayHi函数声明在外部，严格来说并不属于person，但是调用sayHi时，调用位置会使用person的上下文来引用函数，隐式绑定会把函数调用中的this(sayHi中的this)绑定到这个上下文环境(person对象)

需要注意的是：对象属性链中只有最后一层会影响到调用位置。

```
function sayHi() {
  console.log('Hello,', this.name)
}
var person2 = {
  name: 'xiaoming',
  sayHi: sayHi
}
var person1 = {
  name: 'xiaoHong',
  friend: person2
}
person1.friend.sayHi() // 'Hello,xiaoming'
```
最后一层上下文最终确定this的指向是什么，不管有多少层，在判断this的时候，我们只关注最后一层。

隐式绑定存在陷阱，绑定很容易丢失
```
function sayHi() {
  console.log('Hello,', this.name)
}
var person = {
  name: 'xiaoming',
  sayHi: sayHi
}
var name = 'xiaohong'
var Hi = person.sayHi;
Hi() // 'Hello,xiaohong'
```
单独调用Hi返回的是函数sayHi上下文并不是person对象，而是全局对象。关于此类问题，如果我们需要关注 XXX.fn(),如果fn() 前什么都没有，肯定不是隐式绑定。

如果绑定发生在回调函数中：
```
function sayHi() {
  console.log('Hello,', this.name)
}
var person1 = {
  name: 'xiaoming',
  sayHi: function() {
    setTimeout(function() {
      console.log('Hello,', this.name)
    }, 0)
  }
}
var person2 = {
  name: 'xiaohong',
  sayHi: sayHi
}
var name = 'xiaobai'
person1.sayHi()
setTimeout(person2.sayHi, 100)
setTimeout(function() {
  person2.sayHi()
}, 200)

// Hello, xiaobai
// Hello, xiaobai
// Hello, xiaohong
```
第一条为默认绑定，第二条相当于把person.sayHi赋值给了setTimeout的fn，然后执行fn；第三条虽然包裹在setTimeout但是执行的是person2.sayHi，隐式绑定，this指向person2。

##### 显式绑定
通过call、apply和bind，显式指定this所指向的对象。

> call、apply和bind的第一个参数，就是对应函数this所指向的对象。call和apply的作用一样，只是传参的方式不同。call和apply都会执行对应的函数，而bind方法不会。
```
function sayHi() {
  console.log('Hello,', this.name)
}
var person = {
  name: 'xiaoming',
  sayHi: sayHi
}
var name = 'xiaohong'
var Hi = person.sayHi
Hi.call(person)  // Hi.apply(person) 
// Hello, xiaoming
```
此处的绑定只是在执行代码时有绑定关系，该绑定关系并不留存，如果不用变量保存，重新执行person.sayHi依旧根据上下文确定this。

显式绑定依旧会存在绑定丢失：

```
function sayHi() {
  console.log('Hello,', this.name)
}
var person = {
  name: 'xiaoming',
  sayHi: sayHi
}
var name = 'xiaohong'
var Hi = function(fn) {
  fn()
}
Hi.call(person, person.sayHi)
// Hello, xiaohong
```
Hi.call(person, person.sayHi)的确将this绑定到Hi中的this。但是在执行fn时，相当于直接在调用了var fn = person.sayHi() fn();所以返回 Hello, xiaohong

#### new 绑定

在js中，函数可以用new来调用，即对函数的构造调用；
> 使用new来调用函数，会自动执行下面的操作：
1. 创建一个新对象
2. 将构造函数的作用域赋值给新对象，即this指向这个新对象
3. 执行构造函数中的代码
4. 返回新对象

因此我们在使用new来调用函数时候，就会将新对象绑定到这个函数的this上。

```
function sayHi(name) {
  this.name = name
}
var Hi = new sayHi('xiaoming')
console.log('Hello,', Hi.name)
// 'Hello,xiaoming'
```
在 var Hi = new sayHi('xiaoming')这一步，会将sayHi中的this绑定到Hi对象上。

#### 绑定优先级
> 四种规则中：new > 显式绑定 > 隐式绑定 > 默认绑定

当我们把null或者undefined作为绑定对象传入call、apply和bind中时，这些值在调用时会被忽略，实际应用默认绑定规则。

#### 箭头函数
箭头函数没有自己的this，this集成于外层代码的this。使用中需要注意：
(1) 函数题内的this对象继承外层代码块的this
(2) 不可以当作构造函数，不能用new方法
(3) 不可以使用arguments对象，该对象在函数体内不存在，如果使用，用rest参数代替
(4) 不可以使用yield命令，因此箭头函数不能用作 Generator 函数
(5) 箭头函数没有自己的this，所以不能用call、apply和bind改变this指向

```
var obj = {
  name: 'xiaoming',
  hi: function () {
    console.log(this.name)
    return () => {
      console.log(this.name)
    }
  },
  sayHi: function() {
    return function() {
      console.log(this.name)
      return () => {
        console.log(this.name)
      }
    }
  },
  say: () => {
    console.log(this.name)
  }
}
var name = 'xiaohong'

let hi = obj.hi() // xiaoming
hi() // xiaoming
let sayHi = obj.sayHi()  
let fun1 = sayHi() // xiaohong
fun1() // xiaohong
obj.say() // xiaohong
```
分析：
1. obj.hi() 隐式绑定在obj，输出 obj.name
2. 执行hi() 箭头函数，this指向外层上下文obj，输出 obj.name
3. sayHi() 函数相当于创造了一个新函数在window下执行，输出window.name
4. 箭头函数this指向外层，由3可知为window，输出window.name
5. 箭头函数指向外层，window，输出window.name

#### 总结
如何准确判断this？
1. 函数是否在new中调用，如果是，this指向new出的对象
2. 函数是否通过call和apply调用，或者使用了bind，如果是，this指向绑定对象
3. 函数是否在某个上下文对象中调用（隐式绑定），如果是，this指向上下文对象，一般是obj.foo()
4. 如果以上皆不是，那么使用默认绑定，在严格模式下，绑定到undefined，否则绑定到全局对象
5. 如果把null或者undefined作为this对象绑定传入call、apply和bind，这些值会被忽略，实际为默认绑定规则
6. 如果是箭头函数，箭头函数的this继承外层代码块

综合题目
```
var number = 5;
var obj = {
  number: 3,
  fn1: (function(){
    var number;  // undefined
    this.number *= 2; // window.number = 10
    number = number * 2; // NaN
    number = 3; // number = 3
    return function() {
      var num = this.number; // 
      this.number *= 2;  // 
      console.log(num); // 
      number *= 3;
      console.log(number); // 
    }
  })()
}
var fn1 = obj.fn1;
fn1.call(null); // 10 9
obj.fn1(); // 3 27 
console.log(window.number); // 20
```
