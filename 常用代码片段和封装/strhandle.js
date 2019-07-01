/**
 字符串操作 
 **/ 
// 1. 判断回文字符串
function palindrome(str) {
    var re = /[\W_]/g;
    // 将字符串变成小写字符，并干掉除字母数字外的字符
    var lowRegStr = str.toLowerCase().replace(re, '');
    // 如果字符串lowRegStr的length长度为0时，字符串即是palindrome
    if(lowRegStr.length === 0) return true;
    if(lowRegStr[0] !== lowRegStr[lowRegStr.length - 1]) return false;
    // 递归
    return palindrome(lowRegStr.slice(1, lowRegStr.length - 1));
}



// 数组转化千分位
const toDecimalMark = num => num.toLocaleString('en-US')

// 返回字母出现次数
function accountTimesInStr(str) {
    if (str.length === 1) {
        return {
            str: 1
        }
    };
    let charObj = {};
    for (let i = 0; i < str.length; i++) {
        if (!charObj[str.charAt(i)]) {
            charObj[str.charAt(i)] = 1;
        } else {
            charObj[str.charAt(i)] += 1;
        }
    }
    return charObj;
}

// 返回出现最多的字母
function checkMost(str) {
    if (str.length === 1) {
        return `${str}: 1次`
    }

    let charObj = {}, 
    maxValue = 1, 
    maxStr = '';
    for(let i = 0; i < str.length; i++) {
      !charObj[str.charAt(i)] ? charObj[str.charAt(i)] = 1 : charObj[str.charAt(i)] += 1;
    }
    
    for (k in charObj) {
        if (charObj[k] > maxValue) {
            maxStr = k
            maxValue = charObj[k]
        }
    }
    return `${maxStr}: ${maxValue}次`
}

// 驼峰字符串格式化
const formCamelCase = (str, separator = '_') => str
.replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
.replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2').toLowerCase()


// 解析url正则
const urlToParamsObj = urlStr => JSON.parse(`{"${decodeURIComponent(urlStr.split('?')[1]).replace(/&/g, '","').replace(/=/g, '":"')}"}`)

// 解析url常规
function resolveURL(url) {
    let args = url.split('?')[1].split('&'),
    obj = {},
    tmpName,
    tmpValue;
    for (let i = 0; i < args.length; i++) {
        [tmpName, tmpValue] = args[i].split('=');
        obj[tmpName] = tmpValue
    }

    return obj;
}

