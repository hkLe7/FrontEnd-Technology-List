// 防抖函数 debounce
function debounce(callback, time) {


}



// 节流函数 throttle


function isInclude(target, array) {
    var rowCount = array.length - 1, i, j;
    for(i=rowCount,j=0; i >= 0 && j < array[i].length;){
        if(target == array[i][j]) {
            return true;
        } else if(target > array[i][j]) {
            j++;
            continue;
        } else if(target < array[i][j]) {
            i--;
            continue;
        }
    }
    return false;
}