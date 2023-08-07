import axios from 'axios';
import { FormularTypes } from '../@types';
import { formatDateNumber } from './format-date.helper';
import { getDateRange } from './get-date-range.helper';
import { axiosConfig, excludedDaysLookup, url_zile } from './constants.helper';
import { getStringUTCDate } from './get-string-utc-date.helper';

export async function getDates(date: Date, tip_formular: keyof typeof FormularTypes = 'ART11_BUCURESTI') {
  const { year, month, start_day, end_day } = getDateRange(date);

  const reqBody = {
    azi: `${year}-${formatDateNumber(month + 1)}`,
    tip_formular: FormularTypes[tip_formular],
  };

  const response = await axios.post(url_zile, reqBody, axiosConfig);
  const dates = response.data.data as string[];

  const excludedDays = excludedDaysLookup[tip_formular];

  return Array.from({ length: end_day - start_day + 1 }, (_, index) => {
    const _date = new Date(getStringUTCDate({ year, month, day: start_day + index }));
    const formattedDate = _date.toISOString().slice(0, 10);
    return !excludedDays.includes(_date.getUTCDay()) && !dates.includes(formattedDate) ? formattedDate : null;
  }).filter((element) => element !== null && new Date(element).getMonth() === month);
}
