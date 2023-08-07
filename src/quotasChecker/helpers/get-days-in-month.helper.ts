export function getDaysInMonth(date: Date): number {
  const isLeapYear = (year: number): boolean => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const month = date.getMonth();
  return month === 1 && isLeapYear(date.getFullYear()) ? 29 : [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}
