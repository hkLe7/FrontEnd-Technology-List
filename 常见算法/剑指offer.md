### 剑指offer
1. 在一个二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。 
```

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

3. 二分搜索 Binary Search

4. 分治 Divide Conquer

5. 宽度优先搜索 Breadth First Search

6. 深度优先搜索 Depth First Search

7. 回溯法 Backtracking

8. 双指针 Two Pointers

9. 动态规划 Dynamic Programming

10. 扫描线 Scan-line algorithm

11. 快排 Quick Sort

12. 单链表树算法和携程机制，实现任务动态分割