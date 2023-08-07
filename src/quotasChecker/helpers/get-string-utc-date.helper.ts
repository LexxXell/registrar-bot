import { dateUTCSuffix } from './constants.helper';
import { formatDateNumber } from './format-date.helper';

export const getStringUTCDate = ({ year, month /** 0-11 */, day = 1 }: { year: number; month: number; day?: number }) =>
  `${year}-${formatDateNumber(month + 1)}-${formatDateNumber(day)}${dateUTCSuffix}`;
