export function swap<T>(array: T[], index: number, swapIdx: number) {
  const temp = array[index];
  array[index] = array[swapIdx];
  array[swapIdx] = temp;
}
