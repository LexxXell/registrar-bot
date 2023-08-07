export const formatDate = (currentDate: Date) => `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-01`;
export const formatDateNumber = (n: number) => (n < 10 ? `0${n}` : `${n}`);
