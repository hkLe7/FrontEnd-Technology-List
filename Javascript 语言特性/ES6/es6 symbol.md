### es 6 Symbol

> 引入 Symbol 的主要原因，保证每个属性是独一无二的。

> Symbol 有 Symbol 函数生成，函数的参数是对这个值的描述。如果传入的值是一个对象，则会对其进行toString。

> Symbol 不能和其他值运算，可以 toString，可以转化布尔值，但是不能转化数字。
```
let sym = Symbol('SYM');

sym.toString() //  "Symbol('SYM')"

!sym   // false

sym + 2  // type error

```
#### 应用场景

在对象的属性名称中可以用 Symbol 来保证键的唯一性，使用时要注意需要带 [], 不然键名使用的是一个与 Symbol 同名的字符串。
```
let sym = Symbol('sym');
let obj = {
    [sym]: function(arg) { console.log(arg) }
}
// 使用方式也是 []
obj[sym](123); // 123
```

Symbol 作为属性名不会被 for...in 和 for...of 遍历，也不好被 Object.keys()、Object.getOwnPropertyNames()、JSON.stringify() 返回，但是它也并非私有属性，可以用 Object.getOwnPropertySymbols() 获取，此方法返回当前对象的所有 Symbol 合集。还可以用 Reflect.ownKeys() 获取所有类型的键名。可以利用此特性为对象定义一些非私有的但是只想在内部使用的方法。


