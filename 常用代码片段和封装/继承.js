function test(obj) {
    obj = {a:1}
}
var obj = {a: 0}
test(obj)
console.log(obj) // {a: 0}

function test(obj) {
    obj.a = 1
}
var obj = {a: 0}
test(obj)
console.log(obj) // {a: 1}

function test(obj) {
    obj.a = 1
}
var obj = {a: 0}
obj = test(obj)
console.log(obj) // undefined