
/**
 * Rotate an array to the left
 * @param array The array
 * @param n The number of positions to rotate
 * @returns The rotated array
 */
function rotate_left(array, n) {
  var result = []
  for (var i = 0; i < array.length; ++i) {
    result.push(array[(i+n) % array.length])
  }
  return result;
}
