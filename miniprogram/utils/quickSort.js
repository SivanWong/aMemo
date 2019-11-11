// quickSort.js

const quickSort = (arr, key) => {
  if (arr.length <= 1) {
    return arr;
  }
  var pivotIndex = Math.floor(arr.length / 2);
  var pivot = arr.splice(pivotIndex, 1)[0];
  var left = [];
  var right = [];
  for (var i in arr) {
    var item = key === 'date' ? new Date(arr[i][key]) : arr[i][key];
    var pItem = key === 'date' ? new Date(pivot[key]) : pivot[key];
    if (item < pItem) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  
  return quickSort(left, key).concat([pivot], quickSort(right, key));
}

module.exports = {
  quickSort: quickSort
}