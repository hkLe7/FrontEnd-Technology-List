// 冒泡排序
function bubbleSort(arr) {
    for(var i = 0; i < arr.length - 1; i++) {
        for(var j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
            }
        }
    }
    return arr;
}

// 快排
function quickSort(arr, l, r) {
    if(l < r) {
        var i = l, j = r, x = arr[i];
        while(i < j) {
            while( i< j && arr[j] > x) j--;
            if(i < j) arr[i++] = arr[j];
            while(i < j && arr[i] < x) i++;
            if(i < j) arr[j--] = arr[i];
        }
        arr[i] = x;

        quickSort(arr, l, i - 1);
        quickSort(arr, i + 1, r);
    }
}

// SORT实现

// 二路归并
function merge(left, right) {
    var result = [],
    il = 0,
    ir = 0;

    while(il < left.length && ir < right.length) {
        if (left[il] < right[ir]) {
            result.push(left[il++]);
        } else {
            result.push(right[ir++]);
        }
    }
    while(left[il]) {
        result.push(left[il++]);
    }
    while(right[ir]) {
        result.push(right[ir++])
    }

    return result;
}

// 千分位1
function formatThousand1(num) {
    var str = num + '';
    return str.split("").reverse().reduce((prev, next, index) => {
      return ((index % 3) ? next : (next + ',')) + prev;
    })
  }

// 千分位2
function formatThousand2 (num) {  
    var reg=/\d{1,3}(?=(\d{3})+$)/g;   
    return (num + '').replace(reg, '$&,');  
}

// 去重
function es6Unique(arr) {
    let result = [ ...new Set(arr) ]
    return result
}
// 如果处理引用类型值的去重
// 使用loadash
import _ from 'lodash'
_.uniqWith(objects, _.isEqual)
// 其中， _.isEqual(value,other)用于执行深比较来确定两者的值是否相等
// _.uniqWith()做去重处理

function es5Unique(arr) {
    // 存在问题， '111' 和 111无法区分
    let result = [], obj = {};
    for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i]]) {
            obj[arr[i]] = true
            result.push(arr[i])
        } 
    }
    return result
}
// 交集，并集，差集
function intersect(arr1, arr2) {
    // let set1 = new Set(arr1)
    let set2 = new Set(arr2)
    return arr1.filter(x => set2.has(x))
}

function union(arr1, arr2) {
    return [ ...new Set(arr1.concat(arr2))];
}

function differ(arr1, arr2) {
    let set2 = new Set(arr2)
    return arr1.filter(x => !set2.has(x));
}



var arr1 = [1, 99, 'pppp', 89]
var arr2 = [10, 199, 'pppp', true]

differ(arr1, arr2)


var arr = [1, 999, 999, 999, 'iioo', 'iioo', 11, 111, 111, '111', false, false, false]
es5Unique(arr)


function sleep(duration) {
    return new Promise((res, rej) => {
        console.log('b')
        setTimeout(res, duration)
    })
}

async function asfn() {
    console.log('a')
    await sleep(2000)
    console.log('c')
