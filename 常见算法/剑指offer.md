### 剑指offer
1. 在一个二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。 
```
function find(target, arr) {
  const m = arr.length,
        n = arr[0].length;
  let row = 0,
      col = m - 1;
  if (m === 0 && n === 0) return false
  while (row <= n - 1 && col >= 0) {
    if (target > arr[row][col]) {
      row++
    } else if (target < arr[row][col]) {
      col--
    } else {
      return true
    }
  }
}

```
2. 合并两个有序数组
```
let arr1 = [1, 3, 5], arr2 = [2, 4, 6]
function combineSort(arr1, arr2) {
  let i = 0, j = 0, result = [];
  while(i < arr1.length || j < arr2.length) {
    if (arr1[i] <= arr2[j]) {
      result.push(arr1[i])
      i++
    } else {
      result.push(arr2[j])
      j++
    }
  }
  console.log(result)
  return result
}
```
https://www.zhihu.com/question/19830721/answer/667233164


3. 二分搜索 Binary Search

4. 分治 Divide Conquer

5. 宽度优先搜索 Breadth First Search

6. 深度优先搜索 Depth First Search

7. 回溯法 Backtracking

8. 双指针 Two Pointers

9. 动态规划 Dynamic Programming

10. 扫描线 Scan-line algorithm

11. 快排 Quick Sort

```
function quickSort(arr) {
  if (arr.length <=1) return arr
  const index = parseInt(arr.length / 2)
  const flagValue = arr[index]
  let leftArr = [],
      rightArr = [];

  for (let i = 0; i < arr.length; i++) {
    if (index === i) continue
    if (arr[i] <= flagValue) leftArr.push(arr[i]); else rigthArr.push(arr[i])
  }

  return [...quickSort(leftArr), flagValue, ...quickSort(rightArr)]
}
```

12. 单链表树算法和携程机制，实现任务动态分割

13. 前端分片
```
function multistep(steps,args,callback){
    var tasks = steps.concat();

    setTimeout(function(){
        var task = tasks.shift();
        task.apply(null, args || []);   //调用Apply参数必须是数组

        if(tasks.length > 0){
            setTimeout(arguments.callee, 25);
        }else{
            callback();
        }
    },25);
}
```