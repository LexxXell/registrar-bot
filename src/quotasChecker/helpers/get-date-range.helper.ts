import { DateRange } from '../@types/date-range.type';
import { startDateShift } from './constants.helper';
import { getDaysInMonth } from './get-days-in-month.helper';
import { getStringUTCDate } from './get-string-utc-date.helper';

export function getDateRange(date: Date): DateRange {
  const currentDate = new Date();
  const currentMonth = currentDate.getUTCMonth();
  const currentYear = currentDate.getUTCFullYear();

  let year = date.getUTCFullYear();
  let month = date.getUTCMonth();
  let end_day = getDaysInMonth(date);
  let start_day = 1;

  if (year === currentYear && month === currentMonth) {
    start_day = currentDate.getDate() + startDateShift;
  }

  if (start_day > end_day) {
    start_day = start_day - end_day;
    month++;
    if (month > 11) {
      month = 1;
      year++;
    }
    end_day = getDaysInMonth(new Date(getStringUTCDate({ year, month })));
  }

  return { year, month, start_day, end_day };
}
