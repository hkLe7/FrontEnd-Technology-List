### typescript基础

#### 基础类型和变量申明

略

#### 接口

为类型命名和为你的代码或者第三方代码定义契约

```
interface LabelledValue {
  label: string
}

function printLabel(labelObj: LabelledValue) {
  console.log(labelObj.label)
}

let myObj = { size: 10, label: 'newLabel' }
printLabel(myObj)
```

LabelledValue 接口描述了函数参数的需求，代表了有一个 label 属性且类型为 string 的对象。

##### 可选属性

接口的属性不全是必需的。可选属性在应用options bags模式时很常用。

```
interface SquareConfig {
  color?: string;
  width?: number;
}
```

##### 只读属性

可以在属性名前用 readonly 来指定只读属性：

```
interface Point {
  readonly x: number;
  readonly y: number;
}
```

#### 类


#### 函数


#### 泛型

