export function checkArrayLengths(arr: any[][], controlLength?: number): boolean {
  if (!controlLength) {
    controlLength = arr.reduce((max, arr) => {
      return Math.max(max, arr.length);
    }, 0);
  }

  if (arr.length === 0) {
    return true;
  }

  return arr.every((el) => el.filter((el) => el != '').length === controlLength);
}
